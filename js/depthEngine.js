/**
 * High-Precision 3D Z-Axis Depth Engine
 * - Mathematically correct CSS 3D perspective mapping:
 *   Negative Z (-Z) = Deep into the screen (approaching)
 *   Zero Z (0) = Viewport focal plane (sharp, active)
 *   Positive Z (+Z) = Passing behind the camera eye (smooth fade-out)
 * - Zero Double-Scaling: Lets native CSS perspective handle 3D scaling naturally
 * - Instant Layer Culling: Invisible gates are completely hidden from GPU compositor
 * - Idle Loop Sleeping: Zero CPU/GPU usage when stationary
 */

class DepthEngine {
  constructor() {
    this.worldEl = document.getElementById('tunnelWorld');
    this.gates = [];
    this.currentZ = 0;
    this.targetZ = 0;
    this.maxZ = 7500;
    this.velocity = 0;
    this.isLoopRunning = false;

    // Active gate tracking
    this.currentGateIndex = 0;
    this.lastRenderedZInt = -1;
    this.lastRenderedGateIndex = -1;

    // HUD Elements
    this.hudDepthVal = document.getElementById('hudDepthValue');
    this.hudGateName = document.getElementById('hudGateName');
    this.hudCoords = document.getElementById('hudCoords');
    this.gateNodes = document.querySelectorAll('.gate-node');
    this.gateProgress = document.getElementById('gateNavProgress');

    // 6 Gates Spaced along Z (Every 1500 units)
    this.gateConfigs = [
      { id: 'gate-0', z: 0, name: 'GATE 0 // ENTRANCE VECTOR' },
      { id: 'gate-1', z: 1500, name: 'GATE 1 // PROFILE DOSSIER' },
      { id: 'gate-2', z: 3000, name: 'GATE 2 // FLAGSHIP PROJECTS' },
      { id: 'gate-3', z: 4500, name: 'GATE 3 // TECHNICAL ARSENAL' },
      { id: 'gate-4', z: 6000, name: 'GATE 4 // INTERACTIVE LAB' },
      { id: 'gate-5', z: 7500, name: 'GATE 5 // QUANTUM UPLINK' }
    ];

    this.touchStartY = 0;
    this.init();
  }

