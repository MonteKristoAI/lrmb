/* ============================================
   DEPLOYPROS — FAQ Accordion
   ARIA-compliant, smooth height transitions,
   auto-generates FAQPage JSON-LD
   ============================================ */

(function () {
  'use strict';

  var faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  // Initialize ARIA attributes and behavior
  faqItems.forEach(function (item, index) {
    var trigger = item.querySelector('.faq-trigger');
    var content = item.querySelector('.faq-content');
    if (!trigger || !content) return;

    var id = 'faq-' + index;
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', id + '-content');
    trigger.setAttribute('id', id + '-trigger');
    content.setAttribute('id', id + '-content');
    content.setAttribute('role', 'region');
    content.setAttribute('aria-labelledby', id + '-trigger');

    trigger.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(function (otherItem) {
        if (otherItem !== item && otherItem.classList.contains('open')) {
          closeFaq(otherItem);
        }
      });

      if (isOpen) {
        closeFaq(item);
      } else {
        openFaq(item);
      }
    });
  });

  function openFaq(item) {
    var trigger = item.querySelector('.faq-trigger');
    var content = item.querySelector('.faq-content');
    var inner = content.querySelector('.faq-content-inner');
    if (!inner) return;

    item.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
    content.style.maxHeight = inner.scrollHeight + 'px';
  }

  function closeFaq(item) {
    var trigger = item.querySelector('.faq-trigger');
    var content = item.querySelector('.faq-content');

    item.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
    content.style.maxHeight = '0';
  }

  // Generate FAQPage JSON-LD
  function generateFaqSchema() {
    var faqs = [];

    faqItems.forEach(function (item) {
      var trigger = item.querySelector('.faq-trigger');
      var contentInner = item.querySelector('.faq-content-inner');
      if (!trigger || !contentInner) return;

      var question = trigger.textContent.trim();
      // Remove chevron icon text if present
      question = question.replace(/[\n\r]+/g, ' ').trim();

      var answer = contentInner.textContent.trim();

      if (question && answer) {
        faqs.push({
          '@type': 'Question',
          'name': question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': answer
          }
        });
      }
    });

    if (faqs.length === 0) return;

    var schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs
    };

    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  generateFaqSchema();

  // Keyboard navigation
  var triggers = document.querySelectorAll('.faq-trigger');
  triggers.forEach(function (trigger, index) {
    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        var next = triggers[index + 1] || triggers[0];
        next.focus();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        var prev = triggers[index - 1] || triggers[triggers.length - 1];
        prev.focus();
      }
      if (e.key === 'Home') {
        e.preventDefault();
        triggers[0].focus();
      }
      if (e.key === 'End') {
        e.preventDefault();
        triggers[triggers.length - 1].focus();
      }
    });
  });
})();
