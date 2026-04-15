/* ============================================
   DEPLOYPROS — 5-Step Booking Wizard
   Service → Scope → Contact → Schedule → Confirm
   ============================================ */

(function () {
  'use strict';

  var wizard = document.getElementById('booking-wizard');
  if (!wizard) return;

  var currentStep = 1;
  var totalSteps = 5;
  var formData = {};

  // Service options
  var services = [
    { id: 'multi-site', label: 'Multi-Site Deployment', icon: 'globe' },
    { id: 'imac', label: 'IMAC Services', icon: 'repeat' },
    { id: 'break-fix', label: 'Break/Fix Support', icon: 'wrench' },
    { id: 'pos', label: 'POS Installation', icon: 'monitor' },
    { id: 'cabling', label: 'Structured Cabling', icon: 'cable' },
    { id: 'wifi', label: 'Wi-Fi Survey', icon: 'wifi' }
  ];

  // Generate time slots
  function generateTimeSlots() {
    var slots = [];
    var hours = [9, 10, 11, 13, 14, 15, 16];
    hours.forEach(function (h) {
      var ampm = h >= 12 ? 'PM' : 'AM';
      var display = h > 12 ? h - 12 : h;
      slots.push(display + ':00 ' + ampm);
      if (h < 16) slots.push(display + ':30 ' + ampm);
    });
    return slots;
  }

  // Generate calendar days for current week
  function generateWeekDays(startDate) {
    var days = [];
    var d = new Date(startDate);
    // Find next Monday
    while (d.getDay() !== 1) d.setDate(d.getDate() + 1);
    for (var i = 0; i < 5; i++) {
      var date = new Date(d);
      date.setDate(d.getDate() + i);
      // Pseudo-random availability
      var available = (date.getDate() % 3 !== 0);
      days.push({ date: date, available: available });
    }
    return days;
  }

  var weekOffset = 0;
  var selectedDate = null;
  var selectedTime = null;

  function getWeekStart() {
    var now = new Date();
    now.setDate(now.getDate() + 3 + (weekOffset * 7));
    return now;
  }

  // Render wizard
  function render() {
    var html = '';

    // Panels
    html += renderStep1();
    html += renderStep2();
    html += renderStep3();
    html += renderStep4();
    html += renderStep5();

    wizard.innerHTML = html;
    bindEvents();
    updateProgress();

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function renderStep1() {
    var active = currentStep === 1 ? ' active' : '';
    var html = '<div class="wizard-panel' + active + '" data-step="1">';
    html += '<h3 style="font-family:var(--font-heading);font-size:var(--text-h3);font-weight:600;color:var(--text-on-dark);margin-bottom:var(--space-3);">What do you need?</h3>';
    html += '<p style="color:var(--text-on-dark-muted);margin-bottom:var(--space-8);">Select the type of service you need</p>';
    html += '<div class="service-select-grid">';
    services.forEach(function (s) {
      var sel = formData.service === s.id ? ' selected' : '';
      html += '<div class="service-select-card' + sel + '" data-service="' + s.id + '">';
      html += '<div class="service-select-icon" style="margin-bottom:var(--space-3);color:var(--text-on-dark-muted);"><i data-lucide="' + s.icon + '" style="width:28px;height:28px;margin:0 auto;display:block;"></i></div>';
      html += '<div style="font-family:var(--font-heading);font-weight:600;color:var(--text-on-dark);">' + s.label + '</div>';
      html += '</div>';
    });
    html += '</div>';
    html += '<div class="wizard-actions"><div></div><button class="btn btn-primary" data-action="next"' + (!formData.service ? ' disabled style="opacity:0.5;pointer-events:none;"' : '') + '>Continue <i data-lucide="arrow-right" style="width:16px;height:16px;"></i></button></div>';
    html += '</div>';
    return html;
  }

  function renderStep2() {
    var active = currentStep === 2 ? ' active' : '';
    var html = '<div class="wizard-panel' + active + '" data-step="2">';
    html += '<h3 style="font-family:var(--font-heading);font-size:var(--text-h3);font-weight:600;color:var(--text-on-dark);margin-bottom:var(--space-3);">Project Scope</h3>';
    html += '<p style="color:var(--text-on-dark-muted);margin-bottom:var(--space-8);">Tell us more about your deployment</p>';

    html += '<div class="form-group"><label class="form-label" style="color:var(--text-on-dark);">Number of Sites</label>';
    html += '<select class="form-input form-input--dark" id="wiz-sites"><option value="">Select range</option><option value="1-5"' + (formData.sites === '1-5' ? ' selected' : '') + '>1-5 sites</option><option value="6-20"' + (formData.sites === '6-20' ? ' selected' : '') + '>6-20 sites</option><option value="21-100"' + (formData.sites === '21-100' ? ' selected' : '') + '>21-100 sites</option><option value="100+"' + (formData.sites === '100+' ? ' selected' : '') + '>100+ sites</option></select></div>';

    html += '<div class="form-group"><label class="form-label" style="color:var(--text-on-dark);">Timeline</label>';
    html += '<select class="form-input form-input--dark" id="wiz-timeline"><option value="">Select timeline</option><option value="asap"' + (formData.timeline === 'asap' ? ' selected' : '') + '>ASAP</option><option value="1-2w"' + (formData.timeline === '1-2w' ? ' selected' : '') + '>1-2 Weeks</option><option value="1m"' + (formData.timeline === '1m' ? ' selected' : '') + '>1 Month</option><option value="3m+"' + (formData.timeline === '3m+' ? ' selected' : '') + '>3+ Months</option></select></div>';

    html += '<div class="form-group"><label class="form-label" style="color:var(--text-on-dark);">Industry</label>';
    html += '<select class="form-input form-input--dark" id="wiz-industry"><option value="">Select industry</option><option value="retail"' + (formData.industry === 'retail' ? ' selected' : '') + '>Retail</option><option value="financial"' + (formData.industry === 'financial' ? ' selected' : '') + '>Financial Services</option><option value="telecom"' + (formData.industry === 'telecom' ? ' selected' : '') + '>Telecommunications</option><option value="healthcare"' + (formData.industry === 'healthcare' ? ' selected' : '') + '>Healthcare</option><option value="other"' + (formData.industry === 'other' ? ' selected' : '') + '>Other</option></select></div>';

    html += '<div class="form-group"><label class="form-label" style="color:var(--text-on-dark);">Additional Details</label>';
    html += '<textarea class="form-input form-input--dark" id="wiz-details" rows="3" placeholder="Brief project description...">' + (formData.details || '') + '</textarea></div>';

    html += '<div class="wizard-actions"><button class="btn btn-ghost" data-action="prev"><i data-lucide="arrow-left" style="width:16px;height:16px;"></i> Back</button><button class="btn btn-primary" data-action="next">Continue <i data-lucide="arrow-right" style="width:16px;height:16px;"></i></button></div>';
    html += '</div>';
    return html;
  }

  function renderStep3() {
    var active = currentStep === 3 ? ' active' : '';
    var html = '<div class="wizard-panel' + active + '" data-step="3">';
    html += '<h3 style="font-family:var(--font-heading);font-size:var(--text-h3);font-weight:600;color:var(--text-on-dark);margin-bottom:var(--space-3);">Contact Information</h3>';
    html += '<p style="color:var(--text-on-dark-muted);margin-bottom:var(--space-8);">How can we reach you?</p>';

    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4);">';
    html += '<div class="form-group"><label class="form-label" style="color:var(--text-on-dark);">First Name *</label><input type="text" class="form-input form-input--dark" id="wiz-fname" value="' + (formData.fname || '') + '" required></div>';
    html += '<div class="form-group"><label class="form-label" style="color:var(--text-on-dark);">Last Name *</label><input type="text" class="form-input form-input--dark" id="wiz-lname" value="' + (formData.lname || '') + '" required></div>';
    html += '</div>';

    html += '<div class="form-group"><label class="form-label" style="color:var(--text-on-dark);">Email *</label><input type="email" class="form-input form-input--dark" id="wiz-email" value="' + (formData.email || '') + '" required></div>';
    html += '<div class="form-group"><label class="form-label" style="color:var(--text-on-dark);">Phone</label><input type="tel" class="form-input form-input--dark" id="wiz-phone" value="' + (formData.phone || '') + '"></div>';
    html += '<div class="form-group"><label class="form-label" style="color:var(--text-on-dark);">Company</label><input type="text" class="form-input form-input--dark" id="wiz-company" value="' + (formData.company || '') + '"></div>';

    html += '<div class="wizard-actions"><button class="btn btn-ghost" data-action="prev"><i data-lucide="arrow-left" style="width:16px;height:16px;"></i> Back</button><button class="btn btn-primary" data-action="next">Continue <i data-lucide="arrow-right" style="width:16px;height:16px;"></i></button></div>';
    html += '</div>';
    return html;
  }

  function renderStep4() {
    var active = currentStep === 4 ? ' active' : '';
    var html = '<div class="wizard-panel' + active + '" data-step="4">';
    html += '<h3 style="font-family:var(--font-heading);font-size:var(--text-h3);font-weight:600;color:var(--text-on-dark);margin-bottom:var(--space-3);">Schedule a Call</h3>';
    html += '<p style="color:var(--text-on-dark-muted);margin-bottom:var(--space-8);">Pick a time that works for you</p>';

    // Calendar
    html += '<div class="calendar-picker">';
    var weekStart = getWeekStart();
    var days = generateWeekDays(weekStart);
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    html += '<div class="calendar-header">';
    html += '<button class="calendar-nav-btn" data-action="prev-week"><i data-lucide="chevron-left" style="width:16px;height:16px;"></i></button>';
    html += '<span style="font-family:var(--font-heading);font-weight:600;color:var(--text-on-dark);">' + monthNames[days[0].date.getMonth()] + ' ' + days[0].date.getFullYear() + '</span>';
    html += '<button class="calendar-nav-btn" data-action="next-week"><i data-lucide="chevron-right" style="width:16px;height:16px;"></i></button>';
    html += '</div>';

    html += '<div class="calendar-grid">';
    var dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    dayNames.forEach(function (d) {
      html += '<div class="calendar-day-header">' + d + '</div>';
    });
    days.forEach(function (d) {
      var dateStr = d.date.toISOString().split('T')[0];
      var cls = 'calendar-day';
      if (d.available) cls += ' available';
      if (selectedDate === dateStr) cls += ' selected';
      html += '<div class="' + cls + '" data-date="' + dateStr + '">' + d.date.getDate() + '</div>';
    });
    html += '</div>';

    // Time slots
    if (selectedDate) {
      html += '<div class="time-slots">';
      var slots = generateTimeSlots();
      slots.forEach(function (slot) {
        var cls = 'time-slot';
        if (selectedTime === slot) cls += ' selected';
        html += '<div class="' + cls + '" data-time="' + slot + '">' + slot + '</div>';
      });
      html += '</div>';
    }

    html += '</div>';

    var canProceed = selectedDate && selectedTime;
    html += '<div class="wizard-actions"><button class="btn btn-ghost" data-action="prev"><i data-lucide="arrow-left" style="width:16px;height:16px;"></i> Back</button><button class="btn btn-primary" data-action="next"' + (!canProceed ? ' disabled style="opacity:0.5;pointer-events:none;"' : '') + '>Book Call <i data-lucide="arrow-right" style="width:16px;height:16px;"></i></button></div>';
    html += '</div>';
    return html;
  }

  function renderStep5() {
    var active = currentStep === 5 ? ' active' : '';
    var serviceLabel = '';
    services.forEach(function (s) { if (s.id === formData.service) serviceLabel = s.label; });

    var html = '<div class="wizard-panel' + active + '" data-step="5">';
    html += '<div style="text-align:center;padding:var(--space-8) 0;">';
    html += '<div style="width:64px;height:64px;border-radius:50%;background:rgba(0,230,118,0.15);display:flex;align-items:center;justify-content:center;margin:0 auto var(--space-6);"><i data-lucide="check" style="width:32px;height:32px;color:var(--success);"></i></div>';
    html += '<h3 style="font-family:var(--font-heading);font-size:var(--text-h2);font-weight:700;color:var(--text-on-dark);margin-bottom:var(--space-4);">You\'re All Set!</h3>';
    html += '<p style="color:var(--text-on-dark-muted);margin-bottom:var(--space-8);max-width:400px;margin-left:auto;margin-right:auto;">We\'ll be in touch within 24 hours to confirm your consultation.</p>';

    html += '<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:var(--radius-lg);padding:var(--space-6);text-align:left;max-width:400px;margin:0 auto;">';
    html += '<div style="margin-bottom:var(--space-3);"><span style="color:var(--text-on-dark-muted);font-size:var(--text-sm);">Service:</span> <strong style="color:var(--text-on-dark);">' + serviceLabel + '</strong></div>';
    if (formData.fname) html += '<div style="margin-bottom:var(--space-3);"><span style="color:var(--text-on-dark-muted);font-size:var(--text-sm);">Name:</span> <strong style="color:var(--text-on-dark);">' + formData.fname + ' ' + (formData.lname || '') + '</strong></div>';
    if (formData.email) html += '<div style="margin-bottom:var(--space-3);"><span style="color:var(--text-on-dark-muted);font-size:var(--text-sm);">Email:</span> <strong style="color:var(--text-on-dark);">' + formData.email + '</strong></div>';
    if (selectedDate && selectedTime) html += '<div><span style="color:var(--text-on-dark-muted);font-size:var(--text-sm);">Call:</span> <strong style="color:var(--electric);">' + selectedDate + ' at ' + selectedTime + '</strong></div>';
    html += '</div>';
    html += '</div></div>';
    return html;
  }

  function updateProgress() {
    var indicators = document.querySelectorAll('.wizard-step-indicator');
    var fill = document.querySelector('.wizard-progress-fill');
    if (!indicators.length) return;

    indicators.forEach(function (ind, i) {
      var step = i + 1;
      ind.classList.remove('active', 'completed');
      if (step === currentStep) ind.classList.add('active');
      else if (step < currentStep) ind.classList.add('completed');
    });

    if (fill) {
      var pct = ((currentStep - 1) / (totalSteps - 1)) * 100;
      var maxWidth = fill.parentElement.offsetWidth - 80;
      fill.style.width = (pct / 100 * maxWidth) + 'px';
    }
  }

  function saveStepData() {
    if (currentStep === 2) {
      var sites = document.getElementById('wiz-sites');
      var timeline = document.getElementById('wiz-timeline');
      var industry = document.getElementById('wiz-industry');
      var details = document.getElementById('wiz-details');
      if (sites) formData.sites = sites.value;
      if (timeline) formData.timeline = timeline.value;
      if (industry) formData.industry = industry.value;
      if (details) formData.details = details.value;
    }
    if (currentStep === 3) {
      var fname = document.getElementById('wiz-fname');
      var lname = document.getElementById('wiz-lname');
      var email = document.getElementById('wiz-email');
      var phone = document.getElementById('wiz-phone');
      var company = document.getElementById('wiz-company');
      if (fname) formData.fname = fname.value;
      if (lname) formData.lname = lname.value;
      if (email) formData.email = email.value;
      if (phone) formData.phone = phone.value;
      if (company) formData.company = company.value;
    }
  }

  function validateStep() {
    if (currentStep === 1 && !formData.service) return false;
    if (currentStep === 3) {
      var fname = document.getElementById('wiz-fname');
      var email = document.getElementById('wiz-email');
      if (!fname || !fname.value.trim()) return false;
      if (!email || !email.value.trim() || !email.value.includes('@')) return false;
    }
    if (currentStep === 4 && (!selectedDate || !selectedTime)) return false;
    return true;
  }

  function bindEvents() {
    // Service selection
    wizard.querySelectorAll('.service-select-card').forEach(function (card) {
      card.addEventListener('click', function () {
        formData.service = this.getAttribute('data-service');
        render();
      });
    });

    // Navigation
    wizard.querySelectorAll('[data-action="next"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        saveStepData();
        if (!validateStep()) return;
        if (currentStep < totalSteps) {
          currentStep++;
          render();
        }
      });
    });
    wizard.querySelectorAll('[data-action="prev"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        saveStepData();
        if (currentStep > 1) {
          currentStep--;
          render();
        }
      });
    });

    // Calendar
    wizard.querySelectorAll('.calendar-day.available').forEach(function (day) {
      day.addEventListener('click', function () {
        selectedDate = this.getAttribute('data-date');
        selectedTime = null;
        render();
      });
    });

    // Week navigation
    wizard.querySelectorAll('[data-action="prev-week"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (weekOffset > 0) { weekOffset--; render(); }
      });
    });
    wizard.querySelectorAll('[data-action="next-week"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (weekOffset < 4) { weekOffset++; render(); }
      });
    });

    // Time slots
    wizard.querySelectorAll('.time-slot').forEach(function (slot) {
      slot.addEventListener('click', function () {
        selectedTime = this.getAttribute('data-time');
        render();
      });
    });
  }

  render();
})();
