// V3.2.0

const demoFallbackNews = [
  {
    name: "Failed to load",
    date: "N/A",
    contents: [
      "If this issue occurs, please contact Voadmined using the contact form."
    ]
  }
];

const demoFallbackCredits = [
  {
    name: "Enpaged",
    role: "UI & Website Concept",
    socials: [
      "https://github.com/Enpaged"
    ],
    contributions: [
      "UI Design assistance",
      "Feature ideas and testing"
    ]
  },
  {
    name: "Voadmined",
    role: "Lead Developer & Owner",
    socials: [
      "https://github.com/Voadmined",
      "https://discord.com/users/1439010321099395165"
    ],
    contributions: [
      "Project creation and maintenance",
      "Frontend development & audio integration"
    ]
  }
];

const NEWS_JSON_URL = 'https://raw.githubusercontent.com/Voadmined/voadminedNews/refs/heads/main/news.json';
const CREDITS_JSON_URL = 'https://raw.githubusercontent.com/Voadmined/voadminedNews/refs/heads/main/credits.json';

const clickSound = new Audio('assets/click.wav');
clickSound.volume = 0.25;

function playClickSound() {
  const isSfxEnabled = localStorage.getItem('sfxEnabled') === 'true';
  if (isSfxEnabled) {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
  }
}

document.addEventListener('click', (event) => {
  const targetElement = event.target.closest('button, a, input, label, .theme-dot, .switch, .segment-btn, .logs-close-btn, .glass-icon-btn, .widget-toggle-btn, .player-btn');
  if (targetElement) {
    playClickSound();
  }
}, true);

const sfxToggle = document.getElementById('sfx-toggle');
if (sfxToggle) {
  sfxToggle.checked = false;
  sfxToggle.disabled = true;
}

const themes = {
  grey: {
    '--accent-purple': '#94a3b8',
    '--accent-purple-glow': 'rgba(148, 163, 184, 0.3)',
    '--orb-purple-bg': '#64748b',
    '--orb-violet-bg': '#475569',
    particleColor: 'rgba(148, 163, 184, '
  },
  purple: {
    '--accent-purple': '#8b5cf6',
    '--accent-purple-glow': 'rgba(139, 92, 246, 0.3)',
    '--orb-purple-bg': '#8b5cf6',
    '--orb-violet-bg': '#6d28d9',
    particleColor: 'rgba(139, 92, 246, '
  },
  blue: {
    '--accent-purple': '#3b82f6',
    '--accent-purple-glow': 'rgba(59, 130, 246, 0.3)',
    '--orb-purple-bg': '#3b82f6',
    '--orb-violet-bg': '#1d4ed8',
    particleColor: 'rgba(59, 130, 246, '
  },
  emerald: {
    '--accent-purple': '#10b981',
    '--accent-purple-glow': 'rgba(16, 185, 129, 0.3)',
    '--orb-purple-bg': '#10b981',
    '--orb-violet-bg': '#047857',
    particleColor: 'rgba(16, 185, 129, '
  },
  rose: {
    '--accent-purple': '#f43f5e',
    '--accent-purple-glow': 'rgba(244, 63, 94, 0.3)',
    '--orb-purple-bg': '#f43f5e',
    '--orb-violet-bg': '#be123c',
    particleColor: 'rgba(244, 63, 94, '
  },
  amber: {
    '--accent-purple': '#f59e0b',
    '--accent-purple-glow': 'rgba(245, 158, 11, 0.3)',
    '--orb-purple-bg': '#f59e0b',
    '--orb-violet-bg': '#b45309',
    particleColor: 'rgba(245, 158, 11, '
  },
  wine: {
    '--accent-purple': '#800020',
    '--accent-purple-glow': 'rgba(128, 0, 32, 0.3)',
    '--orb-purple-bg': '#800020',
    '--orb-violet-bg': '#4a0012',
    particleColor: 'rgba(128, 0, 32, '
  },
  aiTheme: {
    '--accent-purple': '#ec4899',
    '--accent-purple-glow': 'rgba(236, 72, 153, 0.35)',
    '--orb-purple-bg': '#ec4899',
    '--orb-violet-bg': '#3b82f6',
    particleColor: 'rgba(236, 72, 153, '
  }
};

let activeParticleColor = 'rgba(148, 163, 184, ';
let particleSpeedMultiplier = 1;

function escapeHTML(textString) {
  if (typeof textString !== 'string') return textString;
  return textString.replace(/[&<>'"]/g, 
    matchedTag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[matchedTag] || matchedTag)
  );
}

