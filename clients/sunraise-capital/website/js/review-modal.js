/* ============================================
   Review Gating Modal
   >=4 stars → Google Reviews
   <4 stars → Internal feedback form
   ============================================ */

const GOOGLE_REVIEWS_URL = 'https://g.page/r/sunraise-capital/review';
const REVIEW_WEBHOOK_URL = 'https://hooks.example.com/review-feedback';
const FEEDBACK_CATEGORIES = ['Platform Experience', 'Capital Deployment', 'Installer Support', 'Homeowner Experience', 'Communication', 'Other'];

let currentRating = 0;
let selectedCategories = [];

function openReviewModal() {
  const modal = document.getElementById('review-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  renderStars();
}

function closeReviewModal() {
  const modal = document.getElementById('review-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  currentRating = 0;
  selectedCategories = [];
  document.getElementById('review-step-rating').classList.remove('hidden');
  document.getElementById('review-step-feedback').classList.add('hidden');
  document.getElementById('review-step-thanks').classList.add('hidden');
}

function renderStars() {
  const container = document.getElementById('star-container');
  if (!container) return;
  container.innerHTML = '';

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('button');
    star.innerHTML = '&#9733;';
    star.className = `text-4xl transition-colors cursor-pointer ${i <= currentRating ? 'text-amber-400' : 'text-navy-200 hover:text-amber-300'}`;
    star.setAttribute('aria-label', `${i} star${i > 1 ? 's' : ''}`);
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
    window.open(GOOGLE_REVIEWS_URL, '_blank');
    showReviewThanks();
  } else {
    document.getElementById('review-step-rating').classList.add('hidden');
    document.getElementById('review-step-feedback').classList.remove('hidden');
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
    pill.className = `px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
      selectedCategories.includes(cat)
        ? 'bg-sun-500 text-white border-sun-500'
        : 'bg-white text-navy-600 border-navy-200 hover:border-sun-400'
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
    improvement: document.getElementById('review-improvement').value,
    message: document.getElementById('review-message').value,
    source: window.location.pathname,
    timestamp: new Date().toISOString()
  };

  fetch(REVIEW_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(res => {
    if (!res.ok) throw new Error('Submission failed');
    showReviewThanks();
  }).catch(() => {
    const feedbackStep = document.getElementById('review-step-feedback');
    if (feedbackStep && !feedbackStep.querySelector('.submit-error')) {
      const errorDiv = document.createElement('p');
      errorDiv.className = 'submit-error text-red-500 text-sm mt-3 text-center';
      errorDiv.textContent = 'Could not submit feedback. Please try again.';
      feedbackStep.appendChild(errorDiv);
    }
  });
}

function showReviewThanks() {
  document.getElementById('review-step-rating').classList.add('hidden');
  document.getElementById('review-step-feedback').classList.add('hidden');
  document.getElementById('review-step-thanks').classList.remove('hidden');
  if (typeof lucide !== 'undefined') lucide.createIcons();
  setTimeout(closeReviewModal, 2500);
}
