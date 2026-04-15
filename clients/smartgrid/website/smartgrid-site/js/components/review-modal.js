/* ============================================================
   SmartGrid Integrations — review-modal.js
   Smart review gating (MonteKristo pattern)
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Config ---------- */
  var GOOGLE_REVIEWS_URL = 'https://www.google.com/search?q=SmartGrid+Integrations+reviews+Peachtree+City+GA';
  var WEBHOOK_URL        = 'https://primary-production-5fdce.up.railway.app/webhook/smartgrid-review';

  /* ---------- State ---------- */
  var selectedRating    = 0;
  var selectedCategory  = null;
  var overlay           = null;

  /* ---------- Build Modal ---------- */
  function buildModal() {
    if (document.getElementById('review-modal-overlay')) return;

    overlay = document.createElement('div');
    overlay.id = 'review-modal-overlay';
    overlay.className = 'review-overlay';
    overlay.style.display = 'none';
    overlay.innerHTML =
      '<div class="review-modal" role="dialog" aria-modal="true" aria-labelledby="review-title">' +
        '<button class="review-close" aria-label="Close">&times;</button>' +

        /* Step 1: Star Rating */
        '<div id="review-step-rating" class="review-step">' +
          '<div style="text-align:center;margin-bottom:1rem">' +
            '<div style="width:56px;height:56px;border-radius:50%;background:#0d1b3e;display:inline-flex;align-items:center;justify-content:center;margin-bottom:0.75rem">' +
              '<svg width="24" height="24" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' +
            '</div>' +
            '<h3 id="review-title" style="font-size:1.25rem;font-weight:700;color:#1a202c;margin:0">Rate Your Experience</h3>' +
            '<p style="color:#64748b;font-size:0.875rem;margin-top:0.5rem">How was your experience with SmartGrid?</p>' +
          '</div>' +
          '<div class="review-stars" id="review-stars"></div>' +
          '<button id="review-rating-btn" class="review-btn review-btn-primary" disabled>Select a Rating</button>' +
        '</div>' +

        /* Step 2: Feedback form (low rating) */
        '<div id="review-step-feedback" class="review-step" style="display:none">' +
          '<div style="text-align:center;margin-bottom:1rem">' +
            '<h3 style="font-size:1.25rem;font-weight:700;color:#1a202c;margin:0">Help Us Improve</h3>' +
            '<p style="color:#64748b;font-size:0.875rem;margin-top:0.5rem">Your feedback helps us deliver better service</p>' +
          '</div>' +
          '<label style="display:block;font-size:0.8125rem;font-weight:600;color:#1a202c;margin-bottom:0.5rem">What area needs improvement?</label>' +
          '<div class="review-pills" id="review-pills"></div>' +
          '<label style="display:block;font-size:0.8125rem;font-weight:600;color:#1a202c;margin-top:1rem;margin-bottom:0.375rem">How can we do better?</label>' +
          '<input type="text" id="review-improvement" class="review-input" placeholder="Tell us what went wrong..." />' +
          '<label style="display:block;font-size:0.8125rem;font-weight:600;color:#1a202c;margin-top:0.75rem;margin-bottom:0.375rem">Additional details <span style="color:#94a3b8;font-weight:400">(optional)</span></label>' +
          '<textarea id="review-message" class="review-input review-textarea" rows="3" placeholder="Any additional context..."></textarea>' +
          '<button id="review-submit" class="review-btn review-btn-primary" style="margin-top:1.25rem">Submit Feedback</button>' +
          '<p style="text-align:center;font-size:0.75rem;color:#94a3b8;margin-top:0.75rem">' +
            'Prefer a public review? <a href="' + GOOGLE_REVIEWS_URL + '" target="_blank" style="color:#0d1b3e;text-decoration:underline">Leave one on Google</a>' +
          '</p>' +
        '</div>' +

        /* Step 3: Thank you */
        '<div id="review-step-thanks" class="review-step" style="display:none">' +
          '<div style="text-align:center;padding:2rem 0">' +
            '<div style="width:64px;height:64px;border-radius:50%;background:rgba(22,163,74,0.1);display:inline-flex;align-items:center;justify-content:center;margin-bottom:1rem">' +
              '<svg width="32" height="32" fill="none" stroke="#16a34a" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>' +
            '</div>' +
            '<h3 style="font-size:1.25rem;font-weight:700;color:#1a202c;margin:0">Thank You!</h3>' +
            '<p id="review-thanks-msg" style="color:#64748b;font-size:0.875rem;margin-top:0.5rem">Your feedback means a lot to us.</p>' +
          '</div>' +
        '</div>' +

      '</div>';

    document.body.appendChild(overlay);

    // Build stars
    var starsContainer = document.getElementById('review-stars');
    for (var i = 1; i <= 5; i++) {
      var star = document.createElement('span');
      star.className = 'review-star';
      star.setAttribute('data-value', i);
      star.innerHTML = '&#9733;';
      star.addEventListener('click', handleStarClick);
      star.addEventListener('mouseenter', handleStarHover);
      starsContainer.appendChild(star);
    }
    starsContainer.addEventListener('mouseleave', function () {
      highlightStars(selectedRating);
    });

    // Build category pills
    var categories = ['Communication', 'Project Quality', 'Timeliness', 'Technical Expertise', 'Value', 'Support', 'Other'];
    var pillsContainer = document.getElementById('review-pills');
    categories.forEach(function (cat) {
      var pill = document.createElement('button');
      pill.className = 'review-pill';
      pill.textContent = cat;
      pill.addEventListener('click', function () {
        pill.classList.toggle('selected');
        selectedCategory = cat;
      });
      pillsContainer.appendChild(pill);
    });

    // Close handlers
    overlay.querySelector('.review-close').addEventListener('click', closeReviewModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeReviewModal();
    });

    // Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay && overlay.style.display !== 'none') {
        closeReviewModal();
      }
    });

    // Rating continue button
    document.getElementById('review-rating-btn').addEventListener('click', function () {
      if (selectedRating >= 4) {
        showStep('thanks');
        document.getElementById('review-thanks-msg').textContent = 'Redirecting you to leave a public review...';
        window.open(GOOGLE_REVIEWS_URL, '_blank');
        setTimeout(closeReviewModal, 2500);
      } else if (selectedRating > 0) {
        showStep('feedback');
      }
    });

    // Submit feedback
    document.getElementById('review-submit').addEventListener('click', submitFeedback);
  }

  /* ---------- Step management ---------- */
  function showStep(step) {
    document.getElementById('review-step-rating').style.display = 'none';
    document.getElementById('review-step-feedback').style.display = 'none';
    document.getElementById('review-step-thanks').style.display = 'none';
    document.getElementById('review-step-' + step).style.display = 'block';
  }

  /* ---------- Star helpers ---------- */
  function highlightStars(count) {
    var stars = document.querySelectorAll('#review-stars .review-star');
    stars.forEach(function (s) {
      var val = parseInt(s.getAttribute('data-value'), 10);
      s.classList.toggle('active', val <= count);
    });
  }

  function handleStarHover(e) {
    highlightStars(parseInt(e.target.getAttribute('data-value'), 10));
  }

  function handleStarClick(e) {
    selectedRating = parseInt(e.target.getAttribute('data-value'), 10);
    highlightStars(selectedRating);
    var btn = document.getElementById('review-rating-btn');
    btn.disabled = false;
    btn.textContent = selectedRating >= 4 ? 'Continue' : 'Give Feedback';
  }

  /* ---------- Submit ---------- */
  function submitFeedback() {
    var improvement = document.getElementById('review-improvement').value.trim();
    var message     = document.getElementById('review-message').value.trim();

    var payload = {
      rating: selectedRating,
      category: selectedCategory || 'Unspecified',
      improvement: improvement,
      message: message,
      page: window.location.href,
      timestamp: new Date().toISOString()
    };

    var submitBtn = document.getElementById('review-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function () { showThanks(); })
      .catch(function () { showThanks(); });
  }

  function showThanks() {
    document.getElementById('review-thanks-msg').textContent = 'Your feedback has been submitted. We\'ll use it to improve.';
    showStep('thanks');
    setTimeout(closeReviewModal, 2500);
  }

  /* ---------- Public API ---------- */
  window.openReviewModal = function () {
    buildModal();
    selectedRating = 0;
    selectedCategory = null;
    highlightStars(0);
    showStep('rating');

    var ratingBtn = document.getElementById('review-rating-btn');
    ratingBtn.disabled = true;
    ratingBtn.textContent = 'Select a Rating';

    var submitBtn = document.getElementById('review-submit');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Feedback';

    document.getElementById('review-improvement').value = '';
    document.getElementById('review-message').value = '';
    document.getElementById('review-pills').querySelectorAll('.review-pill').forEach(function (p) {
      p.classList.remove('selected');
    });

    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  window.closeReviewModal = function () {
    if (overlay) {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  };
})();
