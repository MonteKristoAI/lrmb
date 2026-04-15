/* ============================================================
   EV — Shared JavaScript Components
   All 11 MonteKristo features + utilities
   ============================================================ */

/* --- CONFIG (edit these per deployment) --- */
const CONFIG = {
  businessName: 'EV',
  phone: '+44 7525 916610',
  email: 'info@evcam.com',
  googleReviewsUrl: 'https://search.google.com/local/reviews?placeid=EV_PLACE_ID',
  webhookUrl: 'https://primary-production-5fdce.up.railway.app/webhook/ev-inquiry',
  bookingWebhookUrl: 'https://primary-production-5fdce.up.railway.app/webhook/ev-booking',
  reviewWebhookUrl: 'https://primary-production-5fdce.up.railway.app/webhook/ev-review',
  chatbotName: 'EV Assistant',
  chatbotWelcome: 'Welcome to EV. How can we help you with your wellbore or pipeline challenges?',
  feedbackCategories: ['Response Time', 'Technical Quality', 'Data Accuracy', 'Communication', 'Value', 'Other'],
  bookingServices: [
    { id: 'visual-analytics', label: 'Visual Analytics', icon: 'eye' },
    { id: 'pipeline-inspection', label: 'Pipeline Inspection', icon: 'scan-line' },
    { id: 'software-aiva', label: 'AIVA Platform', icon: 'monitor' },
    { id: 'technology-consult', label: 'Technology Consultation', icon: 'settings' },
    { id: 'other', label: 'Other Inquiry', icon: 'message-circle' }
  ],
  industries: ['Oil & Gas', 'Geothermal', 'Pipeline Infrastructure', 'CCUS / Carbon Capture', 'Mining', 'Water Management', 'Other']
};

/* ============================================================
   1. SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ============================================================
   2. STICKY HEADER
   ============================================================ */
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 80) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
    lastScroll = current;
  }, { passive: true });
}

/* ============================================================
   3. MOBILE MENU
   ============================================================ */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const close = document.getElementById('menu-close');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.add('mobile-menu-open');
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
  });

  function closeMenu() {
    menu.classList.remove('mobile-menu-open');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (close) close.addEventListener('click', closeMenu);
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  menu.addEventListener('click', (e) => { if (e.target === menu) closeMenu(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
}

/* ============================================================
   4. ROTATING TEXT (Hero)
   ============================================================ */
function initRotatingText() {
  const el = document.getElementById('rotating-text');
  if (!el) return;
  const words = JSON.parse(el.dataset.words || '[]');
  if (words.length === 0) return;
  let i = 0;
  setInterval(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-100%)';
    setTimeout(() => {
      i = (i + 1) % words.length;
      el.textContent = words[i];
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 350);
  }, 3000);
}

/* ============================================================
   5. STAT COUNTER
   ============================================================ */
function initStatCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length === 0) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 2000;
        const start = performance.now();
        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = prefix + Math.floor(target * eased).toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  counters.forEach(el => observer.observe(el));
}

/* ============================================================
   6. REVIEW GATING MODAL
   ============================================================ */
let currentRating = 0;
let selectedCategories = [];

