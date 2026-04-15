/* ============================================
   SmartGrid Integrations — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Mobile Menu Toggle ---- */
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      menuIcon.classList.toggle('hidden');
      closeIcon.classList.toggle('hidden');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
      });
    });
  }

  /* ---- Scroll Reveal ---- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---- Hero Entrance Animation ---- */
  document.querySelectorAll('.hero-animate').forEach(el => {
    setTimeout(() => el.classList.add('active'), 100);
  });

  /* ---- Navbar Scroll Effect ---- */
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        header.classList.add('shadow-lg');
        header.style.background = 'rgba(13,27,62,0.98)';
      } else {
        header.classList.remove('shadow-lg');
        header.style.background = 'rgba(13,27,62,1)';
      }
    });
  }

  /* ---- Counter Animation ---- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          const prefix = el.dataset.prefix || '';
          const duration = 2000;
          const start = performance.now();
          function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = prefix + Math.floor(eased * target).toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => countObserver.observe(c));
  }

  /* ---- Chatbot Keyword Responses ---- */
  function getChatResponse(message) {
    const msg = message.toLowerCase();
    if (msg.includes('price') || msg.includes('cost') || msg.includes('quote')) {
      return 'For pricing information, I recommend scheduling a free consultation. Our solutions are customized to your specific needs. Call us at (855) 746-4744 or use our booking form above.';
    }
    if (msg.includes('service') || msg.includes('cabling') || msg.includes('network') || msg.includes('wifi')) {
      return 'We offer 18+ IT integration services including structured cabling, Wi-Fi design, managed services, and cloud solutions. Visit our Services page for full details!';
    }
    if (msg.includes('deploy') || msg.includes('global') || msg.includes('location') || msg.includes('country')) {
      return 'SmartGrid deploys across 120+ countries with 5,000+ service professionals. Our NOC operates 24/7/365. Check our Deployments page for more info.';
    }
    if (msg.includes('contact') || msg.includes('call') || msg.includes('phone') || msg.includes('email')) {
      return 'You can reach us at (855) 746-4744 (toll-free) or (404) 934-6940 (local). Visit our Contact page to send us a message directly.';
    }
    if (msg.includes('about') || msg.includes('who') || msg.includes('company') || msg.includes('history')) {
      return 'SmartGrid Integrations has been a trusted IT integrator since 1990. We started as an integrator for IBM, AT&T, and Lucent. Visit our About page to learn more about our story.';
    }
    return 'Thanks for your message! For immediate assistance, call us at (855) 746-4744 or schedule a free consultation using the booking form on our homepage.';
  }

  /* ---- Chatbot Widget ---- */
  const chatToggle = document.getElementById('chat-toggle');
  const chatWindow = document.getElementById('chat-window');
  const chatClose = document.getElementById('chat-close');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');

  if (chatToggle && chatWindow) {
    chatToggle.addEventListener('click', () => {
      chatWindow.classList.toggle('hidden');
      chatWindow.classList.toggle('flex');
      if (!chatWindow.classList.contains('hidden') && chatInput) chatInput.focus();
    });
    if (chatClose) {
      chatClose.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
        chatWindow.classList.remove('flex');
      });
    }
    if (chatForm && chatMessages) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = chatInput.value.trim();
        if (!msg) return;
        const userBubble = document.createElement('div');
        userBubble.className = 'flex justify-end mb-3';
        const userMsg = document.createElement('div');
        userMsg.className = 'bg-red-700 text-white px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%] text-sm';
        userMsg.textContent = msg;  // Safe - uses textContent, not innerHTML
        userBubble.appendChild(userMsg);
        chatMessages.appendChild(userBubble);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
        setTimeout(() => {
          const botBubble = document.createElement('div');
          botBubble.className = 'flex justify-start mb-3';
          const botMsg = document.createElement('div');
          botMsg.className = 'bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl rounded-bl-sm max-w-[80%] text-sm';
          botMsg.textContent = getChatResponse(msg);  // Safe - uses textContent, not innerHTML
          botBubble.appendChild(botMsg);
          chatMessages.appendChild(botBubble);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 800);
      });
    }
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---- FAQ Accordion ---- */
  document.querySelectorAll('.faq-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const chevron = btn.querySelector('.faq-chevron');
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all others
      document.querySelectorAll('.faq-trigger').forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          const otherContent = other.nextElementSibling;
          const otherChevron = other.querySelector('.faq-chevron');
          if (otherContent) otherContent.style.maxHeight = '0';
          if (otherChevron) otherChevron.style.transform = 'rotate(0deg)';
        }
      });

      // Toggle current
      if (isOpen) {
        btn.setAttribute('aria-expanded', 'false');
        if (content) content.style.maxHeight = '0';
        if (chevron) chevron.style.transform = 'rotate(0deg)';
      } else {
        btn.setAttribute('aria-expanded', 'true');
        if (content) content.style.maxHeight = content.scrollHeight + 'px';
        if (chevron) chevron.style.transform = 'rotate(180deg)';
      }
    });
  });
});
