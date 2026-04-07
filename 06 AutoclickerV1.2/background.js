// --- SHARED CLICKER LOGIC (Duplicate for Injection) ---
function startAutoClickAndRipple(ms) {
  if (window.clickerInterval) clearInterval(window.clickerInterval);
  if (window.trackMouseFn) document.removeEventListener('mousemove', window.trackMouseFn);

  const styleId = 'ac-ripple-style';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      .ac-ripple {
        position: fixed;
        height: 50px;
        width: 50px;
        background-color: rgba(0, 150, 255, 0.6);
        border: 2px solid rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        pointer-events: none;
        z-index: 2147483647;
        transform: translate(-50%, -50%) scale(0);
        animation: ac-ripple-anim 0.4s ease-out forwards;
      }
      @keyframes ac-ripple-anim {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  window.acMouse = { x: 0, y: 0 };
  window.trackMouseFn = (e) => {
    window.acMouse.x = e.clientX;
    window.acMouse.y = e.clientY;
  };
  document.addEventListener('mousemove', window.trackMouseFn);

  window.clickerInterval = setInterval(() => {
    const el = document.elementFromPoint(window.acMouse.x, window.acMouse.y);
    if (el) {
      el.click();
      const ripple = document.createElement('div');
      ripple.className = 'ac-ripple';
      ripple.style.left = window.acMouse.x + 'px';
      ripple.style.top = window.acMouse.y + 'px';
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 400);
    }
  }, ms);
}

function stopAutoClickAndRipple() {
  clearInterval(window.clickerInterval);
  document.removeEventListener('mousemove', window.trackMouseFn);
  const style = document.getElementById('ac-ripple-style');
  if (style) style.remove();
}

// --- SHORTCUT LISTENER ---
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "_execute_action") {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;

    const data = await chrome.storage.local.get(['isClickerActive', 'currentCps']);
    const newState = !data.isClickerActive;
    const cps = data.currentCps || 10;

    await chrome.storage.local.set({ isClickerActive: newState });

    if (newState) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: startAutoClickAndRipple,
        args: [1000 / cps]
      });
    } else {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: stopAutoClickAndRipple
      });
    }
  }
});