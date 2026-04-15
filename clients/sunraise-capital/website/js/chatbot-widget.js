/* ============================================
   Chatbot Widget
   Floating bottom-right chat interface
   ============================================ */

function toggleChatbot() {
  const panel = document.getElementById('chatbot-panel');
  if (!panel) return;
  panel.classList.toggle('open');

  const toggle = document.getElementById('chatbot-toggle');
  if (toggle) {
    if (panel.classList.contains('open')) {
      toggle.innerHTML = '<i data-lucide="x" class="w-6 h-6"></i>';
    } else {
      toggle.innerHTML = '<i data-lucide="message-circle" class="w-6 h-6"></i>';
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}

function sendChatMessage() {
  const input = document.getElementById('chatbot-input');
  const messages = document.getElementById('chatbot-messages');
  if (!input || !messages || !input.value.trim()) return;

  const userMsg = input.value.trim();
  input.value = '';

  // User bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'bg-sun-500 text-white rounded-xl p-3 shadow-sm text-sm max-w-[85%] ml-auto mt-3';
  userBubble.textContent = userMsg;
  messages.appendChild(userBubble);

  // Bot response
  setTimeout(() => {
    const botBubble = document.createElement('div');
    botBubble.className = 'bg-white rounded-xl p-3 shadow-sm text-sm text-navy-700 max-w-[85%] mt-3';
    botBubble.textContent = getBotResponse(userMsg);
    messages.appendChild(botBubble);
    messages.scrollTop = messages.scrollHeight;
  }, 800);

  messages.scrollTop = messages.scrollHeight;
}

function getBotResponse(msg) {
  const lower = msg.toLowerCase();

  if (lower.includes('capital') || lower.includes('investor') || lower.includes('invest') || lower.includes('fund')) {
    return 'Great! Our Capital Partners page has detailed information on deploying capital with embedded return discipline. You can also schedule a discussion with our team. Would you like me to direct you there?';
  }
  if (lower.includes('install') || lower.includes('dealer') || lower.includes('contractor')) {
    return 'Welcome! As an installer partner, you can access institutional-grade pricing, next-business-day underwriting, and diversified capital sources. Check out our Installer Partners page or schedule a call with our partnerships team.';
  }
  if (lower.includes('home') || lower.includes('solar') || lower.includes('save') || lower.includes('bill') || lower.includes('electric')) {
    return 'Wonderful! You can design your solar system in minutes with no sales calls or pressure. Visit our Homeowners page to learn about transparent pricing and see estimated savings for your home.';
  }
  if (lower.includes('contact') || lower.includes('email') || lower.includes('phone') || lower.includes('call')) {
    return 'You can reach us at support@sunraisecapital.com or visit our Contact page. Our team is available Monday through Friday, 8:00am to 5:00pm EST.';
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return 'Hello! Welcome to SunRaise Capital. Are you a capital partner, installer, or homeowner? I can point you in the right direction.';
  }

  return 'Thanks for reaching out! For detailed assistance, I recommend scheduling a discussion with our team through the booking form on our site, or you can email us at support@sunraisecapital.com. Is there anything specific I can help you find?';
}
