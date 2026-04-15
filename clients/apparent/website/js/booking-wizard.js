/* ============================================
   Apparent — 3-Step Booking Wizard
   Audience routing, floating labels,
   webhook-ready form submission
   ============================================ */

const BOOKING_WEBHOOK = 'https://your-n8n.railway.app/webhook/apparent-booking';

let currentStep = 1;
let selectedAudience = '';

document.addEventListener('DOMContentLoaded', () => {
  // Audience card selection -> auto-advance
  document.querySelectorAll('.audience-card').forEach(card => {
    card.addEventListener('click', () => {
      selectedAudience = card.dataset.audience;

      // Highlight selected
      document.querySelectorAll('.audience-card').forEach(c => {
        c.classList.remove('border-energy-500/60', 'bg-energy-500/10');
        c.classList.add('border-white/[0.06]', 'bg-white/[0.02]');
      });
      card.classList.remove('border-white/[0.06]', 'bg-white/[0.02]');
      card.classList.add('border-energy-500/60', 'bg-energy-500/10');

      // Auto-advance after brief delay
      setTimeout(() => wizardNext(), 400);
    });
  });
});

function wizardNext() {
  if (currentStep >= 3) return;

  // Validate step 2 before advancing
  if (currentStep === 2) {
    const email = document.getElementById('wiz-email');
    const fname = document.getElementById('wiz-fname');
    if (fname && !fname.value.trim()) { fname.focus(); return; }
    if (email && !email.value.trim()) { email.focus(); return; }
    // Validate email format
    if (email && !email.checkValidity()) { email.focus(); email.reportValidity(); return; }

    // Submit form
    submitBooking();
  }

  currentStep++;
  showStep(currentStep);
}

function wizardPrev() {
  if (currentStep <= 1) return;
  currentStep--;
  showStep(currentStep);
}

function showStep(step) {
  document.querySelectorAll('.wizard-step').forEach(s => {
    s.classList.remove('active');
  });
  const target = document.querySelector(`.wizard-step[data-step="${step}"]`);
  if (target) {
    target.classList.add('active');
    // Move focus to the new step content
    const focusTarget = target.querySelector('h3, button, input, [tabindex]');
    if (focusTarget) setTimeout(() => focusTarget.focus(), 100);
  }

  // Update step indicators
  document.querySelectorAll('.step-dot').forEach(dot => {
    const s = parseInt(dot.dataset.step);
    dot.classList.remove('active', 'completed', 'pending');
    dot.removeAttribute('aria-current');
    if (s < step) dot.classList.add('completed');
    else if (s === step) { dot.classList.add('active'); dot.setAttribute('aria-current', 'step'); }
    else dot.classList.add('pending');
  });

  document.querySelectorAll('.step-connector').forEach((conn, i) => {
    conn.classList.toggle('active', i + 1 < step);
  });
}

