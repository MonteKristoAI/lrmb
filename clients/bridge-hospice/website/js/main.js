/* ================================================================
   Bridge Hospice — Main JavaScript
   Components: Scroll Reveal, FAQ Accordion, Booking Wizard,
   Review Modal, Chatbot Widget, Header Scroll
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initFaqAccordion();
  initBookingWizard();
  initReviewModal();
  initChatbot();
  initHeaderScroll();
  initMobileNav();
});

/* ================================================================
   SCROLL REVEAL — IntersectionObserver
   ================================================================ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ================================================================
   FAQ ACCORDION — ARIA-compliant
   ================================================================ */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const answer = item.querySelector('.faq-answer');
    const inner = item.querySelector('.faq-answer-inner');
    if (!trigger || !answer || !inner) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all
      items.forEach(i => {
        i.classList.remove('active');
        const a = i.querySelector('.faq-answer');
        if (a) a.style.maxHeight = '0';
        const t = i.querySelector('.faq-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });

      // Open clicked (if was closed)
      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = inner.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ================================================================
   BOOKING WIZARD — Multi-step form
   ================================================================ */
function initBookingWizard() {
  const wizard = document.querySelector('.booking-wizard');
  if (!wizard) return;

  let currentStep = 0;
  const steps = wizard.querySelectorAll('.booking-step');
  const progressSteps = wizard.querySelectorAll('.booking-progress-step');
  const totalSteps = steps.length;

  function showStep(idx) {
    steps.forEach((s, i) => {
      s.classList.toggle('active', i === idx);
    });
    progressSteps.forEach((p, i) => {
      p.classList.remove('active', 'completed');
      if (i < idx) p.classList.add('completed');
      if (i === idx) p.classList.add('active');
    });
    currentStep = idx;
  }

  // Next/Back buttons
  wizard.querySelectorAll('[data-booking-next]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < totalSteps - 1) showStep(currentStep + 1);
    });
  });
  wizard.querySelectorAll('[data-booking-back]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) showStep(currentStep - 1);
    });
  });

  // Option selection
  wizard.querySelectorAll('.booking-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const group = opt.closest('.booking-options');
      group.querySelectorAll('.booking-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });

  showStep(0);
}

/* ================================================================
   REVIEW MODAL — Review Gating (MonteKristo Feature #1)
   ================================================================ */
function initReviewModal() {
  const triggers = document.querySelectorAll('[data-review-trigger]');
  const modal = document.getElementById('review-modal');
  if (!triggers.length || !modal) return;

  const stars = modal.querySelectorAll('.review-star');
  const highSection = modal.querySelector('.review-high');
  const lowSection = modal.querySelector('.review-low');
  const closeBtn = modal.querySelector('.review-close');
  let selectedRating = 0;

  triggers.forEach(t => {
    t.addEventListener('click', () => {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    selectedRating = 0;
    stars.forEach(s => s.classList.remove('active'));
    if (highSection) highSection.style.display = 'none';
    if (lowSection) lowSection.style.display = 'none';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  stars.forEach(star => {
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.dataset.rating);
      stars.forEach((s, i) => {
        s.classList.toggle('active', i < selectedRating);
      });
      if (selectedRating >= 4) {
        if (highSection) highSection.style.display = 'block';
        if (lowSection) lowSection.style.display = 'none';
      } else {
        if (highSection) highSection.style.display = 'none';
        if (lowSection) lowSection.style.display = 'block';
      }
    });
  });
}

/* ================================================================
   CHATBOT WIDGET (MonteKristo Feature #4)
   ================================================================ */
function initChatbot() {
  const btn = document.getElementById('chatbot-btn');
  const panel = document.getElementById('chatbot-panel');
  if (!btn || !panel) return;

  let open = false;
  btn.addEventListener('click', () => {
    open = !open;
    panel.classList.toggle('open', open);
    btn.classList.toggle('active', open);
  });
}

/* ================================================================
   HEADER SCROLL — transparent to solid
   ================================================================ */
function initHeaderScroll() {
  const header = document.querySelector('.nav');
  if (!header) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      header.classList.add('nav-scrolled');
    } else {
      header.classList.remove('nav-scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });
}

/* ================================================================
   MOBILE NAV — hamburger toggle
   ================================================================ */
function initMobileNav() {
  const toggle = document.querySelector('.nav-mobile-toggle');
  const menu = document.querySelector('.nav-mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    menu.classList.toggle('open', !isOpen);
    toggle.classList.toggle('active', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}