function applyTheme(themeName) {
  const selectedTheme = themes[themeName] || themes.grey;
  
  Object.keys(selectedTheme).forEach(themeKey => {
    if (themeKey !== 'particleColor') {
      document.documentElement.style.setProperty(themeKey, selectedTheme[themeKey]);
    }
  });

  if (themeName === 'aiTheme') {
    document.documentElement.setAttribute('data-theme', 'aiTheme');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  activeParticleColor = selectedTheme.particleColor;

  document.querySelectorAll('.theme-dot').forEach(dotElement => {
    dotElement.classList.toggle('active', dotElement.dataset.theme === themeName);
  });

  localStorage.setItem('selectedTheme', themeName);
}

const uiScaleSlider = document.getElementById('ui-scale-slider');
const uiScaleGroup = document.getElementById('ui-scale-group');
const uiScaleNotice = document.getElementById('ui-scale-notice');
const volumeSliderEl = document.getElementById('volume-slider');
const volumeContainerEl = document.getElementById('volume-container');
const mobileVolumeNotice = document.getElementById('mobile-volume-notice');

function applyUiScale(scaleValue) {
  document.documentElement.style.setProperty('--ui-scale', scaleValue);
  if (uiScaleSlider && uiScaleSlider.value !== scaleValue) {
    uiScaleSlider.value = scaleValue;
  }
  localStorage.setItem('uiScaleValue', scaleValue);
}

function checkMobileUiScale() {
  const isMobileDevice = window.innerWidth <= 480;

  if (isMobileDevice) {
    if (uiScaleSlider) uiScaleSlider.disabled = true;
    if (uiScaleGroup) uiScaleGroup.classList.add('disabled-mobile');
    if (uiScaleNotice) uiScaleNotice.style.display = 'block';
    if (volumeSliderEl) volumeSliderEl.disabled = true;
    if (volumeContainerEl) volumeContainerEl.classList.add('disabled-mobile');
    if (mobileVolumeNotice) mobileVolumeNotice.style.display = 'block';
    applyUiScale('1');
  } else {
    if (uiScaleSlider) uiScaleSlider.disabled = false;
    if (uiScaleGroup) uiScaleGroup.classList.remove('disabled-mobile');
    if (uiScaleNotice) uiScaleNotice.style.display = 'none';
    if (volumeSliderEl) volumeSliderEl.disabled = false;
    if (volumeContainerEl) volumeContainerEl.classList.remove('disabled-mobile');
    if (mobileVolumeNotice) mobileVolumeNotice.style.display = 'none';
    const savedUiScaleValue = localStorage.getItem('uiScaleValue') || '1';
    applyUiScale(savedUiScaleValue);
  }
}

if (uiScaleSlider) {
  uiScaleSlider.min = "0.8";
  uiScaleSlider.max = "1.2";
  uiScaleSlider.step = "0.01";
  
  uiScaleSlider.addEventListener('input', (event) => {
    applyUiScale(event.target.value);
  });
}

window.addEventListener('resize', checkMobileUiScale);
checkMobileUiScale();

const orbsToggle = document.getElementById('orbs-toggle');
const glowOrbs = document.querySelectorAll('.glow-orb');

let userOrbsState = localStorage.getItem('orbsEnabled') !== null 
  ? localStorage.getItem('orbsEnabled') === 'true' 
  : true;

function updateOrbsVisibility() {
  const currentAppMode = localStorage.getItem('selectedAppMode') || 'dark';
  const isLightMode = currentAppMode === 'light';
  
  if (isLightMode) {
    glowOrbs.forEach(orbElement => orbElement.style.display = 'none');
    if (orbsToggle) {
      orbsToggle.checked = false;
      orbsToggle.disabled = true;
    }
  } else {
    if (orbsToggle) {
      orbsToggle.disabled = false;
      orbsToggle.checked = userOrbsState;
    }
    glowOrbs.forEach(orbElement => orbElement.style.display = userOrbsState ? 'block' : 'none');
  }
}

function setAppMode(appMode) {
  if (appMode === 'light') {
    document.documentElement.setAttribute('data-mode', 'light');
    document.getElementById('mode-light-btn')?.classList.add('active');
    document.getElementById('mode-dark-btn')?.classList.remove('active');
  } else {
    document.documentElement.removeAttribute('data-mode');
    document.getElementById('mode-dark-btn')?.classList.add('active');
    document.getElementById('mode-light-btn')?.classList.remove('active');
  }
  localStorage.setItem('selectedAppMode', appMode);
  updateOrbsVisibility();
}

const savedThemeName = localStorage.getItem('selectedTheme') || 'grey';
applyTheme(savedThemeName);

const savedAppModeName = localStorage.getItem('selectedAppMode') || 'dark';
setAppMode(savedAppModeName);

document.querySelectorAll('.theme-dot').forEach(dotElement => {
  dotElement.addEventListener('click', (event) => {
    event.stopPropagation();
    applyTheme(dotElement.dataset.theme);
  });
});

document.getElementById('mode-dark-btn')?.addEventListener('click', () => setAppMode('dark'));
document.getElementById('mode-light-btn')?.addEventListener('click', () => setAppMode('light'));

const particlesToggle = document.getElementById('particles-toggle');
const particlesCanvas = document.getElementById('particles-canvas');
const particleDensitySlider = document.getElementById('particle-density-slider');

let updateParticleCountFunction = null;

if (particleDensitySlider) {
  const savedDensity = localStorage.getItem('particleDensity');
  if (savedDensity) {
    particleDensitySlider.value = savedDensity;
  }
  particleDensitySlider.addEventListener('input', (e) => {
    localStorage.setItem('particleDensity', e.target.value);
    if (updateParticleCountFunction) {
      updateParticleCountFunction(parseInt(e.target.value, 10));
    }
  });
}

const savedParticlesSetting = localStorage.getItem('particlesEnabled');
if (savedParticlesSetting !== null && particlesToggle && particlesCanvas) {
  const isParticlesEnabled = savedParticlesSetting === 'true';
  particlesToggle.checked = isParticlesEnabled;
  particlesCanvas.style.opacity = isParticlesEnabled ? '1' : '0';
}

if (particlesToggle && particlesCanvas) {
  particlesToggle.addEventListener('change', (event) => {
    const isCheckedState = event.target.checked;
    particlesCanvas.style.opacity = isCheckedState ? '1' : '0';
    localStorage.setItem('particlesEnabled', isCheckedState);
  });
}

if (orbsToggle) {
  orbsToggle.addEventListener('change', (event) => {
    const isCheckedState = event.target.checked;
    userOrbsState = isCheckedState;
    localStorage.setItem('orbsEnabled', isCheckedState);
    updateOrbsVisibility();
  });
}

updateOrbsVisibility();

function isTestEnvironment() {
  const currentHostname = window.location.hostname;
  
  if (currentHostname === 'localhost' || currentHostname === '127.0.0.1' || window.location.protocol === 'file:') {
    return true;
  }
  
  if (currentHostname.includes('netlify.app')) {
    const productionDomain = 'voadmined.netlify.app';
    if (currentHostname !== productionDomain) {
      return true;
    }
  }

  return false;
}

const betaTopBtn = document.getElementById('beta-top-btn');
const betaWatermark = document.getElementById('beta-watermark');
const betaWarningBackdrop = document.getElementById('beta-warning-backdrop');
const betaWarningCloseBtn = document.getElementById('beta-warning-close-btn');
const betaWarningOkBtn = document.getElementById('beta-warning-ok-btn');
const enterOverlay = document.getElementById('enter-overlay');

if (isTestEnvironment()) {
  if (betaTopBtn) betaTopBtn.style.display = 'flex';
  if (betaWatermark) betaWatermark.style.display = 'block';
  if (betaWarningBackdrop) betaWarningBackdrop.classList.add('open');
}

if (betaWarningCloseBtn) {
  betaWarningCloseBtn.addEventListener('click', () => {
    betaWarningBackdrop.classList.remove('open');
  });
}

if (betaWarningOkBtn) {
  betaWarningOkBtn.addEventListener('click', () => {
    betaWarningBackdrop.classList.remove('open');
  });
}

if (betaWarningBackdrop) {
  betaWarningBackdrop.addEventListener('click', (event) => {
    if (event.target === betaWarningBackdrop) {
      betaWarningBackdrop.classList.remove('open');
    }
  });
}

const audioElement = document.getElementById('bg-music');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');

const audioWidget = document.getElementById('audio-widget');
const widgetToggleBtn = document.getElementById('widget-toggle-btn');

const newsToggleBtn = document.getElementById('news-toggle-btn');
const newsBackdrop = document.getElementById('news-backdrop');
const newsCloseBtn = document.getElementById('news-close-btn');
const newsContent = document.getElementById('news-content');
const creditsContent = document.getElementById('credits-content');
const newsTabBtn = document.getElementById('news-tab-btn');
const creditsTabBtn = document.getElementById('credits-tab-btn');
const newsModalTitle = document.getElementById('news-modal-title');

const settingsToggleBtn = document.getElementById('settings-toggle-btn');
const settingsBackdrop = document.getElementById('settings-backdrop');
const settingsCloseBtn = document.getElementById('settings-close-btn');

const contactToggleBtn = document.getElementById('contact-toggle-btn');
const contactBackdrop = document.getElementById('contact-backdrop');
const contactCloseBtn = document.getElementById('contact-close-btn');

const feedbackBackdrop = document.getElementById('feedback-backdrop');
const feedbackCloseBtn = document.getElementById('feedback-close-btn');

const terminalBackdrop = document.getElementById('terminal-backdrop');
const terminalCloseBtn = document.getElementById('terminal-close-btn');
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const terminalBottomBar = document.getElementById('terminal-bottom-bar');

let loadedNews = [];
let loadedCredits = [];

if (audioElement && volumeSlider) {
  audioElement.volume = volumeSlider.value;
}

if (enterOverlay) {
  enterOverlay.addEventListener('click', () => {
    enterOverlay.classList.add('fade-out');
    if (audioElement) {
      audioElement.play().then(() => {
        if (playIcon) {
          playIcon.classList.remove('fa-play');
          playIcon.classList.add('fa-pause');
        }
        glowOrbs.forEach(orbElement => orbElement.classList.add('pulse-music'));
      }).catch(() => {});
    }
  });
}

const contactEmail = document.getElementById('contact-email');
const contactMessage = document.getElementById('contact-message');
const contactConsent = document.getElementById('contact-consent');
const contactSubmitBtn = document.getElementById('contact-submit-btn');

function validateContactForm() {
  if (!contactEmail || !contactMessage || !contactConsent || !contactSubmitBtn) return;
  const isEmailValid = contactEmail.value.trim() !== '' && contactEmail.checkValidity();
  const isMessageValid = contactMessage.value.trim() !== '';
  const isConsentChecked = contactConsent.checked;

  contactSubmitBtn.disabled = !(isEmailValid && isMessageValid && isConsentChecked);
}

if (contactEmail && contactMessage && contactConsent) {
  contactEmail.addEventListener('input', validateContactForm);
  contactMessage.addEventListener('input', validateContactForm);
  contactConsent.addEventListener('change', validateContactForm);
}

const feedbackText = document.getElementById('feedback-text');
const feedbackSubmitBtn = document.getElementById('feedback-submit-btn');

function validateFeedbackForm() {
  if (!feedbackText || !feedbackSubmitBtn) return;
  feedbackSubmitBtn.disabled = feedbackText.value.trim() === '';
}

if (feedbackText) {
  feedbackText.addEventListener('input', validateFeedbackForm);
}

function closeAllModals() {
  if (audioWidget) audioWidget.classList.remove('open');
  if (newsBackdrop) newsBackdrop.classList.remove('open');
  if (settingsBackdrop) settingsBackdrop.classList.remove('open');
  if (contactBackdrop) contactBackdrop.classList.remove('open');
  if (feedbackBackdrop) feedbackBackdrop.classList.remove('open');
  if (betaWarningBackdrop) betaWarningBackdrop.classList.remove('open');
  
  if (terminalBackdrop) terminalBackdrop.classList.remove('open');
  if (terminalBottomBar) terminalBottomBar.classList.remove('open');
  if (terminalInput) terminalInput.blur();
}

function openTerminal() {
  closeAllModals();
  if (terminalBackdrop) terminalBackdrop.classList.add('open');
  if (terminalBottomBar) terminalBottomBar.classList.add('open');
  setTimeout(() => {
    if (terminalInput) {
      terminalInput.value = '';
      terminalInput.focus();
    }
  }, 50);
}

function closeTerminal() {
  if (terminalBackdrop) terminalBackdrop.classList.remove('open');
  if (terminalBottomBar) terminalBottomBar.classList.remove('open');
  if (terminalInput) terminalInput.blur();
}

window.addEventListener('keydown', (event) => {
  const currentKey = event.key.toLowerCase();
  const isTerminalOpen = terminalBackdrop && terminalBackdrop.classList.contains('open');

  if (event.key === '-' || currentKey === 'minus') {
    event.preventDefault();
    playClickSound();
    if (isTerminalOpen) {
      closeTerminal();
    } else {
      openTerminal();
    }
    return;
  }

  if (isTerminalOpen || document.activeElement === terminalInput || ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    if (currentKey === 'escape') {
      playClickSound();
      closeAllModals();
    }
    return;
  }

  if (currentKey === 'escape') {
    playClickSound();
    closeAllModals();
    return;
  }

  switch (currentKey) {
    case 'm': {
      event.preventDefault();
      playClickSound();
      if (!audioWidget) break;
      const isAudioWidgetOpen = audioWidget.classList.contains('open');
      
      if (audioElement && !isAudioWidgetOpen && !audioElement.paused) {
        audioElement.pause();
        if (playIcon) {
          playIcon.classList.remove('fa-pause');
          playIcon.classList.add('fa-play');
        }
        glowOrbs.forEach(orbElement => orbElement.classList.remove('pulse-music'));
        closeAllModals();
        audioWidget.classList.add('open');
      } else if (audioElement && isAudioWidgetOpen && audioElement.paused) {
        audioElement.play().catch(() => {});
        if (playIcon) {
          playIcon.classList.remove('fa-play');
          playIcon.classList.add('fa-pause');
        }
        glowOrbs.forEach(orbElement => orbElement.classList.add('pulse-music'));
        audioWidget.classList.remove('open');
      } else {
        if (isAudioWidgetOpen) {
          audioWidget.classList.remove('open');
        } else {
          closeAllModals();
          audioWidget.classList.add('open');
        }
      }
      break;
    }
    
    case 's': {
      event.preventDefault();
      playClickSound();
      if (!settingsBackdrop) break;
      const isSettingsOpen = settingsBackdrop.classList.contains('open');
      closeAllModals();
      if (!isSettingsOpen) {
        settingsBackdrop.classList.add('open');
      }
      break;
    }
    
    case 'c': {
      event.preventDefault();
      playClickSound();
      const isContactOpen = contactBackdrop && contactBackdrop.classList.contains('open');
      closeAllModals();
      if (!isContactOpen && contactBackdrop) {
        contactBackdrop.classList.add('open');
      }
      break;
    }
    
    case 'n': {
      event.preventDefault();
      playClickSound();
      if (!newsBackdrop) break;
      const isNewsOpen = newsBackdrop.classList.contains('open');
      closeAllModals();
      if (!isNewsOpen) {
        newsBackdrop.classList.add('open');
      }
      break;
    }
    
    case 'b':
      if (isTestEnvironment() && betaWarningBackdrop) {
        event.preventDefault();
        playClickSound();
        const isFeedbackOpen = feedbackBackdrop && feedbackBackdrop.classList.contains('open');
        closeAllModals();
        if (!isFeedbackOpen && feedbackBackdrop) {
          feedbackBackdrop.classList.add('open');
        }
      }
      break;
  }
});

if (terminalCloseBtn) {
  terminalCloseBtn.addEventListener('click', closeTerminal);
}

if (terminalBackdrop) {
  terminalBackdrop.addEventListener('click', (event) => {
    if (event.target === terminalBackdrop) {
      closeTerminal();
    }
  });
}

if (terminalInput) {
  terminalInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const rawCommand = terminalInput.value.trim();
      if (!rawCommand) return;

      const userLineElement = document.createElement('p');
      userLineElement.innerHTML = `<span style="color: var(--text-muted);">&gt;</span> ${escapeHTML(rawCommand)}`;
      terminalOutput.appendChild(userLineElement);

      let processedCommand = rawCommand.toLowerCase();
      if (!processedCommand.startsWith('/')) {
        processedCommand = '/' + processedCommand;
      }

      const responseLineElement = document.createElement('p');
      const commandParts = processedCommand.split(' ');
      const mainCommand = commandParts[0];
      const commandArg = commandParts[1] ? commandParts[1] : '';

      switch (mainCommand) {
        case '/help':
          responseLineElement.innerHTML = `Available commands:<br>
            <code>/help</code> - Show available commands<br>
            <code>/about</code> - Information about Voadmined<br>
            <code>/socials</code> - Show social media links<br>
            <code>/theme &lt;name&gt;</code> - Change color theme (grey, purple, blue, emerald, rose, amber, wine)<br>
            <code>/contact</code> - Open contact form<br>
            <code>/clear</code> - Clear terminal screen`;
          terminalOutput.appendChild(responseLineElement);
          break;

        case '/ai':
          applyTheme('aiTheme');
          responseLineElement.textContent = "AI theme activated!";
          terminalOutput.appendChild(responseLineElement);
          break;

        case '/about':
          responseLineElement.textContent = 'Voadmined is a passionate pianist, Discord moderator, and frontend developer building interactive web experiences.';
          terminalOutput.appendChild(responseLineElement);
          break;

        case '/socials':
          responseLineElement.innerHTML = 'Social links:<br>• Discord: <a href="https://discord.com/users/1439010321099395165" target="_blank" style="color: var(--accent-purple);">View Profile</a><br>• GitHub: <a href="https://github.com/Voadmined" target="_blank" style="color: var(--accent-purple);">github.com/Voadmined</a>';
          terminalOutput.appendChild(responseLineElement);
          break;

        case '/theme':
          if (!commandArg) {
            responseLineElement.textContent = `Current theme is: ${localStorage.getItem('selectedTheme') || 'grey'}. Use /theme <name> to change it.`;
          } else if (themes[commandArg] && commandArg !== 'aitheme') {
            applyTheme(commandArg);
            responseLineElement.textContent = `Theme successfully changed to '${commandArg}'.`;
          } else {
            responseLineElement.textContent = `Unknown theme '${commandArg}'. Available themes: grey, purple, blue, emerald, rose, amber, wine.`;
          }
          terminalOutput.appendChild(responseLineElement);
          break;

        case '/contact':
          closeTerminal();
          if (contactBackdrop) contactBackdrop.classList.add('open');
          responseLineElement.textContent = 'Opening contact form modal...';
          terminalOutput.appendChild(responseLineElement);
          break;

        case '/clear':
          terminalOutput.innerHTML = '';
          terminalInput.value = '';
          return;

        default:
          responseLineElement.textContent = `Unknown command '${rawCommand}'. Type /help for a list of available commands.`;
          terminalOutput.appendChild(responseLineElement);
          break;
      }

      terminalInput.value = '';
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
  });
}

