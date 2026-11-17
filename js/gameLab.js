/**
 * Gate 4 Interactive Lab (Optimized for High FPS)
 * 1. Playable Mini-Game "Neon Drift" (Game Development)
 * 2. Real-time Data Stream Visualizer (Data Analytics)
 * Both engines pause their animation loops when idle to preserve GPU resources.
 */

class MiniGame {
  constructor() {
    this.canvas = document.getElementById('miniGameCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.scoreValEl = document.getElementById('gameScoreVal');
    this.highScoreValEl = document.getElementById('gameHighScoreVal');
    this.overlayScreen = document.getElementById('gameOverlayScreen');
    this.overlayHeading = document.getElementById('gameOverlayHeading');
    this.overlayText = document.getElementById('gameOverlayText');
    this.actionBtn = document.getElementById('gameActionBtn');
    this.actionBtnText = document.getElementById('gameActionBtnText');

    this.isPlaying = false;
    this.isLoopRunning = false;
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('sanjay_game_high') || '0', 10);
    this.lives = 3;

    // Paddle
    this.basePaddleWidth = 100;
    this.paddle = {
      x: 350,
      y: 352,
      width: 100,
      height: 12,
      targetX: 350,
      speed: 8.5
    };

    // Plasma Sphere
    this.ball = {
      x: 350,
      y: 340,
      vx: 3.5,
      vy: -5.0,
      radius: 6,
      stuck: true,
      baseSpeed: 5.6,
      speed: 5.6,
      trail: [],
      fireball: false
    };

    // Bricks Grid
    this.bricks = [];
    this.brickCols = 8;
    this.brickRows = 4;
    this.brickHeight = 18;
    this.brickPadding = 8;
    this.brickOffsetTop = 36;
    this.brickOffsetLeft = 24;

    // Game Objects
    this.particles = [];
    this.powerUps = [];
    this.lasers = [];
    this.floatingTexts = [];

    // PowerUp State
    this.powerUpState = {
      expandTimer: 0,
      laserTimer: 0,
      fireballTimer: 0
    };

    this.keys = { left: false, right: false };
    this.init();
  }

