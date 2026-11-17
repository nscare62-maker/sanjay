/**
 * 3D Fluid Cyber Silk & Quantum Aurora Wave Matrix
 * - Completely brand new concept: Multi-layered undulating liquid silk light ribbons
 * - Organic harmonic wave physics with interactive cursor displacement
 * - Click shockwave ripples through the silk ribbons
 * - Drifting quantum bokeh embers with soft luminescent breathing
 * - Real-time color synchronization across all themes (Purple, Black, White, Cyan, etc.)
 * - Zero lag, high-efficiency 60 FPS Canvas rendering
 */

class MotionGraphicSpace {
  constructor() {
    this.canvas = document.getElementById('motionGraphicCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.mouse = {
      x: this.width * 0.5,
      y: this.height * 0.5,
      targetX: this.width * 0.5,
      targetY: this.height * 0.5
    };

    this.scrollVelocity = 0;
    this.cameraZ = 0;
    this.time = 0;

    // Theme Config (Defaults to Electric Purple)
    this.currentThemeName = 'purple';
    this.themePrimary = '#a855f7';
    this.themeSecondary = '#00f0ff';
    this.primaryRgb = '168, 85, 247';
    this.secondaryRgb = '0, 240, 255';
    this.bgFill = 'rgba(2, 6, 16, 0.45)';

    // Multi-Layered Silk Waves
    this.ribbons = [];
    this.numRibbons = 5;

    // Drifting Quantum Bokeh Embers
    this.embers = [];
    this.numEmbers = 40;

    // Click Impulse Ripples
    this.ripples = [];

    this.init();
  }