function submitBooking() {
  const data = {
    audience: selectedAudience,
    firstName: document.getElementById('wiz-fname')?.value?.trim() || '',
    lastName: document.getElementById('wiz-lname')?.value?.trim() || '',
    email: document.getElementById('wiz-email')?.value?.trim() || '',
    phone: document.getElementById('wiz-phone')?.value?.trim() || '',
    message: document.getElementById('wiz-message')?.value?.trim() || '',
    source: 'apparent-website',
    page: window.location.pathname,
    timestamp: new Date().toISOString()
  };

  // Fire and forget
  fetch(BOOKING_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(() => {
    // Webhook not configured yet - that's fine
  });
}

// ─── CALENDAR ───
let calYear, calMonth, calSelectedDate = null, calSelectedTime = null;

function initCalendar() {
  const now = new Date();
  calYear = now.getFullYear();
  calMonth = now.getMonth();
  renderCalendar();
}

function calNav(dir) {
  calMonth += dir;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCalendar();
}

function renderCalendar() {
  const grid = document.getElementById('cal-grid');
  const label = document.getElementById('cal-month-label');
  if (!grid || !label) return;

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  label.textContent = months[calMonth] + ' ' + calYear;

  const firstDay = new Date(calYear, calMonth, 1);
  const lastDay = new Date(calYear, calMonth + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7; // Mon=0
  const today = new Date();
  today.setHours(0,0,0,0);

  grid.innerHTML = '';

  // Empty cells before first day
  for (let i = 0; i < startDow; i++) {
    grid.innerHTML += '<span></span>';
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(calYear, calMonth, d);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isPast = date < today;
    const isToday = date.getTime() === today.getTime();
    const isSelected = calSelectedDate && date.getTime() === calSelectedDate.getTime();

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = d;
    btn.className = 'w-8 h-8 mx-auto rounded-lg text-xs font-medium transition-all flex items-center justify-center ';

    if (isPast || isWeekend) {
      btn.className += 'text-white/20 cursor-not-allowed';
      btn.disabled = true;
    } else if (isSelected) {
      btn.className += 'bg-energy-500 text-white font-bold';
    } else if (isToday) {
      btn.className += 'text-energy-400 border border-energy-500/40 hover:bg-energy-500/15 cursor-pointer';
    } else {
      btn.className += 'text-white/70 hover:bg-white/5 hover:text-white cursor-pointer';
    }

    if (!isPast && !isWeekend) {
      btn.onclick = () => {
        calSelectedDate = date;
        calSelectedTime = null;
        renderCalendar();
        showTimeSlots(date);
      };
    }

    grid.appendChild(btn);
  }
}

function showTimeSlots(date) {
  const timesDiv = document.getElementById('cal-times');
  const dateLabel = document.getElementById('cal-selected-date');
  if (!timesDiv || !dateLabel) return;

  const opts = { weekday: 'long', month: 'short', day: 'numeric' };
  dateLabel.textContent = date.toLocaleDateString('en-US', opts);
  timesDiv.classList.remove('hidden');

  // Reset time selection
  document.querySelectorAll('.cal-time-btn').forEach(b => {
    b.classList.remove('border-energy-500/50', 'bg-energy-500/10', 'text-white');
    b.classList.add('border-white/10', 'text-white/70');
  });

  const confirmBtn = document.getElementById('cal-confirm-btn');
  if (confirmBtn) confirmBtn.disabled = true;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function selectTime(btn) {
  document.querySelectorAll('.cal-time-btn').forEach(b => {
    b.classList.remove('border-energy-500/50', 'bg-energy-500/10', 'text-white');
    b.classList.add('border-white/10', 'text-white/70');
  });
  btn.classList.remove('border-white/10', 'text-white/70');
  btn.classList.add('border-energy-500/50', 'bg-energy-500/10', 'text-white');
  calSelectedTime = btn.textContent;

  const confirmBtn = document.getElementById('cal-confirm-btn');
  if (confirmBtn) confirmBtn.disabled = false;
}

function confirmBooking() {
  if (!calSelectedDate || !calSelectedTime) return;

  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateStr = calSelectedDate.toLocaleDateString('en-US', opts);

  // Send booking data
  fetch(BOOKING_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'call-booking',
      audience: selectedAudience,
      firstName: document.getElementById('wiz-fname')?.value || '',
      email: document.getElementById('wiz-email')?.value || '',
      date: dateStr,
      time: calSelectedTime,
      timestamp: new Date().toISOString()
    })
  }).catch(() => {});

  // Show confirmation
  const step3 = document.querySelector('.wizard-step[data-step="3"]');
  if (step3) {
    step3.innerHTML = '<div class="text-center py-8"><div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center"><i data-lucide="calendar-check" class="w-8 h-8 text-green-400"></i></div><h3 class="text-white font-heading font-semibold text-xl mb-2">Call Booked!</h3><p class="text-white/70 text-sm">' + dateStr + ' at ' + calSelectedTime + '</p><p class="text-white/55 text-xs mt-2">You\'ll receive a confirmation email shortly.</p></div>';
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}

// Init calendar when step 3 shows
const origShowStep = showStep;
showStep = function(step) {
  origShowStep(step);
  if (step === 3) setTimeout(initCalendar, 100);
};

// Expose to inline onclick
window.wizardNext = wizardNext;
window.wizardPrev = wizardPrev;
window.selectTime = selectTime;
window.calNav = calNav;
window.confirmBooking = confirmBooking;