if (widgetToggleBtn) {
  widgetToggleBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    if (!audioWidget) return;
    const isAudioWidgetOpen = audioWidget.classList.contains('open');
    closeAllModals();
    if (!isAudioWidgetOpen) audioWidget.classList.add('open');
  });
}

if (newsToggleBtn) {
  newsToggleBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    closeAllModals();
    if (newsBackdrop) newsBackdrop.classList.add('open');
  });
}

if (newsCloseBtn) {
  newsCloseBtn.addEventListener('click', () => {
    if (newsBackdrop) newsBackdrop.classList.remove('open');
  });
}

if (newsBackdrop) {
  newsBackdrop.addEventListener('click', (event) => {
    if (event.target === newsBackdrop) {
      newsBackdrop.classList.remove('open');
    }
  });
}

if (newsTabBtn && creditsTabBtn) {
  newsTabBtn.addEventListener('click', () => {
    newsTabBtn.classList.add('active');
    creditsTabBtn.classList.remove('active');
    if (newsContent) newsContent.style.display = 'flex';
    if (creditsContent) creditsContent.style.display = 'none';
    if (newsModalTitle) newsModalTitle.innerHTML = '<i class="fa-solid fa-newspaper"></i> News';
  });

  creditsTabBtn.addEventListener('click', () => {
    creditsTabBtn.classList.add('active');
    newsTabBtn.classList.remove('active');
    if (newsContent) newsContent.style.display = 'none';
    if (creditsContent) creditsContent.style.display = 'flex';
    if (newsModalTitle) newsModalTitle.innerHTML = '<i class="fa-solid fa-heart"></i> Credits';
  });
}