  init() {
    if (!this.canvas || !this.ctx) return;

    if (this.highScoreValEl) {
      this.highScoreValEl.textContent = String(this.highScore).padStart(4, '0');
    }

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      if (!this.isPlaying) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.keys.left = true;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.keys.right = true;
      } else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        if (this.ball.stuck) {
          this.launchBall();
        } else if (this.powerUpState.laserTimer > 0) {
          this.fireLasers();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.keys.left = false;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.keys.right = false;
      }
    });

    // Mouse steering directly on canvas
    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.isPlaying) return;
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      this.paddle.targetX = (e.clientX - rect.left) * scaleX;
    });

    // Canvas click: Launch ball if stuck or fire lasers
    this.canvas.addEventListener('click', () => {
      if (!this.isPlaying) return;
      if (this.ball.stuck) {
        this.launchBall();
      } else if (this.powerUpState.laserTimer > 0) {
        this.fireLasers();
      }
    });

    // Touch controls for mobile / tablet
    this.canvas.addEventListener('touchmove', (e) => {
      if (!this.isPlaying || e.touches.length === 0) return;
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      this.paddle.targetX = (e.touches[0].clientX - rect.left) * scaleX;
    }, { passive: true });

    this.canvas.addEventListener('touchstart', (e) => {
      if (!this.isPlaying) return;
      if (this.ball.stuck) {
        this.launchBall();
      } else if (this.powerUpState.laserTimer > 0) {
        this.fireLasers();
      }
    }, { passive: true });

    // Action Button
    if (this.actionBtn) {
      this.actionBtn.addEventListener('click', () => {
        this.startGame();
      });
    }

    // Build initial brick layout and render preview
    this.generateBricks();
    this.render();
  }

  generateBricks() {
    this.bricks = [];
    const availableWidth = this.canvas.width - (this.brickOffsetLeft * 2);
    const totalGaps = (this.brickCols - 1) * this.brickPadding;
    const brickWidth = Math.floor((availableWidth - totalGaps) / this.brickCols);

    const rowConfigs = [
      { color: '#ffaa00', hits: 1, pts: 250, label: 'QUANTUM', powerUp: 'laser' },
      { color: '#a855f7', hits: 2, pts: 200, label: 'AI CORE', powerUp: 'fireball' },
      { color: '#00f0ff', hits: 1, pts: 150, label: 'FULLSTACK', powerUp: 'expand' },
      { color: '#00ff66', hits: 1, pts: 100, label: 'SECURITY', powerUp: 'life' }
    ];

    for (let r = 0; r < this.brickRows; r++) {
      const cfg = rowConfigs[r] || rowConfigs[0];
      for (let c = 0; c < this.brickCols; c++) {
        const bx = this.brickOffsetLeft + c * (brickWidth + this.brickPadding);
        const by = this.brickOffsetTop + r * (this.brickHeight + this.brickPadding);

        // Assign power-ups to specific bricks for balanced progression
        const hasPowerUp = (c % 3 === 0 && r % 2 === 0) || (c === 4 && r === 1);
        const assignedPowerUp = hasPowerUp ? cfg.powerUp : null;

        this.bricks.push({
          x: bx,
          y: by,
          width: brickWidth,
          height: this.brickHeight,
          hits: cfg.hits,
          maxHits: cfg.hits,
          color: cfg.color,
          points: cfg.pts,
          powerUp: assignedPowerUp,
          active: true
        });
      }
    }
  }

  startGame() {
    this.isPlaying = true;
    this.score = 0;
    this.lives = 3;

    this.paddle.width = this.basePaddleWidth;
    this.paddle.x = this.canvas.width / 2;
    this.paddle.targetX = this.paddle.x;

    this.ball.stuck = true;
    this.ball.speed = this.ball.baseSpeed;
    this.ball.fireball = false;
    this.ball.trail = [];

    this.powerUpState = {
      expandTimer: 0,
      laserTimer: 0,
      fireballTimer: 0
    };

    this.particles = [];
    this.powerUps = [];
    this.lasers = [];
    this.floatingTexts = [];

    this.generateBricks();

    if (this.scoreValEl) this.scoreValEl.textContent = '0000';
    if (this.overlayScreen) this.overlayScreen.style.display = 'none';

    if (typeof soundEngine !== 'undefined') {
      soundEngine.playLaser();
    }

    if (!this.isLoopRunning) {
      this.isLoopRunning = true;
      requestAnimationFrame(() => this.loop());
    }
  }

  launchBall() {
    if (!this.ball.stuck) return;
    this.ball.stuck = false;

    // Angle upwards with random deviation
    const angle = (Math.random() - 0.5) * 0.7 - Math.PI / 2;
    this.ball.vx = Math.cos(angle) * this.ball.speed;
    this.ball.vy = Math.sin(angle) * this.ball.speed;

    if (typeof soundEngine !== 'undefined') {
      soundEngine.playClick();
    }
  }

  fireLasers() {
    const leftX = this.paddle.x - this.paddle.width * 0.38;
    const rightX = this.paddle.x + this.paddle.width * 0.38;
    const topY = this.paddle.y - this.paddle.height / 2;

    this.lasers.push({ x: leftX, y: topY, vy: -9 });
    this.lasers.push({ x: rightX, y: topY, vy: -9 });

    if (typeof soundEngine !== 'undefined') {
      soundEngine.playLaser();
    }
  }

  gameOver(isWin = false) {
    this.isPlaying = false;
    this.isLoopRunning = false;

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('sanjay_game_high', String(this.highScore));
      if (this.highScoreValEl) {
        this.highScoreValEl.textContent = String(this.highScore).padStart(4, '0');
      }
    }

    if (typeof soundEngine !== 'undefined') {
      if (isWin) soundEngine.playWarp();
      else soundEngine.playExplosion();
    }

    this.render();

    if (this.overlayScreen) {
      if (isWin) {
        this.overlayHeading.textContent = 'MATRIX DECRYPTED! VICTORY!';
        this.overlayText.textContent = `All quantum bricks eliminated! Total Score: ${this.score} pts. Excellent reflexes!`;
        this.actionBtnText.textContent = 'PLAY NEXT RUN';
      } else {
        this.overlayHeading.textContent = 'SIMULATION TERMINATED';
        this.overlayText.textContent = `All quantum shields depleted. Final Score: ${this.score} pts.`;
        this.actionBtnText.textContent = 'RETRY CYBER BREAKER';
      }
      this.overlayScreen.style.display = 'flex';
    }
  }

  loop() {
    if (!this.isPlaying) {
      this.isLoopRunning = false;
      return;
    }

    this.updatePhysics();
    this.render();

    if (this.isPlaying) {
      requestAnimationFrame(() => this.loop());
    } else {
      this.isLoopRunning = false;
    }
  }

  updatePhysics() {
    // 1. Paddle Controls
    if (this.keys.left) this.paddle.targetX -= this.paddle.speed;
    if (this.keys.right) this.paddle.targetX += this.paddle.speed;

    const minX = this.paddle.width / 2;
    const maxX = this.canvas.width - this.paddle.width / 2;
    this.paddle.targetX = Math.max(minX, Math.min(maxX, this.paddle.targetX));
    this.paddle.x += (this.paddle.targetX - this.paddle.x) * 0.28;

    // 2. Power-Up Timers
    if (this.powerUpState.expandTimer > 0) {
      this.powerUpState.expandTimer--;
      if (this.powerUpState.expandTimer <= 0) {
        this.paddle.width = this.basePaddleWidth;
      }
    }

    if (this.powerUpState.laserTimer > 0) {
      this.powerUpState.laserTimer--;
    }

    if (this.powerUpState.fireballTimer > 0) {
      this.powerUpState.fireballTimer--;
      if (this.powerUpState.fireballTimer <= 0) {
        this.ball.fireball = false;
      }
    }

    // 3. Ball Physics & Trail
    if (this.ball.stuck) {
      this.ball.x = this.paddle.x;
      this.ball.y = this.paddle.y - this.paddle.height / 2 - this.ball.radius - 1;
    } else {
      // Trail
      this.ball.trail.push({ x: this.ball.x, y: this.ball.y, alpha: 0.6 });
      if (this.ball.trail.length > 8) this.ball.trail.shift();

      this.ball.x += this.ball.vx;
      this.ball.y += this.ball.vy;

      // Wall Bounce
      if (this.ball.x - this.ball.radius <= 0) {
        this.ball.x = this.ball.radius;
        this.ball.vx = Math.abs(this.ball.vx);
        if (typeof soundEngine !== 'undefined') soundEngine.playClick();
      } else if (this.ball.x + this.ball.radius >= this.canvas.width) {
        this.ball.x = this.canvas.width - this.ball.radius;
        this.ball.vx = -Math.abs(this.ball.vx);
        if (typeof soundEngine !== 'undefined') soundEngine.playClick();
      }

      if (this.ball.y - this.ball.radius <= 0) {
        this.ball.y = this.ball.radius;
        this.ball.vy = Math.abs(this.ball.vy);
        if (typeof soundEngine !== 'undefined') soundEngine.playClick();
      }

      // Bottom Screen (Shield Loss)
      if (this.ball.y - this.ball.radius >= this.canvas.height) {
        this.lives--;
        this.createParticles(this.ball.x, this.canvas.height - 10, '#ff0055', 16);

        if (this.lives <= 0) {
          this.gameOver(false);
          return;
        } else {
          this.ball.stuck = true;
          this.ball.fireball = false;
          this.paddle.width = this.basePaddleWidth;
          this.powerUpState.expandTimer = 0;
          this.powerUpState.laserTimer = 0;
          this.powerUpState.fireballTimer = 0;
          if (typeof soundEngine !== 'undefined') soundEngine.playExplosion();
        }
      }

      // Paddle Collision (Angle Reflection)
      const paddleTop = this.paddle.y - this.paddle.height / 2;
      const paddleBottom = this.paddle.y + this.paddle.height / 2;
      const paddleLeft = this.paddle.x - this.paddle.width / 2;
      const paddleRight = this.paddle.x + this.paddle.width / 2;

      if (
        this.ball.y + this.ball.radius >= paddleTop &&
        this.ball.y - this.ball.radius <= paddleBottom &&
        this.ball.x >= paddleLeft &&
        this.ball.x <= paddleRight &&
        this.ball.vy > 0
      ) {
        // Calculate reflection angle based on hit location
        const hitOffset = (this.ball.x - this.paddle.x) / (this.paddle.width / 2);
        const maxAngle = Math.PI * 0.36; // 65 degrees max reflection angle
        const reflectAngle = hitOffset * maxAngle - Math.PI / 2;

        // Slight speed up on successive bounces
        this.ball.speed = Math.min(8.5, this.ball.speed + 0.08);
        this.ball.vx = Math.cos(reflectAngle) * this.ball.speed;
        this.ball.vy = Math.sin(reflectAngle) * this.ball.speed;
        this.ball.y = paddleTop - this.ball.radius - 1;

        this.createParticles(this.ball.x, paddleTop, '#00f0ff', 6);
        if (typeof soundEngine !== 'undefined') soundEngine.playClick();
      }

      // Brick Collision
      let activeBrickCount = 0;
      for (let b = 0; b < this.bricks.length; b++) {
        const brick = this.bricks[b];
        if (!brick.active) continue;
        activeBrickCount++;

        // AABB Collision Check
        if (
          this.ball.x + this.ball.radius >= brick.x &&
          this.ball.x - this.ball.radius <= brick.x + brick.width &&
          this.ball.y + this.ball.radius >= brick.y &&
          this.ball.y - this.ball.radius <= brick.y + brick.height
        ) {
          // Bounce unless in fireball mode
          if (!this.ball.fireball) {
            const prevX = this.ball.x - this.ball.vx;
            const prevY = this.ball.y - this.ball.vy;

            // Check if impact was horizontal or vertical
            if (prevX + this.ball.radius <= brick.x || prevX - this.ball.radius >= brick.x + brick.width) {
              this.ball.vx = -this.ball.vx;
            } else {
              this.ball.vy = -this.ball.vy;
            }
          }

          brick.hits--;
          if (brick.hits <= 0) {
            brick.active = false;
            activeBrickCount--;
            this.score += brick.points;
            if (this.scoreValEl) this.scoreValEl.textContent = String(this.score).padStart(4, '0');

            this.createParticles(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color, 12);
            if (typeof soundEngine !== 'undefined') soundEngine.playPoint();

            // Spawn power-up chip
            if (brick.powerUp) {
              this.powerUps.push({
                x: brick.x + brick.width / 2,
                y: brick.y + brick.height / 2,
                type: brick.powerUp,
                color: brick.color,
                vy: 2.2
              });
            }
          } else {
            // Cracked brick
            this.createParticles(this.ball.x, this.ball.y, brick.color, 5);
            if (typeof soundEngine !== 'undefined') soundEngine.playPoint();
          }

          break; // One collision per frame
        }
      }

      // Check Victory Condition
      if (activeBrickCount === 0) {
        this.gameOver(true);
        return;
      }
    }

    // 4. Lasers vs Bricks
    for (let l = this.lasers.length - 1; l >= 0; l--) {
      const laser = this.lasers[l];
      laser.y += laser.vy;

      if (laser.y < -10) {
        this.lasers.splice(l, 1);
        continue;
      }

      // Hit brick check
      for (let b = 0; b < this.bricks.length; b++) {
        const brick = this.bricks[b];
        if (!brick.active) continue;

        if (
          laser.x >= brick.x &&
          laser.x <= brick.x + brick.width &&
          laser.y >= brick.y &&
          laser.y <= brick.y + brick.height
        ) {
          brick.hits--;
          if (brick.hits <= 0) {
            brick.active = false;
            this.score += brick.points;
            if (this.scoreValEl) this.scoreValEl.textContent = String(this.score).padStart(4, '0');
            this.createParticles(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color, 12);
            if (typeof soundEngine !== 'undefined') soundEngine.playPoint();

            // Check if all bricks are cleared by laser
            if (this.bricks.every(b => !b.active)) {
              this.gameOver(true);
              return;
            }
          }
          this.lasers.splice(l, 1);
          break;
        }
      }
    }

    // 5. Falling Power-Ups vs Paddle
    for (let p = this.powerUps.length - 1; p >= 0; p--) {
      const pup = this.powerUps[p];
      pup.y += pup.vy;

      // Caught by paddle
      const paddleLeft = this.paddle.x - this.paddle.width / 2;
      const paddleRight = this.paddle.x + this.paddle.width / 2;
      const paddleTop = this.paddle.y - this.paddle.height / 2;

      if (
        pup.x >= paddleLeft &&
        pup.x <= paddleRight &&
        pup.y >= paddleTop &&
        pup.y <= paddleTop + this.paddle.height + 10
      ) {
        this.applyPowerUp(pup.type);
        this.powerUps.splice(p, 1);
        continue;
      }

      // Missed bottom
      if (pup.y > this.canvas.height + 20) {
        this.powerUps.splice(p, 1);
      }
    }

    // 6. Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.alpha -= 0.035;
      if (pt.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // 7. Floating Texts
    for (let t = this.floatingTexts.length - 1; t >= 0; t--) {
      const ft = this.floatingTexts[t];
      ft.y -= 0.8;
      ft.alpha -= 0.025;
      if (ft.alpha <= 0) {
        this.floatingTexts.splice(t, 1);
      }
    }
  }

  applyPowerUp(type) {
    if (typeof soundEngine !== 'undefined') soundEngine.playLaser();

    if (type === 'expand') {
      this.paddle.width = 145;
      this.powerUpState.expandTimer = 600; // ~10 seconds
      this.spawnFloatingText(this.paddle.x, this.paddle.y - 25, 'WIDE PADDLE // 10s', '#00f0ff');
    } else if (type === 'laser') {
      this.powerUpState.laserTimer = 550; // ~9 seconds
      this.spawnFloatingText(this.paddle.x, this.paddle.y - 25, 'DUAL LASERS // CLICK TO FIRE', '#ffaa00');
    } else if (type === 'fireball') {
      this.ball.fireball = true;
      this.powerUpState.fireballTimer = 450; // ~7.5 seconds
      this.spawnFloatingText(this.paddle.x, this.paddle.y - 25, 'PLASMA FIREBALL // PIERCING', '#a855f7');
    } else if (type === 'life') {
      this.lives = Math.min(5, this.lives + 1);
      this.spawnFloatingText(this.paddle.x, this.paddle.y - 25, '+1 QUANTUM SHIELD', '#00ff66');
    }
  }

  spawnFloatingText(x, y, text, color) {
    this.floatingTexts.push({ x, y, text, color, alpha: 1 });
  }

  createParticles(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * 4 + 1.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color,
        size: Math.random() * 2.5 + 1.2,
        alpha: 1
      });
    }
  }

  render() {
    // 1. Dark Futuristic Arena Canvas
    this.ctx.fillStyle = '#02050f';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Subtle Circuit Background Grid
    this.ctx.strokeStyle = 'rgba(168, 85, 247, 0.08)';
    this.ctx.lineWidth = 1;
    for (let x = 20; x < this.canvas.width; x += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 20; y < this.canvas.height; y += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }

    // 2. Render Bricks
    for (let b = 0; b < this.bricks.length; b++) {
      const brick = this.bricks[b];
      if (!brick.active) continue;

      this.ctx.save();
      // Outer Glow
      this.ctx.shadowColor = brick.color;
      this.ctx.shadowBlur = brick.hits > 1 ? 10 : 6;

      // Brick Body
      this.ctx.fillStyle = brick.color;
      this.ctx.globalAlpha = brick.hits === 1 ? 0.85 : 1.0;
      this.ctx.beginPath();
      this.ctx.roundRect(brick.x, brick.y, brick.width, brick.height, 4);
      this.ctx.fill();

      // Border Highlight
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 1;
      this.ctx.globalAlpha = 0.6;
      this.ctx.stroke();

      // Armor pattern for multi-hit bricks
      if (brick.hits > 1) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        this.ctx.fillRect(brick.x + 4, brick.y + brick.height / 2 - 1, brick.width - 8, 2);
      }

      this.ctx.restore();
    }

    // 3. Render Falling Power-Ups
    for (let p of this.powerUps) {
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 8;

      // Power-Up Pill Box
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.roundRect(-16, -10, 32, 20, 6);
      this.ctx.fill();

      this.ctx.fillStyle = '#030712';
      this.ctx.font = 'bold 9px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      const label = p.type === 'expand' ? 'WIDE' : (p.type === 'laser' ? 'GUN' : (p.type === 'fireball' ? 'FIRE' : '+1UP'));
      this.ctx.fillText(label, 0, 1);
      this.ctx.restore();
    }

    // 4. Render Lasers
    this.ctx.fillStyle = '#ffaa00';
    this.ctx.shadowColor = '#ffaa00';
    this.ctx.shadowBlur = 8;
    for (let l of this.lasers) {
      this.ctx.fillRect(l.x - 2, l.y, 4, 12);
    }
    this.ctx.shadowBlur = 0;

    // 5. Render Ball Trail & Ball
    for (let i = 0; i < this.ball.trail.length; i++) {
      const tr = this.ball.trail[i];
      const alpha = (i / this.ball.trail.length) * 0.45;
      const color = this.ball.fireball ? '255, 120, 0' : '0, 240, 255';
      this.ctx.fillStyle = `rgba(${color}, ${alpha.toFixed(2)})`;
      this.ctx.beginPath();
      this.ctx.arc(tr.x, tr.y, this.ball.radius * 0.8, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Ball Core
    this.ctx.save();
    this.ctx.shadowColor = this.ball.fireball ? '#ff7700' : '#00f0ff';
    this.ctx.shadowBlur = this.ball.fireball ? 16 : 10;
    this.ctx.fillStyle = this.ball.fireball ? '#ffaa00' : '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();

    // 6. Render Paddle
    this.ctx.save();
    this.ctx.translate(this.paddle.x, this.paddle.y);

    const padColor = this.powerUpState.expandTimer > 0 ? '#00f0ff' : (this.powerUpState.laserTimer > 0 ? '#ffaa00' : '#a855f7');
    this.ctx.shadowColor = padColor;
    this.ctx.shadowBlur = 12;

    // Paddle Body
    this.ctx.fillStyle = padColor;
    this.ctx.beginPath();
    this.ctx.roundRect(-this.paddle.width / 2, -this.paddle.height / 2, this.paddle.width, this.paddle.height, 6);
    this.ctx.fill();

    // Paddle Center Core Indicator
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(-8, -2, 16, 4);

    // Laser Turrets if laser powerup active
    if (this.powerUpState.laserTimer > 0) {
      this.ctx.fillStyle = '#ffaa00';
      this.ctx.fillRect(-this.paddle.width * 0.42, -this.paddle.height / 2 - 5, 6, 6);
      this.ctx.fillRect(this.paddle.width * 0.42 - 6, -this.paddle.height / 2 - 5, 6, 6);
    }
    this.ctx.restore();

    // 7. Render Particles
    for (let p of this.particles) {
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1.0;

    // 8. Render Floating Texts
    for (let ft of this.floatingTexts) {
      this.ctx.font = 'bold 11px monospace';
      this.ctx.fillStyle = ft.color;
      this.ctx.globalAlpha = Math.max(0, ft.alpha);
      this.ctx.textAlign = 'center';
      this.ctx.fillText(ft.text, ft.x, ft.y);
    }
    this.ctx.globalAlpha = 1.0;

    // 9. On-Screen Live Status (Shields & Power-up)
    this.ctx.font = '10px monospace';
    this.ctx.fillStyle = '#00ff88';
    this.ctx.textAlign = 'left';
    let shieldStr = 'SHIELDS: ';
    for (let s = 0; s < this.lives; s++) shieldStr += '❤️ ';
    this.ctx.fillText(shieldStr, 16, 20);

    if (this.ball.stuck && this.isPlaying) {
      this.ctx.fillStyle = '#00f0ff';
      this.ctx.font = 'bold 11px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('[ CLICK OR PRESS SPACE TO LAUNCH SPHERE ]', this.canvas.width / 2, this.canvas.height - 70);
    }
  }
}

/**
 * Real-time Data Analytics Visualizer (Idles when animation finishes)
 */
class DataVisualizer {
  constructor() {
    this.canvas = document.getElementById('dataAnalyticsCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.datasetBtns = document.querySelectorAll('.data-mode-btn[data-dataset]');
    this.regenBtn = document.getElementById('regenerateDataBtn');

    this.sampleSizeEl = document.getElementById('dataSampleSize');
    this.metricEl = document.getElementById('dataOptimalMetric');
    this.driftEl = document.getElementById('dataFeatureDrift');
    this.runtimeEl = document.getElementById('dataRuntime');

    this.currentMode = 'mlfe';
    this.dataPoints = [];
    this.animProgress = 0;
    this.isAnimating = false;

    this.init();
  }

  init() {
    if (!this.canvas || !this.ctx) return;

    this.datasetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.datasetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentMode = btn.getAttribute('data-dataset');
        this.generateData();
        if (typeof soundEngine !== 'undefined') soundEngine.playClick();
      });
    });

    if (this.regenBtn) {
      this.regenBtn.addEventListener('click', () => {
        this.generateData();
        if (typeof soundEngine !== 'undefined') soundEngine.playClick();
      });
    }

    this.generateData();
  }

  generateData() {
    this.animProgress = 0;
    this.dataPoints = [];

    if (this.currentMode === 'mlfe') {
      const features = ['PCA_Comp1', 'Entropy_Index', 'Std_Scalar', 'Log_Vol', 'Kernel_K3', 'Quantile_95', 'Poly_Degree2', 'Residual_Err'];
      for (let f of features) {
        this.dataPoints.push({
          label: f,
          val: Math.random() * 0.65 + 0.32
        });
      }
      if (this.metricEl) this.metricEl.textContent = `R² = ${(Math.random() * 0.05 + 0.94).toFixed(3)}`;
      if (this.sampleSizeEl) this.sampleSizeEl.textContent = '10,240 rows';
      if (this.driftEl) this.driftEl.textContent = '< 0.009 (Nominal)';
      if (this.runtimeEl) this.runtimeEl.textContent = `${(Math.random() * 4 + 12).toFixed(1)} ms`;

    } else if (this.currentMode === 'session') {
      for (let i = 0; i < 24; i++) {
        const hourFactor = Math.sin((i / 24) * Math.PI * 2 - Math.PI / 2) * 0.4 + 0.5;
        this.dataPoints.push({
          hour: `${i}:00`,
          focus: Math.min(1, Math.max(0.1, hourFactor + (Math.random() - 0.5) * 0.25))
        });
      }
      if (this.metricEl) this.metricEl.textContent = `Focus Score: ${(Math.random() * 10 + 88).toFixed(1)}/100`;
      if (this.sampleSizeEl) this.sampleSizeEl.textContent = '84 Sessions';
      if (this.driftEl) this.driftEl.textContent = 'Stable Trend (+4%)';
      if (this.runtimeEl) this.runtimeEl.textContent = '2.1 ms';

    } else if (this.currentMode === 'security') {
      for (let i = 0; i < 30; i++) {
        this.dataPoints.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          isAnomaly: Math.random() > 0.82
        });
      }
      if (this.metricEl) this.metricEl.textContent = 'Precision: 99.1%';
      if (this.sampleSizeEl) this.sampleSizeEl.textContent = '148,900 Packets';
      if (this.driftEl) this.driftEl.textContent = '0 Critical Breaches';
      if (this.runtimeEl) this.runtimeEl.textContent = '0.8 ms';
    }

    if (!this.isAnimating) {
      this.isAnimating = true;
      requestAnimationFrame(() => this.draw());
    }
  }

  draw() {
    this.animProgress = Math.min(1, this.animProgress + 0.06);

    this.ctx.fillStyle = '#02050f';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const pad = 36;
    const w = this.canvas.width - pad * 2;
    const h = this.canvas.height - pad * 2;

    // Grid
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    this.ctx.lineWidth = 1;
    for (let y = 0; y <= 4; y++) {
      const gy = pad + (h / 4) * y;
      this.ctx.beginPath();
      this.ctx.moveTo(pad, gy);
      this.ctx.lineTo(this.canvas.width - pad, gy);
      this.ctx.stroke();
    }

    if (this.currentMode === 'mlfe') {
      const barWidth = (w / this.dataPoints.length) * 0.65;
      const gap = w / this.dataPoints.length;

      this.dataPoints.forEach((d, i) => {
        const bx = pad + i * gap + gap * 0.15;
        const barH = d.val * h * this.animProgress;
        const by = pad + h - barH;

        this.ctx.fillStyle = '#00f0ff';
        this.ctx.fillRect(bx, by, barWidth, barH);

        this.ctx.fillStyle = '#00f0ff';
        this.ctx.font = '9px "JetBrains Mono"';
        this.ctx.fillText((d.val * 100).toFixed(0) + '%', bx, by - 6);

        this.ctx.fillStyle = '#8b9bb4';
        this.ctx.font = '8px "JetBrains Mono"';
        this.ctx.fillText(d.label.slice(0, 6), bx - 2, pad + h + 14);
      });

    } else if (this.currentMode === 'session') {
      this.ctx.strokeStyle = '#00ff66';
      this.ctx.lineWidth = 2.5;
      this.ctx.beginPath();

      const step = w / (this.dataPoints.length - 1);
      this.dataPoints.forEach((d, i) => {
        const px = pad + i * step;
        const py = pad + h - d.focus * h * this.animProgress;
        if (i === 0) this.ctx.moveTo(px, py);
        else this.ctx.lineTo(px, py);
      });
      this.ctx.stroke();

      this.dataPoints.forEach((d, i) => {
        const px = pad + i * step;
        const py = pad + h - d.focus * h * this.animProgress;
        this.ctx.fillStyle = '#00ff66';
        this.ctx.beginPath();
        this.ctx.arc(px, py, 3, 0, Math.PI * 2);
        this.ctx.fill();
      });

    } else if (this.currentMode === 'security') {
      this.dataPoints.forEach(d => {
        const px = pad + (d.x / 100) * w;
        const py = pad + h - (d.y / 100) * h * this.animProgress;

        this.ctx.fillStyle = d.isAnomaly ? '#ff0055' : '#00f0ff';
        this.ctx.beginPath();
        this.ctx.arc(px, py, d.isAnomaly ? 5 : 3, 0, Math.PI * 2);
        this.ctx.fill();
      });
    }

    if (this.animProgress < 1) {
      requestAnimationFrame(() => this.draw());
    } else {
      this.isAnimating = false; // Stopped! No redundant redraws.
    }
  }
}

