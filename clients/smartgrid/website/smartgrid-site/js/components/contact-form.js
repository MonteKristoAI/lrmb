/* ============================================================
   SmartGrid Integrations — contact-form.js
   Contact / inquiry form handler
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Config ---------- */
  var CONTACT_WEBHOOK_URL = 'https://primary-production-5fdce.up.railway.app/webhook/smartgrid-contact';

  /* ----------------------------------------------------------
     initContactForm(formId)
     Attach validation + submit handler to any form by ID
     ---------------------------------------------------------- */
  function initContactForm(formId) {
    var form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Gather required fields
      var required = form.querySelectorAll('[required]');
      var valid = true;

      required.forEach(function (field) {
        clearFieldError(field);

        if (!field.value.trim()) {
          showFieldError(field, 'This field is required');
          valid = false;
          return;
        }

        // Email format check
        if (field.type === 'email') {
          var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value.trim())) {
            showFieldError(field, 'Please enter a valid email address');
            valid = false;
          }
        }
      });

      if (!valid) return;

      // Build payload from all named inputs
      var payload = {};
      var inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(function (input) {
        if (input.name) {
          payload[input.name] = input.value.trim();
        }
      });
      payload.page = window.location.href;
      payload.timestamp = new Date().toISOString();

      // UI: loading state
      var submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
      var originalText = '';
      if (submitBtn) {
        originalText = submitBtn.textContent || submitBtn.value;
        if (submitBtn.tagName === 'BUTTON') {
          submitBtn.textContent = 'Sending...';
        } else {
          submitBtn.value = 'Sending...';
        }
        submitBtn.disabled = true;
      }

      fetch(CONTACT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Network response was not ok');
          showFormState(form, 'success', 'Message sent! We\'ll get back to you within 24 hours.');
          form.reset();
        })
        .catch(function () {
          showFormState(form, 'error', 'Something went wrong. Please try again or call +1 (855) 746-4744.');
        })
        .finally(function () {
          if (submitBtn) {
            if (submitBtn.tagName === 'BUTTON') {
              submitBtn.textContent = originalText;
            } else {
              submitBtn.value = originalText;
            }
            submitBtn.disabled = false;
          }
        });
    });

    // Clear errors on input
    form.querySelectorAll('input, textarea, select').forEach(function (field) {
      field.addEventListener('input', function () {
        clearFieldError(field);
        hideFormState(form);
      });
    });
  }

  /* ---------- Field-level validation UI ---------- */
  function showFieldError(field, message) {
    field.classList.add('field-error');
    field.style.borderColor = '#c62828';

    // Avoid duplicate error messages
    var existing = field.parentNode.querySelector('.cf-error-msg');
    if (existing) existing.remove();

    var msg = document.createElement('span');
    msg.className = 'cf-error-msg';
    msg.textContent = message;
    msg.style.cssText = 'color:#c62828;font-size:12px;margin-top:4px;display:block';
    field.parentNode.appendChild(msg);
  }

  function clearFieldError(field) {
    field.classList.remove('field-error');
    field.style.borderColor = '';
    var msg = field.parentNode.querySelector('.cf-error-msg');
    if (msg) msg.remove();
  }

  /* ---------- Form-level success/error state ---------- */
  function showFormState(form, type, message) {
    hideFormState(form);

    var banner = document.createElement('div');
    banner.className = 'cf-form-state';
    banner.style.cssText =
      'padding:12px 16px;border-radius:8px;margin-top:12px;font-size:14px;line-height:1.5;' +
      (type === 'success'
        ? 'background:#e8f5e9;color:#2e7d32;border:1px solid #a5d6a7'
        : 'background:#ffebee;color:#c62828;border:1px solid #ef9a9a');
    banner.textContent = message;
    form.appendChild(banner);

    // Auto-hide success after 6 seconds
    if (type === 'success') {
      setTimeout(function () { hideFormState(form); }, 6000);
    }
  }

  function hideFormState(form) {
    var el = form.querySelector('.cf-form-state');
    if (el) el.remove();
  }

  /* ---------- Expose globally ---------- */
  window.initContactForm = initContactForm;

  /* ---------- Auto-init default form ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('contact-form')) {
      initContactForm('contact-form');
    }
  });
})();