if (settingsToggleBtn) {
  settingsToggleBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    closeAllModals();
    if (settingsBackdrop) settingsBackdrop.classList.add('open');
  });
}

if (settingsCloseBtn) {
  settingsCloseBtn.addEventListener('click', () => {
    if (settingsBackdrop) settingsBackdrop.classList.remove('open');
  });
}

if (settingsBackdrop) {
  settingsBackdrop.addEventListener('click', (event) => {
    if (event.target === settingsBackdrop) {
      settingsBackdrop.classList.remove('open');
    }
  });
}

if (contactToggleBtn) {
  contactToggleBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    closeAllModals();
    if (contactBackdrop) contactBackdrop.classList.add('open');
  });
}

if (contactCloseBtn) {
  contactCloseBtn.addEventListener('click', () => {
    if (contactBackdrop) contactBackdrop.classList.remove('open');
  });
}

if (contactBackdrop) {
  contactBackdrop.addEventListener('click', (event) => {
    if (event.target === contactBackdrop) {
      contactBackdrop.classList.remove('open');
    }
  });
}

if (betaTopBtn) {
  betaTopBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    closeAllModals();
    if (feedbackBackdrop) feedbackBackdrop.classList.add('open');
  });
}

if (feedbackCloseBtn) {
  feedbackCloseBtn.addEventListener('click', () => {
    if (feedbackBackdrop) feedbackBackdrop.classList.remove('open');
  });
}

