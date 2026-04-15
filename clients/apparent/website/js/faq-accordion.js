/* ============================================
   Apparent — FAQ Accordion
   ARIA-compliant, smooth animations,
   auto-generates FAQPage JSON-LD
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initFAQAccordion();
  generateFAQSchema();
});

function initFAQAccordion() {
  document.querySelectorAll('.faq-trigger').forEach((trigger, idx) => {
    const content = document.getElementById(trigger.getAttribute('aria-controls'));
    if (!content) return;

    // Add aria-labelledby linking panel to its trigger
    const triggerId = trigger.id || `faq-trigger-${idx}`;
    trigger.id = triggerId;
    content.setAttribute('aria-labelledby', triggerId);

    // Start with hidden attribute
    content.setAttribute('hidden', '');
    let hideTimer = null;

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
    });

    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';

      // Close all others
      document.querySelectorAll('.faq-trigger[aria-expanded="true"]').forEach(other => {
        if (other !== trigger) {
          other.setAttribute('aria-expanded', 'false');
          const otherContent = document.getElementById(other.getAttribute('aria-controls'));
          if (otherContent) {
            otherContent.style.maxHeight = '0';
            setTimeout(() => otherContent.setAttribute('hidden', ''), 500);
          }
        }
      });

      // Toggle current
      trigger.setAttribute('aria-expanded', String(!expanded));
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
      if (!expanded) {
        content.removeAttribute('hidden');
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = '0';
        hideTimer = setTimeout(() => { content.setAttribute('hidden', ''); hideTimer = null; }, 500);
      }
    });
  });
}

function generateFAQSchema() {
  const faqs = [];
  document.querySelectorAll('.faq-trigger').forEach(trigger => {
    const question = trigger.querySelector('span')?.textContent?.trim();
    const content = document.getElementById(trigger.getAttribute('aria-controls'));
    const answer = content?.querySelector('p')?.textContent?.trim();
    if (question && answer) {
      faqs.push({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer }
      });
    }
  });

  if (faqs.length > 0) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }
}
