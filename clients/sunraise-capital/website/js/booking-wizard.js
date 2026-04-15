/* ============================================
   Multi-Step Booking Wizard
   Steps: Audience → Details → Contact → Calendar → Confirm
   ============================================ */

const BOOKING_WEBHOOK_URL = 'https://hooks.example.com/booking';

let selectedAudience = '';
let selectedSlot = null;
let calendarWeekOffset = 0;

/* --- Step 1: Audience selection --- */
function selectAudience(type, e) {
  selectedAudience = type;
  document.querySelectorAll('.audience-btn').forEach(btn => {
    btn.classList.remove('border-sun-500', 'bg-sun-50');
    btn.classList.add('border-navy-100');
  });
  if (e && e.currentTarget) {
    e.currentTarget.classList.add('border-sun-500', 'bg-sun-50');
    e.currentTarget.classList.remove('border-navy-100');
  }
  setTimeout(() => wizardGoTo(2), 400);
}

/* --- Step navigation --- */
function wizardGoTo(step) {
  document.querySelectorAll('.wizard-step').forEach(el => el.classList.remove('active'));
  const target = document.querySelector(`[data-step="${step}"]`);
  if (target) target.classList.add('active');

  document.querySelectorAll('[data-step-indicator]').forEach(dot => {
    const dotStep = parseInt(dot.dataset.stepIndicator);
    dot.classList.remove('active', 'completed', 'pending');
    if (dotStep < step) dot.classList.add('completed');
    else if (dotStep === step) dot.classList.add('active');
    else dot.classList.add('pending');
  });
  document.querySelectorAll('.step-connector').forEach((conn, i) => {
    conn.classList.toggle('active', i < step - 1);
  });

  if (step === 2) populateStep2();
  if (step === 4) { calendarWeekOffset = 0; renderCalendar(); }
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* --- Step 2: Audience-specific fields --- */
function populateStep2() {
  const container = document.getElementById('step2-fields');
  const title = document.getElementById('step2-title');
  if (!container) return;
  const cls = 'w-full px-4 py-3 rounded-xl border border-navy-200 focus:border-sun-500 focus:ring-2 focus:ring-sun-500/20 outline-none transition-all text-sm';

  const fields = {
    capital: {
      title: 'Tell us about your fund',
      html: `<input type="text" placeholder="Fund / Organization Name" class="${cls}" id="book-org">
        <select class="${cls} text-navy-600" id="book-fund-size"><option value="">Estimated Fund Size</option><option value="<25M">Under $25M</option><option value="25-100M">$25M - $100M</option><option value="100-500M">$100M - $500M</option><option value=">500M">Over $500M</option></select>
        <select class="${cls} text-navy-600" id="book-timeline"><option value="">Investment Timeline</option><option value="immediate">Ready to deploy</option><option value="1-3mo">1-3 months</option><option value="3-6mo">3-6 months</option><option value="exploring">Still exploring</option></select>`
    },
    installer: {
      title: 'Tell us about your business',
      html: `<input type="text" placeholder="Company Name" class="${cls}" id="book-company">
        <select class="${cls} text-navy-600" id="book-monthly"><option value="">Monthly Installations</option><option value="1-10">1-10 per month</option><option value="10-50">10-50 per month</option><option value="50-100">50-100 per month</option><option value="100+">100+ per month</option></select>
        <input type="text" placeholder="Markets Served (e.g., FL, TX, CA)" class="${cls}" id="book-markets">`
    },
    homeowner: {
      title: 'Tell us about your home',
      html: `<input type="text" placeholder="Home Address" class="${cls}" id="book-address">
        <select class="${cls} text-navy-600" id="book-bill"><option value="">Average Monthly Electric Bill</option><option value="<100">Under $100</option><option value="100-200">$100 - $200</option><option value="200-300">$200 - $300</option><option value=">300">Over $300</option></select>
        <select class="${cls} text-navy-600" id="book-ownership"><option value="">Home Ownership</option><option value="own">I own my home</option><option value="rent">I rent</option></select>`
    }
  };
  const config = fields[selectedAudience] || fields.homeowner;
  if (title) title.textContent = config.title;
  container.innerHTML = config.html;
}

/* --- Step 3: Validation --- */
function validateStep3() {
  const email = document.getElementById('book-email')?.value?.trim();
  const first = document.getElementById('book-first')?.value?.trim();
  if (!first) { alert('Please enter your first name.'); return false; }
  if (!email || !email.includes('@')) { alert('Please enter a valid email address.'); return false; }
  return true;
}

/* --- Step 4: Calendar --- */
const SLOT_TIMES = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getWeekDays(offset) {
  const now = new Date();
  // Start from next Monday
  const dayOfWeek = now.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek);
  const monday = new Date(now);
  monday.setDate(now.getDate() + daysUntilMonday + (offset * 7));

  const days = [];
  for (let i = 0; i < 5; i++) { // Mon-Fri
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

function renderCalendar() {
  const grid = document.getElementById('cal-grid');
  const label = document.getElementById('cal-week-label');
  if (!grid) return;

  const days = getWeekDays(calendarWeekOffset);
  const startMonth = MONTH_NAMES[days[0].getMonth()];
  const endMonth = MONTH_NAMES[days[4].getMonth()];
  const year = days[0].getFullYear();

  if (startMonth === endMonth) {
    label.textContent = `${startMonth} ${days[0].getDate()} - ${days[4].getDate()}, ${year}`;
  } else {
    label.textContent = `${startMonth} ${days[0].getDate()} - ${endMonth} ${days[4].getDate()}, ${year}`;
  }

  grid.innerHTML = '';

  days.forEach(day => {
    const col = document.createElement('div');
    col.className = 'flex flex-col gap-1';

    // Day header
    const header = document.createElement('div');
    header.className = 'text-center mb-2';
    header.innerHTML = `<div class="text-[10px] text-navy-500 font-medium uppercase">${DAY_NAMES[day.getDay()]}</div>
      <div class="text-sm font-heading font-bold text-navy-950">${day.getDate()}</div>`;
    col.appendChild(header);

    // Time slots - randomly remove some to look realistic
    const seed = day.getDate() * 7 + day.getMonth();
    SLOT_TIMES.forEach((time, i) => {
      // Pseudo-random availability based on date
      const available = ((seed + i * 3) % 5) !== 0;
      if (!available) return;

      const btn = document.createElement('button');
      const slotKey = `${day.toISOString().split('T')[0]}_${time}`;
      const isSelected = selectedSlot === slotKey;

      btn.className = isSelected
        ? 'w-full py-1.5 text-[11px] font-medium rounded-lg transition-all bg-sun-500 text-white'
        : 'w-full py-1.5 text-[11px] font-medium rounded-lg transition-all border border-navy-100 text-navy-700 hover:border-sun-400 hover:text-sun-600';
      btn.textContent = time;
      btn.onclick = () => selectSlot(slotKey, day, time);
      col.appendChild(btn);
    });

    grid.appendChild(col);
  });
}

function selectSlot(key, day, time) {
  selectedSlot = key;
  renderCalendar();

  const selectedDiv = document.getElementById('cal-selected');
  const selectedText = document.getElementById('cal-selected-text');
  const submitBtn = document.getElementById('booking-submit');

  if (selectedDiv) selectedDiv.classList.remove('hidden');
  if (selectedText) {
    const dayStr = `${DAY_NAMES[day.getDay()]}, ${MONTH_NAMES[day.getMonth()]} ${day.getDate()}, ${day.getFullYear()}`;
    selectedText.textContent = `${dayStr} at ${time} (EST)`;
  }
  if (submitBtn) submitBtn.disabled = false;
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function calendarPrevWeek() {
  if (calendarWeekOffset > 0) { calendarWeekOffset--; renderCalendar(); }
}
function calendarNextWeek() {
  if (calendarWeekOffset < 4) { calendarWeekOffset++; renderCalendar(); }
}

/* --- Step 5: Submit and confirm --- */
function submitBooking() {
  if (!validateStep3()) return;
  const btn = document.getElementById('booking-submit');
  if (btn) { btn.textContent = 'Booking...'; btn.disabled = true; }

  const payload = {
    audience: selectedAudience,
    firstName: document.getElementById('book-first')?.value || '',
    lastName: document.getElementById('book-last')?.value || '',
    email: document.getElementById('book-email')?.value || '',
    phone: document.getElementById('book-phone')?.value || '',
    scheduledSlot: selectedSlot || '',
    source: window.location.pathname,
    timestamp: new Date().toISOString()
  };

  if (selectedAudience === 'capital') {
    payload.organization = document.getElementById('book-org')?.value || '';
    payload.fundSize = document.getElementById('book-fund-size')?.value || '';
    payload.timeline = document.getElementById('book-timeline')?.value || '';
  } else if (selectedAudience === 'installer') {
    payload.company = document.getElementById('book-company')?.value || '';
    payload.monthlyInstalls = document.getElementById('book-monthly')?.value || '';
    payload.markets = document.getElementById('book-markets')?.value || '';
  } else if (selectedAudience === 'homeowner') {
    payload.address = document.getElementById('book-address')?.value || '';
    payload.electricBill = document.getElementById('book-bill')?.value || '';
    payload.ownership = document.getElementById('book-ownership')?.value || '';
  }

  fetch(BOOKING_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(res => {
    if (!res.ok) throw new Error('Submission failed');
    // Show selected time in confirmation
    const confirmTime = document.getElementById('confirm-time');
    const selectedText = document.getElementById('cal-selected-text');
    if (confirmTime && selectedText) confirmTime.textContent = selectedText.textContent;
    wizardGoTo(5);
  }).catch(() => {
    if (btn) { btn.textContent = 'Error - Try Again'; btn.disabled = false; }
    const wizard = document.getElementById('booking-wizard');
    if (wizard && !wizard.querySelector('.submit-error')) {
      const errorDiv = document.createElement('p');
      errorDiv.className = 'submit-error text-red-500 text-sm mt-3 text-center';
      errorDiv.textContent = 'Something went wrong. Please email support@sunraisecapital.com directly.';
      btn.parentElement.appendChild(errorDiv);
    }
  });
}