if (feedbackBackdrop) {
  feedbackBackdrop.addEventListener('click', (event) => {
    if (event.target === feedbackBackdrop) {
      feedbackBackdrop.classList.remove('open');
    }
  });
}

function renderAllNews() {
  if (!newsContent) return;
  if (!loadedNews || loadedNews.length === 0) {
    newsContent.innerHTML = '<p class="logs-loading">No news available.</p>';
    return;
  }

  newsContent.innerHTML = '';

  loadedNews.forEach(newsItem => {
    const entryDivElement = document.createElement('div');
    entryDivElement.className = 'log-entry';

    const itemTitle = escapeHTML(newsItem.name || newsItem.title || newsItem.version || "Update");
    const itemDate = escapeHTML(newsItem.date || "");
    
    let rawContentsList = newsItem.contents || newsItem.description || newsItem.changes || [];
    if (typeof rawContentsList === 'string') {
      rawContentsList = [rawContentsList];
    }

    const contentsListHtml = Array.isArray(rawContentsList) 
      ? rawContentsList.map(contentItem => `<li>${escapeHTML(contentItem)}</li>`).join('')
      : '';

    entryDivElement.innerHTML = `
      <div class="log-meta">
        <span class="log-version">${itemTitle}</span>
        ${itemDate ? `<span class="log-date">${itemDate}</span>` : ''}
      </div>
      <ul class="log-list">
        ${contentsListHtml}
      </ul>
    `;
    newsContent.appendChild(entryDivElement);
  });
}

