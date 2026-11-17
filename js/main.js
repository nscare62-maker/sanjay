/**
 * Main Application Controller
 * - Project Inspection Modals (Click Events)
 * - Category Filtering
 * - Theme Switcher (Cyan, Crimson, Green, Amber, Purple)
 * - 3D Tilt Card Parallax
 * - Contact Dispatcher & Toast Notifications
 * - Audio & Navigation Shortcuts
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 0. QUANTUM PRELOADER & SYSTEM INITIALIZATION
  // ============================================================
  const preloader = document.getElementById('cyberPreloader');
  const preProgress = document.getElementById('preloaderProgress');
  const preStatusText = document.getElementById('preloaderStatusText');

  if (preloader) {
    let progress = 0;
    const phases = [
      { max: 20, text: 'BOOTING NEURAL QUANTUM CORE // SANJAY S.' },
      { max: 40, text: 'SYNCHRONIZING 3D SPATIAL HYPERSPACE GATES...' },
      { max: 62, text: 'CALIBRATING COSMIC NEBULA & WARP PORTALS...' },
      { max: 82, text: 'MOUNTING 6 FLAGSHIP SYSTEM ARCHITECTURES...' },
      { max: 98, text: 'ESTABLISHING BIOMETRIC UPLINK & HUD INTERFACE...' },
      { max: 100, text: 'SYSTEM CORE ONLINE // SANJAY S. [100%]' }
    ];

    // Smooth, cinematic boot sequence (~2.4 seconds total)
    const bootInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 2) + 1; // Steady 1% to 2% step every 38ms
      if (progress >= 100) {
        progress = 100;
        clearInterval(bootInterval);
        if (preProgress) preProgress.style.width = '100%';
        if (preStatusText) preStatusText.textContent = 'SYSTEM CORE ONLINE // SANJAY S. [100%]';

        setTimeout(() => {
          preloader.classList.add('loaded');
          if (typeof soundEngine !== 'undefined') soundEngine.playPoint();

          // Ensure Gate 0 triggers entry convergence animation
          const gate0 = document.getElementById('gate-0');
          if (gate0) {
            gate0.classList.add('active-gate');
          }

          setTimeout(() => {
            preloader.style.display = 'none';

            // Greet user with login session count and rotated color theme
            const loginCount = window.__LOGIN_COUNT__ || 1;
            const curTheme = window.__INITIAL_THEME__ || 'white';
            const themeNames = {
              white: 'Titanium Pure White',
              cyan: 'Neon Cyber Cyan',
              black: 'Stealth OLED Black',
              purple: 'Electric Synth Purple',
              green: 'Matrix Emerald',
              crimson: 'Neon Cyber Crimson',
              amber: 'Quantum Solar Amber'
            };
            showToast(`Login #${loginCount} Initialized // Theme: ${themeNames[curTheme] || curTheme.toUpperCase()}`);
          }, 650);
        }, 300);
      } else {
        if (preProgress) preProgress.style.width = `${progress}%`;
        const currentPhase = phases.find(p => progress <= p.max) || phases[0];
        if (preStatusText) {
          preStatusText.textContent = `${currentPhase.text} [${progress}%]`;
        }
      }
    }, 38);
  }

  // ============================================================
  // 1. PROJECT INSPECTION MODAL (CLICK EVENTS & CODE VIEW)
  // ============================================================
  const modalBackdrop = document.getElementById('projectModalBackdrop');
  const modalWindow = document.getElementById('projectModalWindow');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBodyContent = document.getElementById('modalBodyContent');
  const modalProjId = document.getElementById('modalProjId');

  const projectSnippets = {
    'svarsh-tech': `// Svarsh Tech - React Hook: Service Inquiry Pipeline
export const useServicePipeline = (serviceId) => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateEstimate = async (specs) => {
    setLoading(true);
    const res = await api.post('/services/estimate', { serviceId, specs });
    setQuote(res.data);
    setLoading(false);
  };
  return { quote, loading, calculateEstimate };
};`,
    'svarsh-ecom-lms': `// Svarsh LMS - Express Controller: Course Stream Session
exports.getLessonStream = async (req, res) => {
  const { courseId, lessonId } = req.params;
  const userProgress = await Enrollment.findOne({ studentId: req.user.id, courseId });
  if (!userProgress) return res.status(403).json({ error: 'Access Denied' });

  const streamToken = jwt.sign({ lessonId, exp: '2h' }, process.env.STREAM_SECRET);
  res.json({ cdnUrl: \`https://cdn.svarsh.lms/stream/\${lessonId}\`, streamToken });
};`,
    'cyberguard': `# CyberGuard - WebSocket Threat Anomaly Engine
class NetworkThreatDetector:
    def __init__(self, baseline_threshold=0.85):
        self.threshold = baseline_threshold

    def inspect_packet(self, packet_stream):
        entropy = calculate_shannon_entropy(packet_stream)
        if entropy > self.threshold:
            alert = {"level": "CRITICAL", "type": "MALWARE_BURST", "entropy": entropy}
            websocket_broadcast(json.dumps(alert))
            trigger_firewall_mitigation(packet_stream.source_ip)`,
    'worksession': `// WorkSessionTracker - Web Worker High-Precision Drift-Free Interval
let timerId = null;
let elapsed = 0;

self.onmessage = (e) => {
  if (e.data.cmd === 'START') {
    const start = performance.now();
    timerId = setInterval(() => {
      elapsed = Math.floor((performance.now() - start) / 1000);
      self.postMessage({ elapsed, efficiency: calcFocusScore(elapsed) });
    }, 1000);
  }
};`,
    'retail-web': `// Retail Engine - Redux Toolkit Cart & Dynamic Inventory Check
export const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], total: 0 },
  reducers: {
    addItem: (state, action) => {
      const existing = state.items.find(i => i.sku === action.payload.sku);
      if (existing) {
        if (existing.qty < action.payload.stock) existing.qty += 1;
      } else {
        state.items.push({ ...action.payload, qty: 1 });
      }
      state.total = state.items.reduce((acc, i) => acc + (i.price * i.qty), 0);
    }
  }
});`,
    'automlfe': `# AutoMLFE - Feature Engineering & Model Benchmarking Pipeline
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier

def execute_automl_pipeline(df, target_col):
    X = synthesize_interaction_features(df.drop(columns=[target_col]))
    y = df[target_col]
    pipeline = Pipeline([
        ('scaler', RobustScaler()),
        ('rf_bench', RandomForestClassifier(n_estimators=100, random_state=42))
    ])
    pipeline.fit(X, y)
    return {"accuracy": pipeline.score(X, y), "feature_importances": pipeline.named_steps['rf_bench'].feature_importances_}`
  };

  function openProjectModal(projectId) {
    if (typeof PORTFOLIO_DATA === 'undefined') return;
    const project = PORTFOLIO_DATA.projects.find(p => p.id === projectId);
    if (!project) return;

    if (modalProjId) {
      modalProjId.textContent = `#${project.index} // ${project.id.toUpperCase()}`;
    }

    const snippet = projectSnippets[project.id] || '// Source architecture operational and verified.';

    if (modalBodyContent) {
      modalBodyContent.innerHTML = `
        <h2 class="modal-hero-title">${project.name}</h2>
        <div class="modal-subtitle"><i class="fa-solid fa-code-branch"></i> ${project.tagline}</div>

        <div class="modal-spec-grid">
          <div class="spec-box">
            <div class="spec-box-title"><i class="fa-solid fa-microchip"></i> SYSTEM SUMMARY & VALUE</div>
            <p style="font-size: 13px; line-height: 1.6; color: var(--text-muted); margin-bottom: 14px;">
              ${project.summary}
            </p>
            <div class="spec-box-title"><i class="fa-solid fa-network-wired"></i> ARCHITECTURE DESIGN</div>
            <p style="font-size: 12.5px; line-height: 1.6; color: var(--text-main);">
              ${project.architecture}
            </p>
          </div>

          <div class="spec-box">
            <div class="spec-box-title"><i class="fa-solid fa-list-check"></i> KEY SPECIFICATIONS</div>
            <ul class="spec-list">
              ${project.features.map(f => `<li><i class="fa-solid fa-angles-right"></i> <span>${f}</span></li>`).join('')}
            </ul>

            <div class="spec-box-title" style="margin-top: 16px;"><i class="fa-solid fa-layer-group"></i> TECH STACK</div>
            <div class="modal-tech-stack-row">
              ${project.techStack.map(t => `<span class="modal-tech-badge">${t}</span>`).join('')}
            </div>
          </div>
        </div>

        <!-- Code Snippet Viewer Toggle -->
        <div class="modal-code-toggle-bar">
          <button class="code-tab-btn" id="modalCodeToggleBtn" data-magnetic>
            <i class="fa-solid fa-code"></i> VIEW CORE CODE ARCHITECTURE
          </button>
        </div>

        <div class="modal-code-container" id="modalCodeContainer">
          <pre><code>${snippet}</code></pre>
        </div>

        <!-- Action Buttons: Live Demo, GitHub Repo, and Simulation -->
        <div style="display: flex; gap: 12px; margin-top: 18px; flex-wrap: wrap; justify-content: flex-end;">
          <a href="${project.liveDemoUrl || '#'}" target="_blank" class="cyber-btn primary-btn" id="modalActionLiveBtn" data-magnetic>
            <i class="fa-solid fa-arrow-up-right-from-square"></i> <span>LAUNCH LIVE DEMO</span>
          </a>
          <a href="${project.githubUrl || 'https://github.com'}" target="_blank" class="cyber-btn secondary-btn" id="modalActionGithubBtn" data-magnetic>
            <i class="fa-brands fa-github"></i> <span>VIEW GITHUB REPO</span>
          </a>
        </div>
      `;
    }

    modalBackdrop.classList.add('open');

    // Attach click sound
    if (typeof soundEngine !== 'undefined') {
      soundEngine.playModalOpen();
    }

    // Toggle Code Architecture Viewer
    const codeToggleBtn = document.getElementById('modalCodeToggleBtn');
    const codeContainer = document.getElementById('modalCodeContainer');
    if (codeToggleBtn && codeContainer) {
      codeToggleBtn.addEventListener('click', () => {
        codeContainer.classList.toggle('open');
        codeToggleBtn.classList.toggle('active');
        if (typeof soundEngine !== 'undefined') soundEngine.playClick();
      });
    }

    // Live demo simulation click
    const actionBtn = document.getElementById('modalActionLiveBtn');
    if (actionBtn) {
      actionBtn.addEventListener('click', (e) => {
        if (actionBtn.getAttribute('href') === '#') {
          e.preventDefault();
          showToast(`Initiating live environment for ${project.name}...`);
        }
        if (typeof soundEngine !== 'undefined') soundEngine.playClick();
      });
    }
  }

  function closeProjectModal() {
    modalBackdrop.classList.remove('open');
    if (typeof soundEngine !== 'undefined') soundEngine.playClick();
  }

  // Open modal on click inspect buttons (bypass if direct <a> link was clicked)
  document.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;

    const inspectBtn = e.target.closest('.project-inspect-btn, .project-card');
    if (inspectBtn && !modalBackdrop.classList.contains('open')) {
      const projId = inspectBtn.getAttribute('data-project') || inspectBtn.getAttribute('data-project-id');
      if (projId) {
        openProjectModal(projId);
      }
    }
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeProjectModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeProjectModal();
    }
  });

  // ============================================================
  // 2. PROJECT DECK SWITCHER & CATEGORY FILTERING (GATE 2)
  // ============================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const deckBtns = document.querySelectorAll('.deck-btn');
  const prevDeckBtn = document.getElementById('prevDeckBtn');
  const nextDeckBtn = document.getElementById('nextDeckBtn');
  const deckQuickFlipBtn = document.getElementById('deckQuickFlipBtn');
  const deckIndicatorText = document.getElementById('deckIndicatorText');
  const deckQuickFlipText = document.getElementById('deckQuickFlipText');
  const deckQuickFlipIcon = document.getElementById('deckQuickFlipIcon');

  let activeDeck = '1';
  let activeCategory = 'all';

  function renderProjectsDisplay() {
    projectCards.forEach(card => {
      const cardDeck = card.getAttribute('data-deck');
      const cardCat = card.getAttribute('data-category');

      const matchesDeck = (activeDeck === 'all' || cardDeck === activeDeck);
      const matchesCategory = (activeCategory === 'all' || cardCat === activeCategory);

      if (matchesDeck && matchesCategory) {
        card.style.display = 'flex';
        card.style.animation = 'cardFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      } else {
        card.style.display = 'none';
      }
    });

    // Update Deck Switcher Button States
    deckBtns.forEach(btn => {
      if (btn.getAttribute('data-deck') === activeDeck) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update Bottom Indicator Bar & Quick Flip Action
    if (deckIndicatorText) {
      if (activeDeck === '1') {
        deckIndicatorText.innerHTML = '<i class="fa-solid fa-layer-group"></i> VIEWING DECK 01 // PROJECTS #01 - #03';
        if (deckQuickFlipText) deckQuickFlipText.textContent = 'SWITCH TO PROJECTS #04 - #06';
        if (deckQuickFlipIcon) deckQuickFlipIcon.className = 'fa-solid fa-arrow-right';
      } else if (activeDeck === '2') {
        deckIndicatorText.innerHTML = '<i class="fa-solid fa-layer-group"></i> VIEWING DECK 02 // PROJECTS #04 - #06';
        if (deckQuickFlipText) deckQuickFlipText.textContent = 'SWITCH TO PROJECTS #01 - #03';
        if (deckQuickFlipIcon) deckQuickFlipIcon.className = 'fa-solid fa-arrow-left';
      } else {
        deckIndicatorText.innerHTML = '<i class="fa-solid fa-layer-group"></i> VIEWING ALL 06 PROJECTS // FULL MATRIX';
        if (deckQuickFlipText) deckQuickFlipText.textContent = 'VIEW DECK 01';
        if (deckQuickFlipIcon) deckQuickFlipIcon.className = 'fa-solid fa-table-cells-large';
      }
    }
  }

  // Deck Buttons (Deck 01, Deck 02, All)
  deckBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeDeck = btn.getAttribute('data-deck');
      renderProjectsDisplay();
      if (typeof soundEngine !== 'undefined') soundEngine.playClick();
    });
  });

  // Previous / Next Deck Arrows
  if (prevDeckBtn) {
    prevDeckBtn.addEventListener('click', () => {
      activeDeck = activeDeck === '2' ? '1' : (activeDeck === '1' ? '2' : '1');
      renderProjectsDisplay();
      if (typeof soundEngine !== 'undefined') soundEngine.playClick();
    });
  }

  if (nextDeckBtn) {
    nextDeckBtn.addEventListener('click', () => {
      activeDeck = activeDeck === '1' ? '2' : (activeDeck === '2' ? '1' : '2');
      renderProjectsDisplay();
      if (typeof soundEngine !== 'undefined') soundEngine.playClick();
    });
  }

  // Bottom Deck Quick Flip Button
  if (deckQuickFlipBtn) {
    deckQuickFlipBtn.addEventListener('click', () => {
      activeDeck = activeDeck === '1' ? '2' : '1';
      renderProjectsDisplay();
      if (typeof soundEngine !== 'undefined') soundEngine.playClick();
      if (typeof showToast === 'function') {
        showToast(activeDeck === '2' ? 'Displaying Projects #04 - #06 (WorkSessionTracker, Retail, AutoMLFE)' : 'Displaying Projects #01 - #03 (Svarsh Tech, LMS, CyberGuard)');
      }
    });
  }

  // Category Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeCategory = btn.getAttribute('data-filter');
      // If user filters by specific category, open all decks to ensure matches are visible
      if (activeCategory !== 'all') {
        activeDeck = 'all';
      }
      renderProjectsDisplay();
      if (typeof soundEngine !== 'undefined') soundEngine.playClick();
    });
  });

  // Initial render with Deck 1 active
  renderProjectsDisplay();

  // ============================================================
  // 3. NAVIGATION CLICK SHORTCUTS (Z-AXIS DIVE)
  // ============================================================
  const diveStartBtn = document.getElementById('diveStartBtn');
  const quickProjectsBtn = document.getElementById('quickProjectsBtn');
  const launchLabBtn = document.getElementById('launchLabBtn');
  const surfaceJumpBtn = document.getElementById('surfaceJumpBtn');
  const warpToOriginBtn = document.getElementById('warpToOriginBtn');
  const diveNextBtn = document.getElementById('diveNextBtn');

  if (diveStartBtn) {
    diveStartBtn.addEventListener('click', () => {
      if (depthEngine) depthEngine.jumpToGate(1);
    });
  }

  if (quickProjectsBtn) {
    quickProjectsBtn.addEventListener('click', () => {
      if (depthEngine) depthEngine.jumpToGate(2);
    });
  }

  if (launchLabBtn) {
    launchLabBtn.addEventListener('click', () => {
      if (depthEngine) depthEngine.jumpToGate(4);
    });
  }

  if (surfaceJumpBtn) {
    surfaceJumpBtn.addEventListener('click', () => {
      if (depthEngine) depthEngine.jumpToGate(0);
    });
  }

  if (warpToOriginBtn) {
    warpToOriginBtn.addEventListener('click', () => {
      if (depthEngine) depthEngine.jumpToGate(0);
    });
  }

  if (diveNextBtn) {
    diveNextBtn.addEventListener('click', () => {
      if (depthEngine) depthEngine.diveNext();
    });
  }

  // Resume Download Button Triggers
  const hudResumeBtn = document.getElementById('hudResumeBtn');
  const heroResumeBtn = document.getElementById('heroResumeBtn');

  function handleResumeDownload(e) {
    if (typeof soundEngine !== 'undefined') soundEngine.playPoint();
    showToast('Initiating download: Sanjay_S_Resume.pdf (B.Tech AIDS)');
  }

  if (hudResumeBtn) hudResumeBtn.addEventListener('click', handleResumeDownload);
  if (heroResumeBtn) heroResumeBtn.addEventListener('click', handleResumeDownload);

  // ============================================================
  // 4. AUDIO TOGGLE
  // ============================================================
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioIcon = document.getElementById('audioIcon');
  const audioText = document.getElementById('audioText');

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      if (typeof soundEngine !== 'undefined') {
        const isEnabled = soundEngine.toggle();
        if (isEnabled) {
          audioIcon.className = 'fa-solid fa-volume-high';
          audioText.textContent = 'AUDIO: ON';
          showToast('Audio Synthesizer: ONLINE');
          soundEngine.playClick();
        } else {
          audioIcon.className = 'fa-solid fa-volume-xmark';
          audioText.textContent = 'AUDIO: OFF';
          showToast('Audio Synthesizer: MUTED');
        }
      }
    });
  }

  // ============================================================
  // 5. THEME SWITCHER & DYNAMIC MULTI-COLOR ROTATION
  // ============================================================
  const themePickerBtn = document.getElementById('themePickerBtn');
  const themeDropdown = document.getElementById('themeDropdown');
  const themeOptions = document.querySelectorAll('.theme-opt');

  const colorHexMap = {
    purple: '#a855f7',
    black: '#ffffff',
    white: '#0f172a',
    cyan: '#00f0ff',
    crimson: '#ff0055',
    green: '#00ff66',
    amber: '#ffaa00'
  };

  function applyTheme(color, showNotification = false) {
    document.body.className = `theme-${color}`;
    document.documentElement.className = `theme-${color}`;

    themeOptions.forEach(opt => {
      if (opt.getAttribute('data-color') === color) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });

    const hex = colorHexMap[color] || '#a855f7';
    if (typeof cyberCursor !== 'undefined' && cyberCursor) {
      cyberCursor.setThemeColor(hex);
    }
    if (typeof motionTunnel !== 'undefined' && motionTunnel) {
      motionTunnel.setTheme(color);
    }

    if (showNotification && typeof showToast === 'function') {
      showToast(`Interface Theme calibrated: ${color.toUpperCase()}`);
    }
  }

  // Initialize theme from login count rotation sequence
  const initialTheme = window.__INITIAL_THEME__ || 'white';
  applyTheme(initialTheme, false);

  if (themePickerBtn && themeDropdown) {
    themePickerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themeDropdown.classList.toggle('open');
      if (typeof soundEngine !== 'undefined') soundEngine.playClick();
    });

    document.addEventListener('click', (e) => {
      if (!themeDropdown.contains(e.target) && e.target !== themePickerBtn) {
        themeDropdown.classList.remove('open');
      }
    });
  }

  themeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const color = opt.getAttribute('data-color');
      applyTheme(color, true);
      if (themeDropdown) themeDropdown.classList.remove('open');
      if (typeof soundEngine !== 'undefined') soundEngine.playClick();
    });
  });

  // ============================================================
  // 6. COPY EMAIL & PHONE CLIPBOARD
  // ============================================================
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const emailTarget = document.getElementById('emailCopyTarget');
  const copyPhoneBtn = document.getElementById('copyPhoneBtn');
  const phoneTarget = document.getElementById('phoneCopyTarget');

  if (copyEmailBtn && emailTarget) {
    copyEmailBtn.addEventListener('click', () => {
      const email = emailTarget.textContent.trim();
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email address copied to clipboard!');
        if (typeof soundEngine !== 'undefined') soundEngine.playPoint();
      }).catch(() => {
        showToast(`Email: ${email}`);
      });
    });
  }

  if (copyPhoneBtn && phoneTarget) {
    copyPhoneBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('+919962353867').then(() => {
        showToast('WhatsApp & Mobile copied: +91 99623 53867');
        if (typeof soundEngine !== 'undefined') soundEngine.playPoint();
      }).catch(() => {
        showToast('Phone: +91 99623 53867');
      });
    });
  }

  // ============================================================
  // 7. SCI-FI CONTACT FORM & DIRECT WHATSAPP TRANSMISSION
  // ============================================================
  const contactForm = document.getElementById('contactForm');
  const formSubmitBtn = document.getElementById('formSubmitBtn');
  const submitBtnText = document.getElementById('submitBtnText');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('senderName')?.value.trim() || 'Visitor';
      const email = document.getElementById('senderEmail')?.value.trim() || 'Not provided';
      const subject = document.getElementById('senderSubject')?.value || 'Portfolio Collaboration';
      const message = document.getElementById('senderMessage')?.value.trim() || '';

      if (submitBtnText) submitBtnText.textContent = 'ROUTING TO WHATSAPP (+91 99623 53867)...';
      if (formSubmitBtn) formSubmitBtn.disabled = true;

      if (typeof soundEngine !== 'undefined') soundEngine.playWarp();

      // Formulate formatted WhatsApp transmission
      const waText = `*⚡ New Portfolio Transmission // Sanjay S.*\n\n` +
        `👤 *Name / Codename:* ${name}\n` +
        `📧 *Email:* ${email}\n` +
        `🎯 *Subject:* ${subject}\n\n` +
        `💬 *Message:*\n${message}\n\n` +
        `━━━━━━━━━━━━━━━━━━━\n` +
        `🌐 _Dispatched from Sanjay S 3D Portfolio Terminal_`;

      const waUrl = `https://api.whatsapp.com/send?phone=919962353867&text=${encodeURIComponent(waText)}`;

      setTimeout(() => {
        // Open WhatsApp directly with formatted message to Sanjay's number
        window.open(waUrl, '_blank');

        if (submitBtnText) submitBtnText.textContent = 'WHATSAPP CHAT LAUNCHED!';
        if (formFeedback) {
          formFeedback.innerHTML = `<span style="color: #25d366; font-weight: 600;"><i class="fa-brands fa-whatsapp"></i> Uplink established! WhatsApp chat opened to transmit your message directly to Sanjay S (+91 99623 53867).</span>`;
        }

        showToast('Transmission routed to Sanjay S (+91 99623 53867) on WhatsApp!');
        if (typeof soundEngine !== 'undefined') soundEngine.playPoint();

        contactForm.reset();

        setTimeout(() => {
          if (submitBtnText) submitBtnText.textContent = 'TRANSMIT VIA WHATSAPP';
          if (formSubmitBtn) formSubmitBtn.disabled = false;
        }, 3500);
      }, 700);
    });
  }

  // ============================================================
  // 8. 3D TILT EFFECT ON CARDS ([data-tilt]) - CACHED TO PREVENT REFLOW
  // ============================================================
  const tiltElements = document.querySelectorAll('[data-tilt]');

  tiltElements.forEach(card => {
    let rect = null;

    card.addEventListener('mouseenter', () => {
      rect = card.getBoundingClientRect();
    });

    card.addEventListener('mousemove', (e) => {
      if (!rect) rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      rect = null;
      card.style.transform = '';
    });
  });

  // ============================================================
  // 9. TOAST NOTIFICATION UTILITY
  // ============================================================
  const toastEl = document.getElementById('cyberToast');
  const toastMsgEl = document.getElementById('toastMessage');
  let toastTimer = null;

  window.showToast = function(message) {
    if (!toastEl || !toastMsgEl) return;
    toastMsgEl.textContent = message;
    toastEl.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2800);
  };

  // ============================================================
  // 10. HERO PROFILE PHOTO UPLOADER & LOCAL STORAGE PERSISTENCE
  // ============================================================
  const heroPhotoUpload = document.getElementById('heroPhotoUpload');
  const heroProfileImg = document.getElementById('heroProfileImg');

  // Load custom photo if saved by user, otherwise display official uploaded portrait
  try {
    const savedPhoto = localStorage.getItem('sanjay_hero_photo');
    if (savedPhoto && savedPhoto.startsWith('data:image') && heroProfileImg) {
      heroProfileImg.src = savedPhoto;
    } else if (heroProfileImg) {
      heroProfileImg.src = 'assets/sanjay-portrait.jpg';
    }
  } catch (err) {
    if (heroProfileImg) heroProfileImg.src = 'assets/sanjay-portrait.jpg';
  }

  if (heroPhotoUpload && heroProfileImg) {
    heroPhotoUpload.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (JPG, PNG, WebP)');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const rawData = event.target.result;

        // Downscale image using canvas to ensure it fits comfortably within localStorage quota
        const img = new Image();
        img.onload = () => {
          const maxDim = 380;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const compressedData = canvas.toDataURL('image/jpeg', 0.85);

          heroProfileImg.src = compressedData;
          try {
            localStorage.setItem('sanjay_hero_photo', compressedData);
          } catch (storageErr) {
            console.warn('Could not persist image to localStorage:', storageErr);
          }

          showToast('Profile photo updated & bio-metric synchronized!');
          if (typeof soundEngine !== 'undefined') soundEngine.playPoint();
        };
        img.src = rawData;
      };
      reader.readAsDataURL(file);
    });
  }

});