  init() {
    // Cache gate DOM elements
    this.gateConfigs.forEach(cfg => {
      const el = document.getElementById(cfg.id);
      if (el) {
        this.gates.push({
          el,
          z: cfg.z,
          name: cfg.name
        });
      }
    });

    // 1. Controlled Wheel Event: Steps exactly 1 Gate per gesture and locks to that page!
    let isWheelThrottled = false;
    let wheelDeltaSum = 0;
    let wheelTimer = null;

    window.addEventListener('wheel', (e) => {
      // Let internal scrollable containers scroll smoothly without triggering page change
      const scrollable = e.target.closest('.projects-matrix-grid, .modal-body-content, .gate-frame, .terminal-content, .modal-code-container');
      if (scrollable && scrollable.scrollHeight > scrollable.clientHeight) {
        const canScrollDown = scrollable.scrollTop < (scrollable.scrollHeight - scrollable.clientHeight - 8);
        const canScrollUp = scrollable.scrollTop > 8;
        if ((e.deltaY > 0 && canScrollDown) || (e.deltaY < 0 && canScrollUp)) {
          return; // Let user scroll inside the card
        }
      }

      e.preventDefault();

      if (isWheelThrottled) return;

      wheelDeltaSum += e.deltaY;
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        wheelDeltaSum = 0;
      }, 100);

      // Require an intentional scroll threshold
      if (Math.abs(wheelDeltaSum) >= 22) {
        const direction = wheelDeltaSum > 0 ? 1 : -1;
        wheelDeltaSum = 0;
        isWheelThrottled = true;

        this.stepGate(direction);

        // Lock for 620ms so a single continuous wheel flick does not overshoot into further pages!
        setTimeout(() => {
          isWheelThrottled = false;
        }, 620);
      }
    }, { passive: false });

    // 2. Touch Swipe Events for Mobile / Tablet (1 swipe = 1 gate step)
    let isTouchThrottled = false;
    window.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        this.touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const scrollableTarget = e.target.closest('.projects-matrix-grid, .modal-body-content, .gate-frame, .terminal-content, .modal-code-container');
        if (scrollableTarget && scrollableTarget.scrollHeight > scrollableTarget.clientHeight) {
          return;
        }

        e.preventDefault();
        if (isTouchThrottled) return;

        const touchY = e.touches[0].clientY;
        const diffY = this.touchStartY - touchY;

        if (Math.abs(diffY) > 30) {
          isTouchThrottled = true;
          this.stepGate(diffY > 0 ? 1 : -1);
          setTimeout(() => {
            isTouchThrottled = false;
          }, 600);
        }
      }
    }, { passive: false });

    // 3. Keyboard Arrow & Navigation Controls for Z-Dive
    window.addEventListener('keydown', (e) => {
      if (e.target.matches('input, textarea, select')) return;

      // Do not navigate gates if project modal is open
      const modalBackdrop = document.getElementById('projectModalBackdrop');
      if (modalBackdrop && modalBackdrop.classList.contains('open')) return;

      // When user is on Gate 4 with the mini-game active, reserve Space, Arrows, WASD for gameplay!
      const isGate4 = this.currentGateIndex === 4;
      const gameContainer = document.getElementById('gameLabContainer');
      const isGameActive = isGate4 && gameContainer && gameContainer.classList.contains('active');

      if (isGameActive) {
        // Allow PageUp / PageDown or Home / End to exit Gate 4, but let game controls pass cleanly
        if (e.key === 'PageDown') {
          e.preventDefault();
          this.stepGate(1);
        } else if (e.key === 'PageUp') {
          e.preventDefault();
          this.stepGate(-1);
        } else if (e.key === 'Home') {
          e.preventDefault();
          this.jumpToGate(0);
        } else if (e.key === 'End') {
          e.preventDefault();
          this.jumpToGate(this.gateConfigs.length - 1);
        }
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        this.stepGate(1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        this.stepGate(-1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        this.jumpToGate(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        this.jumpToGate(this.gateConfigs.length - 1);
      }
    });

    // 4. Clickable Waypoints Navigation (if present)
    if (this.gateNodes && this.gateNodes.length > 0) {
      this.gateNodes.forEach(node => {
        node.addEventListener('click', () => {
          const gateIdx = parseInt(node.getAttribute('data-gate'), 10);
          this.jumpToGate(gateIdx);
        });
      });
    }

    // Start initial frame
    this.wakeLoop();
  }

  stepGate(direction) {
    // direction: +1 (next gate) or -1 (previous gate)
    const targetIdx = Math.max(0, Math.min(this.gateConfigs.length - 1, this.currentGateIndex + direction));
    this.jumpToGate(targetIdx);
  }

  clampTargetZ() {
    this.targetZ = Math.max(0, Math.min(this.maxZ, this.targetZ));
  }

  wakeLoop() {
    if (!this.isLoopRunning) {
      this.isLoopRunning = true;
      requestAnimationFrame(() => this.update());
    }
  }

  jumpToGate(index) {
    if (index >= 0 && index < this.gateConfigs.length) {
      this.targetZ = this.gateConfigs[index].z;
      this.wakeLoop();
      if (typeof soundEngine !== 'undefined') {
        soundEngine.playClick();
        soundEngine.playWarp();
      }
    }
  }

  diveNext() {
    const nextIdx = Math.min(this.gateConfigs.length - 1, this.currentGateIndex + 1);
    this.jumpToGate(nextIdx);
  }

  update() {
    // High-precision smooth spring lerp
    const prevZ = this.currentZ;
    this.currentZ += (this.targetZ - this.currentZ) * 0.14;
    this.velocity = this.currentZ - prevZ;

    const isMoving = Math.abs(this.velocity) > 0.05 || Math.abs(this.targetZ - this.currentZ) > 0.25;

    if (!isMoving) {
      this.currentZ = this.targetZ;
      this.velocity = 0;
    }

    // Feed velocity & depth to motion graphic background
    if (typeof motionTunnel !== 'undefined' && motionTunnel) {
      motionTunnel.updateVelocity(this.velocity);
      motionTunnel.cameraZ = this.currentZ;
    }

    let closestDist = Infinity;
    let closestIndex = 0;

    // 3D Spatial Calculation:
    // Distance from current camera to gate
    for (let idx = 0; idx < this.gates.length; idx++) {
      const gate = this.gates[idx];
      // dist > 0 means the gate is AHEAD in space (we haven't reached it yet)
      // dist < 0 means we have passed the gate (it is behind us)
      const dist = gate.z - this.currentZ;
      const absDist = Math.abs(dist);

      if (absDist < closestDist) {
        closestDist = absDist;
        closestIndex = idx;
      }

      // Layer Culling:
      // If gate is too far ahead (dist > 1800) or too far behind (dist < -500), hide completely!
      if (dist > 1800 || dist < -500) {
        if (gate.el.style.visibility !== 'hidden') {
          gate.el.style.visibility = 'hidden';
          gate.el.style.opacity = '0';
          gate.el.style.pointerEvents = 'none';
          gate.el.classList.remove('active-gate');
        }
        continue;
      }

      let zCSS = 0;
      let opacity = 0;
      let pointerEvents = 'none';

      if (dist >= 0) {
        // Gate is AHEAD of the viewer:
        // In CSS 3D perspective, objects deep in the screen sit at NEGATIVE Z!
        zCSS = -dist * 0.85;

        // Opacity smoothly increases as it approaches the screen plane (dist -> 0)
        const approachRatio = Math.max(0, 1 - dist / 1400);
        opacity = Math.pow(approachRatio, 1.3);

        if (dist < 180) {
          pointerEvents = 'auto';
        }
      } else {
        // Gate is BEHIND the viewer:
        // Moves toward positive Z (past viewer) and quickly dissolves
        const pastDist = -dist; // positive number
        zCSS = Math.min(350, pastDist * 0.7);

        // Fades out rapidly as it flies past
        opacity = Math.max(0, 1 - pastDist / 260);

        if (pastDist < 100) {
          pointerEvents = 'auto';
        }
      }

      // Apply transform & opacity
      if (opacity > 0.02) {
        gate.el.style.visibility = 'visible';
        gate.el.style.transform = `translate3d(0, 0, ${zCSS.toFixed(1)}px)`;
        gate.el.style.opacity = opacity.toFixed(2);
        gate.el.style.pointerEvents = pointerEvents;

        if (pointerEvents === 'auto' && opacity > 0.75) {
          gate.el.classList.add('active-gate');
        } else {
          gate.el.classList.remove('active-gate');
        }
      } else {
        gate.el.style.visibility = 'hidden';
        gate.el.style.opacity = '0';
        gate.el.style.pointerEvents = 'none';
        gate.el.classList.remove('active-gate');
      }
    }

    this.currentGateIndex = closestIndex;
    this.updateHUD();

    if (isMoving) {
      requestAnimationFrame(() => this.update());
    } else {
      this.isLoopRunning = false;
    }
  }

  updateHUD() {
    const zInt = Math.round(this.currentZ);

    if (zInt !== this.lastRenderedZInt) {
      this.lastRenderedZInt = zInt;
      if (this.hudDepthVal) {
        this.hudDepthVal.innerHTML = `${String(zInt).padStart(4, '0')} <span class="unit">Z-MTR</span>`;
      }
      if (this.hudCoords) {
        this.hudCoords.textContent = `Z-POS: ${zInt} // VEL: ${this.velocity.toFixed(1)}`;
      }
      if (this.gateProgress) {
        const pct = (this.currentZ / this.maxZ) * 100;
        this.gateProgress.style.height = `${Math.min(100, Math.max(0, pct)).toFixed(1)}%`;
      }
    }

    if (this.currentGateIndex !== this.lastRenderedGateIndex) {
      this.lastRenderedGateIndex = this.currentGateIndex;

      if (this.hudGateName && this.gateConfigs[this.currentGateIndex]) {
        this.hudGateName.textContent = this.gateConfigs[this.currentGateIndex].name;
      }

      this.gateNodes.forEach((node, idx) => {
        if (idx === this.currentGateIndex) {
          node.classList.add('active');
        } else {
          node.classList.remove('active');
        }
      });
    }
  }
}

// Global depth engine instance
let depthEngine = null;
window.addEventListener('DOMContentLoaded', () => {
  depthEngine = new DepthEngine();
});