function renderAllCredits() {
  const creditsContainerEl = creditsContent || document.getElementById('credits-container');
  if (!creditsContainerEl) return;

  if (!loadedCredits || loadedCredits.length === 0) {
    creditsContainerEl.innerHTML = '<p class="logs-loading">No credits available at the moment.</p>';
    return;
  }

  creditsContainerEl.innerHTML = '';

  const creditsArrayData = Array.isArray(loadedCredits) ? loadedCredits : [loadedCredits];

  creditsArrayData.forEach(creditItem => {
    const cardDivElement = document.createElement('div');
    cardDivElement.className = 'credit-card';

    const creditNameValue = escapeHTML(creditItem.name || "Anonymous");
    const creditRoleValue = escapeHTML(creditItem.role || creditItem.title || "");
    
    let socialsHtmlString = '';
    if (Array.isArray(creditItem.socials) && creditItem.socials.length > 0) {
      socialsHtmlString = creditItem.socials.map(socialUrl => {
        const safeSocialUrl = escapeHTML(socialUrl);
        let socialIconClass = 'fa-solid fa-link';
        if (socialUrl.includes('discord')) socialIconClass = 'fa-brands fa-discord';
        else if (socialUrl.includes('github')) socialIconClass = 'fa-brands fa-github';
        else if (socialUrl.includes('twitter') || socialUrl.includes('x.com')) socialIconClass = 'fa-brands fa-x-twitter';
        
        return `<a href="${safeSocialUrl}" target="_blank" rel="noopener noreferrer" class="credit-social-btn" aria-label="Social Link">
                  <i class="${socialIconClass}"></i>
                </a>`;
      }).join('');
    }

    const contributionsArray = creditItem.contributions || creditItem.contribtutions || [];
    let contributionsHtmlString = '';
    if (Array.isArray(contributionsArray) && contributionsArray.length > 0) {
      contributionsHtmlString = `<ul class="log-list">
                                    ${contributionsArray.map(contributionItem => `<li>${escapeHTML(contributionItem)}</li>`).join('')}
                                  </ul>`;
    }

    cardDivElement.innerHTML = `
      <div class="credit-header">
        <div>
          <span class="credit-name">${creditNameValue}</span>
          ${creditRoleValue ? `<div class="credit-role">${creditRoleValue}</div>` : ''}
        </div>
        ${socialsHtmlString ? `<div class="credit-socials">${socialsHtmlString}</div>` : ''}
      </div>
      ${contributionsHtmlString}
    `;
    
    creditsContainerEl.appendChild(cardDivElement);
  });
}

