/* ============================================
   CHATBOT WIDGET
   ============================================ */

(function() {
  const chatBtn = document.getElementById('chatbot-btn');
  const chatPanel = document.getElementById('chatbot-panel');
  const chatBubble = document.getElementById('chatbot-bubble');
  const chatClose = document.getElementById('chatbot-close');
  const chatInput = document.getElementById('chatbot-input');
  const chatSend = document.getElementById('chatbot-send');
  const chatMessages = document.getElementById('chatbot-messages');

  if (!chatBtn) return;

  let isOpen = false;

  function toggleChat() {
    isOpen = !isOpen;
    if (chatPanel) chatPanel.classList.toggle('active', isOpen);
    if (chatBubble) chatBubble.style.display = isOpen ? 'none' : '';
    if (isOpen && chatInput) chatInput.focus();
  }

  chatBtn.addEventListener('click', toggleChat);
  if (chatClose) chatClose.addEventListener('click', toggleChat);

  // Dismiss bubble on click
  if (chatBubble) chatBubble.addEventListener('click', toggleChat);

  // Auto-dismiss bubble after 8s
  setTimeout(() => {
    if (chatBubble && !isOpen) chatBubble.style.display = 'none';
  }, 10000);

  // Send message
  function sendMessage() {
    if (!chatInput || !chatMessages) return;
    const text = chatInput.value.trim();
    if (!text) return;

    // User message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg user';
    userMsg.style.cssText = 'background:var(--ocean);color:var(--white);margin-left:auto;';
    userMsg.textContent = text;
    chatMessages.appendChild(userMsg);
    chatInput.value = '';

    // Bot response (placeholder - would connect to real AI in production)
    setTimeout(() => {
      const botMsg = document.createElement('div');
      botMsg.className = 'chat-msg bot';
      botMsg.textContent = getBotResponse(text);
      chatMessages.appendChild(botMsg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 800);

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  if (chatSend) chatSend.addEventListener('click', sendMessage);
  if (chatInput) chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });

  function getBotResponse(text) {
    const lower = text.toLowerCase();

    // Wednesday's on the Water — check FIRST so it wins over generic "price" matches
    if (lower.includes('wednesday') || lower.includes("wednesday's") || lower.includes('$79') || lower.includes('group sail') || lower.includes('cheap') || lower.includes('budget')) {
      return "Wednesday's on the Water is our $79-per-person group sail. 2.5 hours, up to 10 guests share the boat with Captain John, every Wednesday. First-come, first-served. We confirm the sail Tuesday at 8:00 PM once at least 4 seats are reserved. If weather cancels we move you to the next Wednesday — no refunds, just postpone. Want to reserve a seat?";
    }

    if (lower.includes('price') || lower.includes('cost') || lower.includes('how much') || lower.includes('rate')) {
      return "Our private charters start at $350 for a 2.5-hour sunset or day sail (2 guests, +$60 each additional). Half-day is $750, full-day is $1,050. We also have a $79-per-person Wednesday group sail. Want full pricing or to book one?";
    }
    if (lower.includes('book') || lower.includes('reserv')) {
      return "You can book right here on the site using the form on the homepage, or call Captain John at 770-271-1888. For weekends we recommend booking a week or two ahead. If you're after the Wednesday $79 group sail, those go first-come first-served — grab one early.";
    }
    if (lower.includes('sunset')) {
      return "Sunset cruises are the most popular. The 2.5-hour sail departs about 2 hours before sundown so you catch the golden hour. $350 base for 2 guests, +$60 each additional. Want to book one?";
    }
    if (lower.includes('group') || lower.includes('team') || lower.includes('corporate')) {
      return "Two options. For corporate or larger groups (12+), Captain John has 20+ years of Fortune 500 team building experience — sailing regattas, cardboard boat races. Reach out and he'll put together a custom quote. For something smaller and casual, our $79 Wednesday group sail seats up to 10. Which fits?";
    }
    if (lower.includes('kid') || lower.includes('child') || lower.includes('family')) {
      return "Families are welcome. We have a Pirate Cruise that's a huge hit with kids — costumes and treasure hunts. Pack snacks and drinks, BYOB (alcohol welcome for adults). Standard charter pricing applies.";
    }
    if (lower.includes('bring') || lower.includes('byob') || lower.includes('food') || lower.includes('drink')) {
      return "Yes, we're BYOB. Bring your own cooler, snacks, drinks — alcohol welcome. Soft cooler works best. Captain John handles everything else.";
    }
    if (lower.includes('where') || lower.includes('location') || lower.includes('dock') || lower.includes('marina') || lower.includes('address')) {
      return "We sail from Safe Harbor Aqualand Marina, Dock Q. Address is 6800 Lights Ferry Rd, Flowery Branch, GA 30542. About 40 minutes north of Atlanta. Driving directions are on the Contact page.";
    }
    if (lower.includes('weather') || lower.includes('rain') || lower.includes('cancel') || lower.includes('refund')) {
      return "If weather forces a cancellation: for private charters, Captain John works with you to reschedule. For Wednesday's group sail, seats are confirmed Tuesday at 8:00 PM with a 4-seat minimum, and reservations roll automatically to the following Wednesday for weather or low-signup weeks — we don't process refunds, just postpone. Light rain rarely cancels — it can be beautiful on the water.";
    }
    if (lower.includes('captain') || lower.includes('license') || lower.includes('certif') || lower.includes('experience')) {
      return "Captain John Rice has been sailing Lake Lanier for over 20 years. He's the captain of the boat and runs every charter personally. If you have a specific safety question he can answer it directly at 770-271-1888.";
    }
    if (lower.includes('hour') || lower.includes('open') || lower.includes('when')) {
      return "We're available 9am to 9pm, sailing season runs roughly April through October. Sunsets are best May through September. Captain John is often on the water, so the booking form or 770-271-1888 are both faster than email.";
    }
    return "Great question — I might not have the perfect answer here. Captain John knows everything firsthand: 770-271-1888, or use the booking form on the homepage. He answers personally usually within 24 hours.";
  }

  // Close panel on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) toggleChat();
  });
})();
