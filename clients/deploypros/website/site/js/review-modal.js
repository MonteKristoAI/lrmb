/* ============================================
   DEPLOYPROS — Review Gating Modal
   5-star → ≥4 opens Google Reviews, <4 shows feedback
   ============================================ */

(function () {
  'use strict';

  var overlay = document.querySelector('.review-overlay');
  if (!overlay) return;

  var modal = overlay.querySelector('.review-modal');
  var selectedRating = 0;
  var googleReviewsUrl = 'https://g.page/deploypros/review';
  var feedbackCategories = [
    'Response Time',
    'Technician Quality',
    'Communication',
    'Cost',
    'Scheduling',
    'Overall Experience'
  ];
  var selectedCategories = [];

  // Build modal content
  function buildModal() {
    modal.innerHTML = '';

    // Close button
    var closeBtn = document.createElement('button');
    closeBtn.style.cssText = 'position:absolute;top:16px;right:16px;color:var(--gray-400);background:none;border:none;cursor:pointer;';
    closeBtn.innerHTML = '<i data-lucide="x" style="width:20px;height:20px;"></i>';
    closeBtn.addEventListener('click', closeModal);
    modal.appendChild(closeBtn);

    // Title
    var title = document.createElement('h3');
    title.style.cssText = 'font-family:var(--font-heading);font-size:var(--text-h3);font-weight:700;color:var(--text);margin-bottom:var(--space-2);';
    title.textContent = 'How was your experience?';
    modal.appendChild(title);

    var subtitle = document.createElement('p');
    subtitle.style.cssText = 'color:var(--text-muted);font-size:var(--text-sm);margin-bottom:var(--space-4);';
    subtitle.textContent = 'Your feedback helps us improve our field services';
    modal.appendChild(subtitle);

    // Stars
    var starsDiv = document.createElement('div');
    starsDiv.className = 'review-stars';
    for (var i = 1; i <= 5; i++) {
      var star = document.createElement('button');
      star.className = 'review-star' + (i <= selectedRating ? ' active' : '');
      star.setAttribute('data-rating', i);
      star.setAttribute('aria-label', i + ' star' + (i > 1 ? 's' : ''));
      star.innerHTML = '<svg viewBox="0 0 24 24" fill="' + (i <= selectedRating ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
      star.addEventListener('click', (function (rating) {
        return function () { handleRating(rating); };
      })(i));
      star.addEventListener('mouseenter', (function (rating) {
        return function () { highlightStars(rating); };
      })(i));
      starsDiv.appendChild(star);
    }
    starsDiv.addEventListener('mouseleave', function () {
      highlightStars(selectedRating);
    });
    modal.appendChild(starsDiv);

    // Rating text
    var ratingText = document.createElement('p');
    ratingText.id = 'rating-text';
    ratingText.style.cssText = 'color:var(--text-muted);font-size:var(--text-sm);min-height:20px;margin-bottom:var(--space-4);';
    var labels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];
    ratingText.textContent = selectedRating > 0 ? labels[selectedRating] : '';
    modal.appendChild(ratingText);

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function highlightStars(rating) {
    var stars = modal.querySelectorAll('.review-star');
    stars.forEach(function (star, i) {
      var isActive = (i + 1) <= rating;
      star.className = 'review-star' + (isActive ? ' active' : '');
      var svg = star.querySelector('svg polygon');
      if (svg) svg.parentElement.setAttribute('fill', isActive ? 'currentColor' : 'none');
    });
  }

  function handleRating(rating) {
    selectedRating = rating;

    if (rating >= 4) {
      // Redirect to Google Reviews
      showThankYou('Thanks for the great rating! Redirecting you to leave a Google review...');
      setTimeout(function () {
        window.open(googleReviewsUrl, '_blank');
        closeModal();
      }, 1500);
    } else {
      // Show feedback form
      showFeedbackForm();
    }
  }

  function showFeedbackForm() {
    buildModal();

    var feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'review-feedback';
    feedbackDiv.style.display = 'block';

    var feedbackTitle = document.createElement('p');
    feedbackTitle.style.cssText = 'font-family:var(--font-heading);font-weight:600;color:var(--text);margin-bottom:var(--space-3);';
    feedbackTitle.textContent = 'What could we improve?';
    feedbackDiv.appendChild(feedbackTitle);

    // Category chips
    var chipsDiv = document.createElement('div');
    chipsDiv.className = 'review-chips';
    feedbackCategories.forEach(function (cat) {
      var chip = document.createElement('button');
      chip.className = 'review-chip' + (selectedCategories.indexOf(cat) > -1 ? ' selected' : '');
      chip.textContent = cat;
      chip.addEventListener('click', function () {
        var idx = selectedCategories.indexOf(cat);
        if (idx > -1) {
          selectedCategories.splice(idx, 1);
          chip.classList.remove('selected');
        } else {
          selectedCategories.push(cat);
          chip.classList.add('selected');
        }
      });
      chipsDiv.appendChild(chip);
    });
    feedbackDiv.appendChild(chipsDiv);

    // Text input
    var textarea = document.createElement('textarea');
    textarea.className = 'form-textarea';
    textarea.placeholder = 'Tell us more about your experience...';
    textarea.style.cssText = 'margin-top:var(--space-4);min-height:100px;';
    feedbackDiv.appendChild(textarea);

    // Submit
    var submitBtn = document.createElement('button');
    submitBtn.className = 'btn btn-primary w-full';
    submitBtn.style.marginTop = 'var(--space-4)';
    submitBtn.textContent = 'Submit Feedback';
    submitBtn.addEventListener('click', function () {
      showThankYou('Thank you for your feedback! We take every response seriously and will use it to improve our services.');
      setTimeout(closeModal, 2500);
    });
    feedbackDiv.appendChild(submitBtn);

    modal.appendChild(feedbackDiv);
  }

  function showThankYou(message) {
    modal.innerHTML = '';
    modal.style.position = 'relative';

    var icon = document.createElement('div');
    icon.style.cssText = 'width:64px;height:64px;border-radius:50%;background:rgba(0,230,118,0.15);display:flex;align-items:center;justify-content:center;margin:0 auto var(--space-4);';
    icon.innerHTML = '<i data-lucide="check-circle" style="width:32px;height:32px;color:var(--success);"></i>';
    modal.appendChild(icon);

    var msg = document.createElement('p');
    msg.style.cssText = 'color:var(--text);font-size:1rem;line-height:1.6;';
    msg.textContent = message;
    modal.appendChild(msg);

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function openModal() {
    selectedRating = 0;
    selectedCategories = [];
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    buildModal();
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Close on overlay click
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });

  // Bind all "Leave a Review" buttons
  document.querySelectorAll('[data-review-trigger]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  });

  // Global access
  window.openReviewModal = openModal;
})();
