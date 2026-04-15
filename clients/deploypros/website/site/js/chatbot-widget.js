/* ============================================
   DEPLOYPROS — Chatbot Widget
   Floating button + expandable chat panel
   ============================================ */

(function () {
  'use strict';

  var chatBtn = document.querySelector('.chatbot-btn');
  if (!chatBtn) return;

  var isOpen = false;
  var bubbleShown = false;
  var bubbleEl = null;
  var panelEl = null;
  var messages = [
    { type: 'bot', text: 'Hi there! I\'m the Deploy Pros assistant. How can I help you today?' }
  ];

  var quickReplies = [
    'Get a quote',
    'Learn about DPROMPT',
    'Service areas',
    'Talk to someone'
  ];

  // Show welcome bubble after 3 seconds
  setTimeout(function () {
    if (!isOpen && !bubbleShown) {
      showBubble();
    }
  }, 3000);

  function showBubble() {
    bubbleShown = true;
    bubbleEl = document.createElement('div');
    bubbleEl.className = 'chatbot-bubble';
    bubbleEl.textContent = 'Need help with field service deployments? Chat with us!';
    document.body.appendChild(bubbleEl);

    // Auto-hide after 6 seconds
    setTimeout(function () {
      if (bubbleEl && bubbleEl.parentNode) {
        bubbleEl.style.opacity = '0';
        bubbleEl.style.transition = 'opacity 0.3s';
        setTimeout(function () {
          if (bubbleEl && bubbleEl.parentNode) bubbleEl.parentNode.removeChild(bubbleEl);
        }, 300);
      }
    }, 6000);
  }

  function createPanel() {
    panelEl = document.createElement('div');
    panelEl.className = 'chatbot-panel';
    panelEl.innerHTML = '<div class="chatbot-header">' +
      '<div style="display:flex;align-items:center;gap:8px;">' +
      '<div style="width:32px;height:32px;border-radius:50%;background:var(--gradient-cta);display:flex;align-items:center;justify-content:center;"><i data-lucide="bot" style="width:16px;height:16px;"></i></div>' +
      '<div><div style="font-weight:600;font-size:0.875rem;">Deploy Pros</div><div style="font-size:0.7rem;color:var(--text-on-dark-muted);">Usually replies instantly</div></div>' +
      '</div>' +
      '<button class="chatbot-close" style="color:var(--text-on-dark-muted);background:none;border:none;cursor:pointer;"><i data-lucide="x" style="width:20px;height:20px;"></i></button>' +
      '</div>' +
      '<div class="chatbot-messages" id="chatbot-messages"></div>' +
      '<div id="chatbot-quick-replies" style="padding:8px 16px;display:flex;flex-wrap:wrap;gap:6px;"></div>' +
      '<div class="chatbot-input-area">' +
      '<input type="text" id="chatbot-input" placeholder="Type a message...">' +
      '<button class="chatbot-send" id="chatbot-send"><i data-lucide="send" style="width:14px;height:14px;"></i></button>' +
      '</div>';

    document.body.appendChild(panelEl);

    // Bind close
    panelEl.querySelector('.chatbot-close').addEventListener('click', togglePanel);

    // Bind send
    var sendBtn = document.getElementById('chatbot-send');
    var inputEl = document.getElementById('chatbot-input');

    sendBtn.addEventListener('click', function () {
      sendMessage(inputEl.value);
    });
    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') sendMessage(inputEl.value);
    });

    renderMessages();
    renderQuickReplies();

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function renderMessages() {
    var container = document.getElementById('chatbot-messages');
    if (!container) return;

    container.innerHTML = '';
    messages.forEach(function (msg) {
      var div = document.createElement('div');
      div.className = 'chatbot-msg chatbot-msg--' + msg.type;
      div.textContent = msg.text;
      container.appendChild(div);
    });
    container.scrollTop = container.scrollHeight;
  }

  function renderQuickReplies() {
    var container = document.getElementById('chatbot-quick-replies');
    if (!container) return;

    if (messages.length > 1) {
      container.style.display = 'none';
      return;
    }

    container.innerHTML = '';
    quickReplies.forEach(function (reply) {
      var btn = document.createElement('button');
      btn.style.cssText = 'padding:4px 12px;border:1px solid var(--border-light);border-radius:var(--radius-full);font-size:0.75rem;cursor:pointer;background:var(--off-white);color:var(--text);transition:all 0.2s;';
      btn.textContent = reply;
      btn.addEventListener('click', function () {
        sendMessage(reply);
      });
      btn.addEventListener('mouseenter', function () {
        this.style.borderColor = 'var(--electric)';
        this.style.color = 'var(--electric)';
      });
      btn.addEventListener('mouseleave', function () {
        this.style.borderColor = 'var(--border-light)';
        this.style.color = 'var(--text)';
      });
      container.appendChild(btn);
    });
  }

  function sendMessage(text) {
    if (!text || !text.trim()) return;

    var inputEl = document.getElementById('chatbot-input');
    if (inputEl) inputEl.value = '';

    messages.push({ type: 'user', text: text.trim() });
    renderMessages();
    renderQuickReplies();

    // Simulate bot response
    setTimeout(function () {
      var response = getBotResponse(text.trim().toLowerCase());
      messages.push({ type: 'bot', text: response });
      renderMessages();
    }, 800);
  }

  function getBotResponse(input) {
    if (input.includes('quote') || input.includes('price') || input.includes('cost')) {
      return 'Great! For a custom quote, you can fill out our booking form on this page, or contact us directly at info@deploypros.com. Our team typically responds within 2 hours.';
    }
    if (input.includes('dprompt') || input.includes('ai') || input.includes('product')) {
      return 'DPROMPT is our AI operations orchestration engine. It automates technician confirmation, detects no-show risks, and provides real-time operational data. Check out our DPROMPT page for a full overview!';
    }
    if (input.includes('service') || input.includes('area') || input.includes('cover') || input.includes('state')) {
      return 'We provide IT field services across all 50 states! Our services include multi-site deployments, IMAC, break/fix, POS installation, structured cabling, and Wi-Fi surveys.';
    }
    if (input.includes('talk') || input.includes('human') || input.includes('someone') || input.includes('call')) {
      return 'You can reach our team at (214) 555-0100 during business hours (Mon-Fri 7AM-7PM CST), or email info@deploypros.com. For emergencies, we offer 24/7 support.';
    }
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return 'Hello! Thanks for reaching out. Are you looking for a quote, want to learn about our services, or need to speak with someone on our team?';
    }
    return 'Thanks for your message! For the fastest response, you can reach us at info@deploypros.com or (214) 555-0100. Our team will get back to you shortly.';
  }

  function togglePanel() {
    isOpen = !isOpen;

    // Remove bubble if showing
    if (bubbleEl && bubbleEl.parentNode) {
      bubbleEl.parentNode.removeChild(bubbleEl);
    }

    if (isOpen) {
      if (!panelEl) createPanel();
      panelEl.classList.add('open');
      chatBtn.innerHTML = '<i data-lucide="x" style="width:24px;height:24px;"></i>';
    } else {
      if (panelEl) panelEl.classList.remove('open');
      chatBtn.innerHTML = '<i data-lucide="message-circle" style="width:24px;height:24px;"></i>';
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  chatBtn.addEventListener('click', togglePanel);
})();