function openReviewModal() {
  const modal = document.getElementById('review-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
  currentRating = 0;
  selectedCategories = [];
  renderStars();
  showReviewStep('rating');
}

function closeReviewModal() {
  const modal = document.getElementById('review-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
}

function renderStars() {
  const container = document.getElementById('star-container');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('button');
    star.innerHTML = '<svg width="36" height="36" viewBox="0 0 24 24" fill="' + (i <= currentRating ? '#F59E0B' : '#334155') + '"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
    star.className = 'transition-transform hover:scale-110';
    star.onclick = () => {
      currentRating = i;
      renderStars();
      document.getElementById('review-continue').disabled = false;
    };
    container.appendChild(star);
  }
}

function handleRatingSubmit() {
  if (currentRating >= 4) {
    window.open(CONFIG.googleReviewsUrl, '_blank');
    showReviewStep('thanks');
    setTimeout(closeReviewModal, 2500);
  } else {
    showReviewStep('feedback');
    renderCategoryPills();
  }
}

function renderCategoryPills() {
  const container = document.getElementById('category-pills');
  if (!container) return;
  container.innerHTML = '';
  CONFIG.feedbackCategories.forEach(cat => {
    const pill = document.createElement('button');
    pill.textContent = cat;
    pill.className = 'px-3 py-1.5 rounded-full text-sm border transition-all';
    pill.onclick = () => {
      if (selectedCategories.includes(cat)) {
        selectedCategories = selectedCategories.filter(c => c !== cat);
        pill.classList.remove('bg-orange-500', 'text-white', 'border-orange-500');
        pill.classList.add('border-gray-600', 'text-gray-300');
      } else {
        selectedCategories.push(cat);
        pill.classList.add('bg-orange-500', 'text-white', 'border-orange-500');
        pill.classList.remove('border-gray-600', 'text-gray-300');
      }
    };
    pill.classList.add('border-gray-600', 'text-gray-300');
    container.appendChild(pill);
  });
}

function submitFeedback() {
  const data = {
    type: 'review_feedback',
    business: CONFIG.businessName,
    rating: currentRating,
    categories: selectedCategories,
    improvement: document.getElementById('review-improvement')?.value || '',
    message: document.getElementById('review-message')?.value || '',
    timestamp: new Date().toISOString()
  };
  fetch(CONFIG.reviewWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(() => {});
  showReviewStep('thanks');
  setTimeout(closeReviewModal, 2500);
}

function showReviewStep(step) {
  ['rating', 'feedback', 'thanks'].forEach(s => {
    const el = document.getElementById('review-step-' + s);
    if (el) el.classList.toggle('hidden', s !== step);
  });
}

/* ============================================================
   7. BOOKING WIZARD
   ============================================================ */
let bookingStep = 1;
let bookingData = { service: '', company: '', industry: '', size: '', date: '', time: '', firstName: '', lastName: '', email: '', phone: '', message: '' };

function initBookingWizard() {
  renderBookingServices();
  renderIndustryOptions();
  initCalendar();
}

function renderBookingServices() {
  const container = document.getElementById('booking-services');
  if (!container) return;
  container.innerHTML = '';
  CONFIG.bookingServices.forEach(s => {
    const card = document.createElement('button');
    card.className = 'card-dark text-left p-4 flex items-center gap-4 w-full hover:border-orange-500/50';
    card.innerHTML = '<div class="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center"><i data-lucide="' + s.icon + '" class="w-5 h-5 text-orange-400"></i></div><span class="font-heading font-semibold text-white">' + s.label + '</span>';
    card.onclick = () => { bookingData.service = s.label; goToBookingStep(2); };
    container.appendChild(card);
  });
  if (window.lucide) lucide.createIcons();
}

function renderIndustryOptions() {
  const select = document.getElementById('booking-industry');
  if (!select) return;
  CONFIG.industries.forEach(ind => {
    const opt = document.createElement('option');
    opt.value = ind;
    opt.textContent = ind;
    select.appendChild(opt);
  });
}

function goToBookingStep(n) {
  document.querySelectorAll('[data-booking-step]').forEach(el => el.classList.add('hidden'));
  const target = document.querySelector('[data-booking-step="' + n + '"]');
  if (target) target.classList.remove('hidden');
  document.querySelectorAll('.step-indicator').forEach((dot, i) => {
    dot.classList.toggle('bg-orange-500', i < n);
    dot.classList.toggle('text-white', i < n);
    dot.classList.toggle('bg-white/10', i >= n);
  });
  bookingStep = n;
}

/* Calendar */
let calendarWeekOffset = 0;
let selectedSlot = null;

function initCalendar() {
  renderCalendar();
}

function renderCalendar() {
  const grid = document.getElementById('cal-grid');
  const label = document.getElementById('cal-week-label');
  if (!grid || !label) return;

  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1 + (calendarWeekOffset * 7));

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  label.textContent = monthNames[monday.getMonth()] + ' ' + monday.getDate() + ' - ' + monthNames[new Date(monday.getTime() + 4 * 86400000).getMonth()] + ' ' + new Date(monday.getTime() + 4 * 86400000).getDate();

  grid.innerHTML = '';
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'];

  for (let d = 0; d < 5; d++) {
    const dayDate = new Date(monday.getTime() + d * 86400000);
    const dayCol = document.createElement('div');
    dayCol.className = 'text-center';
    dayCol.innerHTML = '<div class="text-xs font-semibold text-gray-400 mb-2">' + days[d] + '<br><span class="text-white">' + dayDate.getDate() + '</span></div>';

    times.forEach(time => {
      const isPast = dayDate < today && calendarWeekOffset === 0;
      const seed = (dayDate.getDate() * 7 + d * 13 + parseInt(time) * 3) % 10;
      const available = !isPast && seed > 3;
      const slot = document.createElement('button');
      const slotId = dayDate.toISOString().split('T')[0] + '_' + time;
      slot.className = 'w-full text-xs py-1 mb-1 rounded transition-all ' +
        (available ? (selectedSlot === slotId ? 'bg-orange-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-orange-500/20 hover:text-white') : 'bg-transparent text-gray-700 cursor-not-allowed');
      slot.textContent = time;
      slot.disabled = !available;
      if (available) {
        slot.onclick = () => {
          selectedSlot = slotId;
          bookingData.date = dayDate.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' });
          bookingData.time = time;
          renderCalendar();
          const selectedEl = document.getElementById('cal-selected');
          const selectedText = document.getElementById('cal-selected-text');
          if (selectedEl && selectedText) {
            selectedEl.classList.remove('hidden');
            selectedText.textContent = bookingData.date + ' at ' + time;
          }
          const submitBtn = document.getElementById('booking-submit');
          if (submitBtn) submitBtn.disabled = false;
        };
      }
      dayCol.appendChild(slot);
    });
    grid.appendChild(dayCol);
  }
}

function calendarPrevWeek() { if (calendarWeekOffset > 0) { calendarWeekOffset--; renderCalendar(); } }
function calendarNextWeek() { if (calendarWeekOffset < 3) { calendarWeekOffset++; renderCalendar(); } }

function submitBooking() {
  const form = document.getElementById('booking-contact-form');
  if (form) {
    bookingData.firstName = form.querySelector('[name="firstName"]')?.value || '';
    bookingData.lastName = form.querySelector('[name="lastName"]')?.value || '';
    bookingData.email = form.querySelector('[name="email"]')?.value || '';
    bookingData.phone = form.querySelector('[name="phone"]')?.value || '';
    bookingData.message = form.querySelector('[name="message"]')?.value || '';
  }

  const data = { type: 'booking_request', business: CONFIG.businessName, ...bookingData, timestamp: new Date().toISOString() };
  fetch(CONFIG.bookingWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(() => {});
  goToBookingStep(5);
}

/* ============================================================
   8. INQUIRY FORM
   ============================================================ */
function submitInquiry(e) {
  e.preventDefault();
  const form = e.target;
  const data = {
    type: 'inquiry',
    business: CONFIG.businessName,
    name: form.querySelector('[name="name"]')?.value || '',
    email: form.querySelector('[name="email"]')?.value || '',
    phone: form.querySelector('[name="phone"]')?.value || '',
    company: form.querySelector('[name="company"]')?.value || '',
    message: form.querySelector('[name="message"]')?.value || '',
    timestamp: new Date().toISOString()
  };
  fetch(CONFIG.webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(() => {
    form.innerHTML = '<div class="text-center py-8"><div class="text-3xl mb-3">&#10003;</div><h3 class="text-xl font-bold text-white font-heading">Message Sent</h3><p class="text-gray-400 mt-2">We\'ll be in touch within 24 hours.</p></div>';
  }).catch(() => {
    form.innerHTML = '<div class="text-center py-8"><h3 class="text-xl font-bold text-white font-heading">Message Sent</h3><p class="text-gray-400 mt-2">We\'ll be in touch within 24 hours.</p></div>';
  });
}

/* ============================================================
   9. FAQ ACCORDION
   ============================================================ */
function initFaqAccordion() {
  document.querySelectorAll('.faq-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-trigger').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.style.maxHeight = '0';
      });
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/* ============================================================
   10. CHATBOT WIDGET
   ============================================================ */
function initChatbot() {
  const btn = document.getElementById('chatbot-toggle');
  const panel = document.getElementById('chatbot-panel');
  if (!btn || !panel) return;

  btn.addEventListener('click', () => {
    const isOpen = !panel.classList.contains('hidden');
    if (isOpen) {
      panel.classList.add('hidden');
    } else {
      panel.classList.remove('hidden');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.classList.contains('hidden')) {
      panel.classList.add('hidden');
    }
  });
}

/* ============================================================
   11. TESTIMONIAL CAROUSEL
   ============================================================ */
function initTestimonialCarousel() {
  const track = document.querySelector('.testimonial-track');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  if (!track) return;

  if (prevBtn) prevBtn.addEventListener('click', () => { track.scrollBy({ left: -400, behavior: 'smooth' }); });
  if (nextBtn) nextBtn.addEventListener('click', () => { track.scrollBy({ left: 400, behavior: 'smooth' }); });
}

/* ============================================================
   INIT — Run all on DOMContentLoaded
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initStickyHeader();
  initMobileMenu();
  initRotatingText();
  initStatCounters();
  initBookingWizard();
  initFaqAccordion();
  initChatbot();
  initTestimonialCarousel();

  // Initialize Lucide icons
  if (window.lucide) lucide.createIcons();
});
