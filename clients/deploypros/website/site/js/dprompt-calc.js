/* ============================================
   DPROMPT ROI Calculator
   Hydrates #roi-calculator with interactive sliders
   ============================================ */

(function () {
  'use strict';

  var visitsSlider = document.getElementById('roi-visits');
  var rateSlider = document.getElementById('roi-rate');
  var visitsValue = document.getElementById('roi-visits-value');
  var rateValue = document.getElementById('roi-rate-value');
  var preventedEl = document.getElementById('roi-prevented');
  var savingsEl = document.getElementById('roi-savings');

  if (!visitsSlider || !rateSlider) return;

  var COST_PER_MISSED = 150;

  function calculate() {
    var visits = parseInt(visitsSlider.value, 10);
    var rate = parseInt(rateSlider.value, 10);

    visitsValue.textContent = visits.toLocaleString();
    rateValue.textContent = rate + '%';

    var prevented = Math.round(visits * (rate / 100));
    var savings = prevented * COST_PER_MISSED;

    preventedEl.textContent = prevented.toLocaleString();
    savingsEl.textContent = '$' + savings.toLocaleString();
  }

  visitsSlider.addEventListener('input', calculate);
  rateSlider.addEventListener('input', calculate);

  // Initial calculation
  calculate();
})();
