/* ============================================
   Apparent — Review Gating Modal
   >=4 stars → Google Reviews
   <4 stars → Internal feedback form
   ============================================ */

const GOOGLE_REVIEWS_URL = 'https://g.page/r/apparent-inc/review';
const REVIEW_WEBHOOK_URL = 'https://your-n8n.railway.app/webhook/apparent-review';
const FEEDBACK_CATEGORIES = ['eXeL Water Heater', 'igOS Platform', 'Installation', 'Customer Support', 'Energy Savings', 'Other'];

let currentRating = 0;
let selectedCategories = [];

function openReviewModal() {
  const modal = document.getElementById('review-modal');
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderStars();
}

function closeReviewModal() {
  const modal = document.getElementById('review-modal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
  currentRating = 0;
  selectedCategories = [];
  document.getElementById('review-step-rating')?.classList.remove('hidden');
  document.getElementById('review-step-feedback')?.classList.add('hidden');
  document.getElementById('review-step-thanks')?.classList.add('hidden');
}

function renderStars() {
  const container = document.getElementById('star-container');
  if (!container) return;
  container.innerHTML = '';

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('button');
    star.innerHTML = '&#9733;';
    star.dataset.star = i;
    star.className = `review-star text-5xl transition-all cursor-pointer ${i <= currentRating ? 'text-energy-400 scale-110' : 'text-midnight-600'}`;
    star.setAttribute('aria-label', `${i} star${i > 1 ? 's' : ''}`);
    star.type = 'button';

    // Hover: highlight ALL stars up to this one
    star.onmouseenter = () => {
      container.querySelectorAll('button').forEach(s => {
        const idx = parseInt(s.dataset.star);
        if (idx <= i) {
          s.classList.remove('text-midnight-600');
          s.classList.add('text-energy-300');
        }
      });
    };

    // Click: set rating + auto-submit after brief delay
    star.onclick = () => {
      currentRating = i;
      renderStars();
      const btn = document.getElementById('review-continue');
      if (btn) btn.disabled = false;
      // Auto-submit after 400ms so user sees their selection
      setTimeout(() => handleRatingSubmit(), 400);
    };

    container.appendChild(star);
  }

  // Reset all stars on mouse leave from container
  container.onmouseleave = () => {
    container.querySelectorAll('button').forEach(s => {
      const idx = parseInt(s.dataset.star);
      if (idx <= currentRating) {
        s.classList.remove('text-midnight-600', 'text-energy-300');
        s.classList.add('text-energy-400');
      } else {
        s.classList.remove('text-energy-300', 'text-energy-400');
        s.classList.add('text-midnight-600');
      }
    });
  };
}

function handleRatingSubmit() {
  if (currentRating >= 4) {
    window.open(GOOGLE_REVIEWS_URL, '_blank');
    showReviewThanks();
  } else {
    document.getElementById('review-step-rating')?.classList.add('hidden');
    document.getElementById('review-step-feedback')?.classList.remove('hidden');
    renderCategoryPills();
  }
}

function renderCategoryPills() {
  const container = document.getElementById('category-pills');
  if (!container) return;
  container.innerHTML = '';

  FEEDBACK_CATEGORIES.forEach(cat => {
    const pill = document.createElement('button');
    pill.textContent = cat;
    pill.type = 'button';
    pill.className = `px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
      selectedCategories.includes(cat)
        ? 'bg-energy-500 text-white border-energy-500'
        : 'bg-transparent text-white/70 border-white/20 hover:border-energy-400'
    }`;
    pill.onclick = () => {
      if (selectedCategories.includes(cat)) {
        selectedCategories = selectedCategories.filter(c => c !== cat);
      } else {
        selectedCategories.push(cat);
      }
      renderCategoryPills();
    };
    container.appendChild(pill);
  });
}

function submitFeedback() {
  const payload = {
    rating: currentRating,
    categories: selectedCategories,
    improvement: document.getElementById('review-improvement')?.value || '',
    message: document.getElementById('review-message')?.value || '',
    source: window.location.pathname,
    timestamp: new Date().toISOString()
  };

  fetch(REVIEW_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(() => {});

  showReviewThanks();
}

function showReviewThanks() {
  document.getElementById('review-step-rating')?.classList.add('hidden');
  document.getElementById('review-step-feedback')?.classList.add('hidden');
  document.getElementById('review-step-thanks')?.classList.remove('hidden');
  if (typeof lucide !== 'undefined') lucide.createIcons();
  setTimeout(closeReviewModal, 2500);
}

// Escape key closes modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeReviewModal();
});