async function loadNewsData() {
  try {
    const cacheBusterUrl = `${NEWS_JSON_URL}?t=${Date.now()}`;

    const networkResponse = await fetch(cacheBusterUrl, { 
      cache: 'no-store'
    });
    
    if (!networkResponse.ok) throw new Error(`HTTP status: ${networkResponse.status}`);
    loadedNews = await networkResponse.json();
  } catch (errorObject) {
    console.error('Error fetching news:', errorObject);
    loadedNews = demoFallbackNews;
  }
  renderAllNews();
}

async function loadCreditsData() {
  try {
    const cacheBusterUrl = `${CREDITS_JSON_URL}?t=${Date.now()}`;

    const networkResponse = await fetch(cacheBusterUrl, { 
      cache: 'no-store'
    });
    
    if (!networkResponse.ok) throw new Error(`HTTP status: ${networkResponse.status}`);
    loadedCredits = await networkResponse.json();
  } catch (errorObject) {
    console.error('Error fetching credits:', errorObject);
    loadedCredits = demoFallbackCredits;
  }
  renderAllCredits();
}

loadNewsData();
loadCreditsData();

if (playPauseBtn && audioElement) {
  playPauseBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    if (audioElement.paused) {
      audioElement.play();
      if (playIcon) {
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
      }
      glowOrbs.forEach(orbElement => orbElement.classList.add('pulse-music'));
    } else {
      audioElement.pause();
      if (playIcon) {
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
      }
      glowOrbs.forEach(orbElement => orbElement.classList.remove('pulse-music'));
    }
  });
}

function updateVolumeIcon(volumeLevel) {
  if (!volumeIcon) return;
  volumeIcon.className = 'fa-solid ';
  if (volumeLevel === 0) {
    volumeIcon.className += 'fa-volume-xmark';
  } else if (volumeLevel < 0.3) {
    volumeIcon.className += 'fa-volume-off';
  } else if (volumeLevel < 0.7) {
    volumeIcon.className += 'fa-volume-low';
  } else {
    volumeIcon.className += 'fa-volume-high';
  }
}

