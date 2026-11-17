/**
 * Advanced Cybernetic Custom Cursor System
 * - Dual-layer physics lerp (dot + ring)
 * - Canvas particle trail ribbon
 * - Click shockwaves & sound feedback
 * - Magnetic attraction to [data-magnetic] targets
 * - Dynamic mode switching (Inspect, Target, Aim, Input)
 */

class CyberCursor {
  constructor() {
    this.cursorEl = document.getElementById('custom-cursor');
    this.dotEl = this.cursorEl ? this.cursorEl.querySelector('.cursor-dot') : null;
    this.ringEl = this.cursorEl ? this.cursorEl.querySelector('.cursor-ring') : null;
    this.labelEl = this.cursorEl ? this.cursorEl.querySelector('.cursor-label') : null;

    this.trailCanvas = document.getElementById('cursor-trail-canvas');
    this.trailCtx = this.trailCanvas ? this.trailCanvas.getContext('2d') : null;

    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.pos = { x: this.mouse.x, y: this.mouse.y };
    this.ringPos = { x: this.mouse.x, y: this.mouse.y };

    this.particles = [];
    this.shockwaves = [];
    this.isHovering = false;
    this.currentMode = 'default';
    this.themeColor = '#a855f7';

    this.init();
  }

  init() {
    if (!this.cursorEl || !this.trailCanvas) return;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Mouse movement
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.spawnTrailParticle(e.clientX, e.clientY);
    });

    // Click events
    window.addEventListener('mousedown', (e) => {
      this.cursorEl.classList.add('clicking');
      this.createShockwave(e.clientX, e.clientY);
      if (typeof soundEngine !== 'undefined') {
        soundEngine.playClick();
      }
    });

    window.addEventListener('mouseup', () => {
      this.cursorEl.classList.remove('clicking');
    });

    // Detect interactive elements
    this.setupInteractivityListeners();

    // Start render loop
    requestAnimationFrame(() => this.render());
  }

  resizeCanvas() {
    if (!this.trailCanvas) return;
    this.trailCanvas.width = window.innerWidth;
    this.trailCanvas.height = window.innerHeight;
  }

  setThemeColor(color) {
    this.themeColor = color;
  }

  setupInteractivityListeners() {
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('a, button, .project-card, .capsule, .gate-node, input, select, textarea, #miniGameCanvas, [data-magnetic]');
      if (!target) {
        this.resetCursorState();
        return;
      }

      if (typeof soundEngine !== 'undefined') {
        soundEngine.playHover();
      }

      if (target.classList.contains('project-card')) {
        this.cursorEl.classList.add('hovering-card');
        this.setLabel('INSPECT');
      } else if (target.id === 'miniGameCanvas') {
        this.cursorEl.classList.add('hovering-interactive');
        this.setLabel('PILOT');
      } else if (target.matches('input, select, textarea')) {
        this.cursorEl.classList.add('hovering-interactive');
        this.setLabel('INPUT');
      } else {
        this.cursorEl.classList.add('hovering-interactive');
        this.setLabel('TARGET');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest('a, button, .project-card, .capsule, .gate-node, input, select, textarea, #miniGameCanvas');
      if (target) {
        this.resetCursorState();
      }
    });
  }

  resetCursorState() {
    this.cursorEl.classList.remove('hovering-interactive', 'hovering-card', 'clicking');
    this.setLabel('');
  }

  setLabel(text) {
    if (this.labelEl) {
      this.labelEl.textContent = text;
    }
  }

  spawnTrailParticle(x, y) {
    if (this.particles.length > 35) return;
    this.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      size: Math.random() * 2.5 + 1,
      alpha: 0.7,
      decay: Math.random() * 0.03 + 0.02
    });
  }

  createShockwave(x, y) {
    this.shockwaves.push({
      x,
      y,
      radius: 5,
      maxRadius: 65,
      alpha: 0.9,
      decay: 0.035
    });
  }

  render() {
    // Smooth lerp for cursor dot & ring
    this.pos.x += (this.mouse.x - this.pos.x) * 0.75;
    this.pos.y += (this.mouse.y - this.pos.y) * 0.75;

    this.ringPos.x += (this.mouse.x - this.ringPos.x) * 0.25;
    this.ringPos.y += (this.mouse.y - this.ringPos.y) * 0.25;

    if (this.cursorEl) {
      this.cursorEl.style.transform = `translate3d(${this.ringPos.x}px, ${this.ringPos.y}px, 0)`;
    }

    // Only draw on trail canvas if there are active particles or shockwaves
    if (this.trailCtx) {
      if (this.particles.length > 0 || this.shockwaves.length > 0) {
        this.trailCtx.clearRect(0, 0, this.trailCanvas.width, this.trailCanvas.height);
        this.hadDrawn = true;

        // Render Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
          const p = this.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            this.particles.splice(i, 1);
            continue;
          }

          this.trailCtx.fillStyle = this.themeColor;
          this.trailCtx.globalAlpha = p.alpha;
          this.trailCtx.beginPath();
          this.trailCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          this.trailCtx.fill();
        }

        // Render Shockwaves on click
        for (let j = this.shockwaves.length - 1; j >= 0; j--) {
          const sw = this.shockwaves[j];
          sw.radius += (sw.maxRadius - sw.radius) * 0.18 + 1.2;
          sw.alpha -= sw.decay;

          if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
            this.shockwaves.splice(j, 1);
            continue;
          }

          this.trailCtx.strokeStyle = this.themeColor;
          this.trailCtx.lineWidth = 1.8;
          this.trailCtx.globalAlpha = sw.alpha;
          this.trailCtx.beginPath();
          this.trailCtx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
          this.trailCtx.stroke();
        }
        this.trailCtx.globalAlpha = 1.0;
      } else if (this.hadDrawn) {
        this.trailCtx.clearRect(0, 0, this.trailCanvas.width, this.trailCanvas.height);
        this.hadDrawn = false;
      }
    }

    requestAnimationFrame(() => this.render());
  }
}

// Global cursor instance
let cyberCursor = null;
window.addEventListener('DOMContentLoaded', () => {
  cyberCursor = new CyberCursor();
});