  init() {
    if (!this.canvas || !this.ctx) return;

    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Mouse Tracking
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;
    });

    // Click Ripple Impulse
    window.addEventListener('mousedown', (e) => {
      this.ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 10,
        maxRadius: Math.max(this.width, this.height) * 0.6,
        strength: 28,
        alpha: 0.8
      });
    });

    // Initialize Multi-Layered Silk Ribbons
    for (let r = 0; r < this.numRibbons; r++) {
      const progress = r / (this.numRibbons - 1);
      this.ribbons.push({
        baseYFactor: 0.35 + progress * 0.38, // Spread across middle-to-lower screen
        amp1: 30 + r * 14,
        amp2: 18 + r * 10,
        freq1: 0.0016 + r * 0.0004,
        freq2: 0.003 + r * 0.0006,
        speed1: 0.018 + r * 0.006,
        speed2: 0.012 + r * 0.004,
        phaseOffset: r * 1.25,
        opacity: 0.12 + r * 0.07,
        strokeWidth: 1.2 + r * 0.3,
        useSecondary: r % 2 === 1
      });
    }

    // Initialize Drifting Quantum Bokeh Embers
    for (let i = 0; i < this.numEmbers; i++) {
      this.embers.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -Math.random() * 0.5 - 0.2, // Gentle upward float
        radius: Math.random() * 2.8 + 1.2,
        baseAlpha: Math.random() * 0.4 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.015,
        pulseOffset: Math.random() * Math.PI * 2,
        useSecondary: Math.random() > 0.45
      });
    }

    requestAnimationFrame(() => this.animate());
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    if (this.canvas) {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      this.canvas.width = Math.round(this.width * dpr);
      this.canvas.height = Math.round(this.height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  setTheme(colorName) {
    this.currentThemeName = colorName;

    const themeColors = {
      purple: {
        primary: '#a855f7',
        primaryRgb: '168, 85, 247',
        secondary: '#00f0ff',
        secondaryRgb: '0, 240, 255',
        bg: 'rgba(2, 6, 16, 0.45)'
      },
      black: {
        primary: '#ffffff',
        primaryRgb: '255, 255, 255',
        secondary: '#94a3b8',
        secondaryRgb: '148, 163, 184',
        bg: 'rgba(0, 0, 0, 0.45)'
      },
      white: {
        primary: '#4f46e5',
        primaryRgb: '79, 70, 229',
        secondary: '#0284c7',
        secondaryRgb: '2, 132, 199',
        bg: 'rgba(248, 250, 252, 0.45)'
      },
      cyan: {
        primary: '#00f0ff',
        primaryRgb: '0, 240, 255',
        secondary: '#a855f7',
        secondaryRgb: '168, 85, 247',
        bg: 'rgba(2, 6, 16, 0.45)'
      },
      crimson: {
        primary: '#ff0055',
        primaryRgb: '255, 0, 85',
        secondary: '#ffaa00',
        secondaryRgb: '255, 170, 0',
        bg: 'rgba(10, 2, 6, 0.45)'
      },
      green: {
        primary: '#00ff66',
        primaryRgb: '0, 255, 102',
        secondary: '#00f0ff',
        secondaryRgb: '0, 240, 255',
        bg: 'rgba(2, 10, 6, 0.45)'
      },
      amber: {
        primary: '#ffaa00',
        primaryRgb: '255, 170, 0',
        secondary: '#ff0055',
        secondaryRgb: '255, 0, 85',
        bg: 'rgba(10, 6, 2, 0.45)'
      }
    };

    const cfg = themeColors[colorName] || themeColors.purple;
    this.themePrimary = cfg.primary;
    this.primaryRgb = cfg.primaryRgb;
    this.themeSecondary = cfg.secondary;
    this.secondaryRgb = cfg.secondaryRgb;
    this.bgFill = cfg.bg;
  }

  updateVelocity(vel) {
    this.scrollVelocity = vel;
  }

  animate() {
    this.time += 0.02;

    // Smooth mouse lerp
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

    // Soft Trail Clear
    this.ctx.fillStyle = this.bgFill;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 1. Ambient Background Light Bloom
    this.drawAmbientBloom();

    // 2. Render Layered Fluid Silk Ribbons
    this.drawSilkRibbons();

    // 3. Render Drifting Bokeh Embers
    this.drawBokehEmbers();

    // 4. Update and Draw Click Ripples
    this.updateRipples();

    requestAnimationFrame(() => this.animate());
  }

  // 1. Soft Dynamic Ambient Light Bloom in Background
  drawAmbientBloom() {
    const isLightMode = this.currentThemeName === 'white';
    const isBlackMode = this.currentThemeName === 'black';

    const driftX = Math.sin(this.time * 0.6) * (this.width * 0.12);
    const driftY = Math.cos(this.time * 0.5) * (this.height * 0.1);

    if (isLightMode) {
      const grad = this.ctx.createRadialGradient(
        this.width * 0.5 + driftX, this.height * 0.5 + driftY, 40,
        this.width * 0.5 + driftX, this.height * 0.5 + driftY, this.width * 0.65
      );
      grad.addColorStop(0, 'rgba(226, 232, 240, 0.35)');
      grad.addColorStop(0.7, 'rgba(241, 245, 249, 0.08)');
      grad.addColorStop(1, 'rgba(248, 250, 252, 0)');
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, this.width, this.height);
      return;
    }

    if (isBlackMode) {
      const grad = this.ctx.createRadialGradient(
        this.width * 0.5 + driftX, this.height * 0.5 + driftY, 30,
        this.width * 0.5 + driftX, this.height * 0.5 + driftY, this.width * 0.55
      );
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
      grad.addColorStop(0.6, 'rgba(255, 255, 255, 0.01)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, this.width, this.height);
      return;
    }

    // Dual-tone radial aura
    const grad1 = this.ctx.createRadialGradient(
      this.width * 0.35 + driftX, this.height * 0.45 + driftY, 40,
      this.width * 0.35 + driftX, this.height * 0.45 + driftY, this.width * 0.55
    );
    grad1.addColorStop(0, `rgba(${this.primaryRgb}, 0.14)`);
    grad1.addColorStop(0.6, `rgba(${this.primaryRgb}, 0.02)`);
    grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    this.ctx.fillStyle = grad1;
    this.ctx.fillRect(0, 0, this.width, this.height);

    const grad2 = this.ctx.createRadialGradient(
      this.width * 0.65 - driftX, this.height * 0.6 - driftY, 50,
      this.width * 0.65 - driftX, this.height * 0.6 - driftY, this.width * 0.5
    );
    grad2.addColorStop(0, `rgba(${this.secondaryRgb}, 0.10)`);
    grad2.addColorStop(0.6, `rgba(${this.secondaryRgb}, 0.02)`);
    grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    this.ctx.fillStyle = grad2;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  // 2. Multi-Layered Fluid Silk Ribbons
  drawSilkRibbons() {
    const isLightMode = this.currentThemeName === 'white';
    const isBlackMode = this.currentThemeName === 'black';

    // Step size across screen width
    const stepX = 24;
    const numPoints = Math.ceil(this.width / stepX) + 2;
    const scrollZShift = Math.sin(this.cameraZ * 0.003) * 22;
    const velShift = this.scrollVelocity * 0.5;

    for (let r = 0; r < this.ribbons.length; r++) {
      const ribbon = this.ribbons[r];
      const rgb = ribbon.useSecondary ? this.secondaryRgb : this.primaryRgb;
      const baseY = this.height * ribbon.baseYFactor + scrollZShift + velShift;

      const points = [];

      for (let i = 0; i < numPoints; i++) {
        const px = i * stepX;

        // Wave formula: combination of two dynamic sine frequencies
        const sin1 = Math.sin(this.time * ribbon.speed1 + px * ribbon.freq1 + ribbon.phaseOffset);
        const cos2 = Math.cos(this.time * ribbon.speed2 + px * ribbon.freq2 + ribbon.phaseOffset * 1.5);
        let py = baseY + sin1 * ribbon.amp1 + cos2 * ribbon.amp2;

        // Interactive Cursor Elastic Gravity
        const distToMouse = Math.abs(px - this.mouse.x);
        if (distToMouse < 260) {
          const factor = Math.cos((distToMouse / 260) * (Math.PI * 0.5));
          py += (this.mouse.y - py) * factor * 0.32;
        }

        // Apply Click Ripples
        for (let rip = 0; rip < this.ripples.length; rip++) {
          const ripple = this.ripples[rip];
          const distRip = Math.hypot(px - ripple.x, py - ripple.y);
          const ripDiff = Math.abs(distRip - ripple.radius);
          if (ripDiff < 45) {
            const ripForce = Math.cos((ripDiff / 45) * (Math.PI * 0.5)) * ripple.strength * (ripple.alpha / 0.8);
            py += ripForce * (py > ripple.y ? 1 : -1);
          }
        }

        points.push({ x: px, y: py });
      }

      // Draw Ribbon Fill (Translucent gradient down to bottom)
      const grad = this.ctx.createLinearGradient(0, baseY - ribbon.amp1, 0, this.height);
      const alphaFill = isLightMode ? (ribbon.opacity * 0.45) : ribbon.opacity;
      grad.addColorStop(0, `rgba(${rgb}, ${alphaFill.toFixed(3)})`);
      grad.addColorStop(0.5, `rgba(${rgb}, ${(alphaFill * 0.25).toFixed(3)})`);
      grad.addColorStop(1, `rgba(${rgb}, 0)`);

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.moveTo(points[0].x, points[0].y);

      // Smooth Spline Curve through points
      for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) * 0.5;
        const yc = (points[i].y + points[i + 1].y) * 0.5;
        this.ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      this.ctx.lineTo(this.width + 50, this.height + 20);
      this.ctx.lineTo(-50, this.height + 20);
      this.ctx.closePath();
      this.ctx.fill();

      // Draw Ribbon Crest Stroke Line (Luminous Glowing Edge)
      const alphaStroke = isLightMode ? 0.35 : (isBlackMode ? 0.65 : 0.7);
      this.ctx.strokeStyle = `rgba(${rgb}, ${alphaStroke.toFixed(2)})`;
      this.ctx.lineWidth = ribbon.strokeWidth;
      this.ctx.beginPath();
      this.ctx.moveTo(points[0].x, points[0].y);

      for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) * 0.5;
        const yc = (points[i].y + points[i + 1].y) * 0.5;
        this.ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      this.ctx.stroke();
    }
  }

  // 3. Drifting Quantum Bokeh Embers
  drawBokehEmbers() {
    const isLightMode = this.currentThemeName === 'white';

    for (let i = 0; i < this.embers.length; i++) {
      const ember = this.embers[i];

      // Update position
      ember.x += ember.vx;
      ember.y += ember.vy;

      // Wrap screen edges
      if (ember.x < -20) ember.x = this.width + 20;
      if (ember.x > this.width + 20) ember.x = -20;
      if (ember.y < -20) ember.y = this.height + 20;
      if (ember.y > this.height + 20) ember.y = -20;

      // Pulse alpha
      const pulse = Math.sin(this.time * 2.0 + ember.pulseOffset) * 0.35 + 0.65;
      const currentAlpha = ember.baseAlpha * pulse * (isLightMode ? 0.5 : 1);
      const rgb = ember.useSecondary ? this.secondaryRgb : this.primaryRgb;

      // Draw soft glowing orb
      this.ctx.fillStyle = `rgba(${rgb}, ${currentAlpha.toFixed(3)})`;
      this.ctx.beginPath();
      this.ctx.arc(ember.x, ember.y, ember.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  // 4. Update Click Ripples
  updateRipples() {
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const rip = this.ripples[i];
      rip.radius += 8;
      rip.alpha -= 0.016;

      if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
        this.ripples.splice(i, 1);
      }
    }
  }
}

// Global instance
let motionTunnel = null;
window.addEventListener('DOMContentLoaded', () => {
  motionTunnel = new MotionGraphicSpace();
});