if (volumeSlider && audioElement) {
  volumeSlider.addEventListener('input', (event) => {
    const volumeValue = parseFloat(event.target.value);
    audioElement.volume = volumeValue;
    updateVolumeIcon(volumeValue);
  });
}

if (particlesCanvas) {
  const canvasContext = particlesCanvas.getContext('2d');

  let particleObjectsArray = [];
  let totalParticlesCount = particleDensitySlider ? parseInt(particleDensitySlider.value, 10) : 45;

  const mouseCoordinates = {
    x: null,
    y: null,
    radius: 120
  };

  window.addEventListener('mousemove', (event) => {
    mouseCoordinates.x = event.clientX;
    mouseCoordinates.y = event.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouseCoordinates.x = null;
    mouseCoordinates.y = null;
  });

  function resizeParticleCanvas() {
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeParticleCanvas);
  resizeParticleCanvas();

  class ParticleObject {
    constructor() {
      this.x = Math.random() * particlesCanvas.width;
      this.y = Math.random() * particlesCanvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.velocityX = (Math.random() - 0.5) * 0.4;
      this.velocityY = (Math.random() - 0.5) * 0.4;
      this.baseVelocityX = this.velocityX;
      this.baseVelocityY = this.velocityY;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.friction = 0.96;
      this.colorIndex = Math.floor(Math.random() * 3);
    }

    updateParticle(currentSpeedMultiplier) {
      if (mouseCoordinates.x !== null && mouseCoordinates.y !== null && currentSpeedMultiplier > 0) {
        let deltaX = mouseCoordinates.x - this.x;
        let deltaY = mouseCoordinates.y - this.y;
        let distanceToMouse = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distanceToMouse < mouseCoordinates.radius) {
          let forceDirectionX = deltaX / distanceToMouse;
          let forceDirectionY = deltaY / distanceToMouse;
          let interactionForce = (mouseCoordinates.radius - distanceToMouse) / mouseCoordinates.radius;
          
          this.velocityX -= forceDirectionX * interactionForce * 0.8;
          this.velocityY -= forceDirectionY * interactionForce * 0.8;
        }
      }

      this.x += this.velocityX * currentSpeedMultiplier;
      this.y += this.velocityY * currentSpeedMultiplier;

      this.velocityX = this.velocityX * this.friction + this.baseVelocityX * (1 - this.friction);
      this.velocityY = this.velocityY * this.friction + this.baseVelocityY * (1 - this.friction);

      if (this.x < 0) this.x = particlesCanvas.width;
      if (this.x > particlesCanvas.width) this.x = 0;
      if (this.y < 0) this.y = particlesCanvas.height;
      if (this.y > particlesCanvas.height) this.y = 0;
    }

    drawParticle() {
      let particleColorString = `${activeParticleColor}${this.opacity})`;
      
      const isAiThemeActive = document.documentElement.getAttribute('data-theme') === 'aiTheme';
      if (isAiThemeActive) {
        const aiColorsArray = [
          `rgba(236, 72, 153, ${this.opacity})`,
          `rgba(139, 92, 246, ${this.opacity})`,
          `rgba(59, 130, 246, ${this.opacity})`
        ];
        particleColorString = aiColorsArray[this.colorIndex];
      }

      canvasContext.fillStyle = particleColorString;
      canvasContext.beginPath();
      canvasContext.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      canvasContext.fill();
    }
  }

  function initializeParticles() {
    particleObjectsArray = [];
    for (let index = 0; index < totalParticlesCount; index++) {
      particleObjectsArray.push(new ParticleObject());
    }
  }

  updateParticleCountFunction = function(newCount) {
    totalParticlesCount = newCount;
    if (particleObjectsArray.length < totalParticlesCount) {
      const diff = totalParticlesCount - particleObjectsArray.length;
      for (let i = 0; i < diff; i++) {
        particleObjectsArray.push(new ParticleObject());
      }
    } else if (particleObjectsArray.length > totalParticlesCount) {
      particleObjectsArray.splice(totalParticlesCount);
    }
  };

  function animateParticlesLoop() {
    canvasContext.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);

    const targetSpeedValue = (audioElement && audioElement.paused) ? 0 : 1;
    
    particleSpeedMultiplier += (targetSpeedValue - particleSpeedMultiplier) * 0.05;

    particleObjectsArray.forEach(singleParticle => {
      singleParticle.updateParticle(particleSpeedMultiplier);
      singleParticle.drawParticle();
    });
    requestAnimationFrame(animateParticlesLoop);
  }

  initializeParticles();
  animateParticlesLoop();
}