// Global instances
let miniGame = null;
let dataVisualizer = null;

window.addEventListener('DOMContentLoaded', () => {
  miniGame = new MiniGame();
  dataVisualizer = new DataVisualizer();

  const gameTabBtn = document.getElementById('gameLabTabBtn');
  const dataTabBtn = document.getElementById('dataLabTabBtn');
  const gameContainer = document.getElementById('gameLabContainer');
  const dataContainer = document.getElementById('dataLabContainer');

  if (gameTabBtn && dataTabBtn) {
    gameTabBtn.addEventListener('click', () => {
      gameTabBtn.classList.add('active');
      dataTabBtn.classList.remove('active');
      gameContainer.classList.add('active');
      dataContainer.classList.remove('active');
      if (typeof soundEngine !== 'undefined') soundEngine.playClick();
      // Resume game loop if active
      if (miniGame && miniGame.isPlaying && !miniGame.isLoopRunning) {
        miniGame.isLoopRunning = true;
        requestAnimationFrame(() => miniGame.loop());
      }
    });

    dataTabBtn.addEventListener('click', () => {
      dataTabBtn.classList.add('active');
      gameTabBtn.classList.remove('active');
      dataContainer.classList.add('active');
      gameContainer.classList.remove('active');
      if (typeof soundEngine !== 'undefined') soundEngine.playClick();
      if (dataVisualizer) dataVisualizer.generateData();
      // Pause game loop while viewing analytics
      if (miniGame && miniGame.isPlaying) {
        miniGame.isLoopRunning = false;
      }
    });
  }
});
