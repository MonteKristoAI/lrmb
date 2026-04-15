/* ============================================
   FAQ Accordion
   ARIA-compliant with smooth height transitions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.faq-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all others
      document.querySelectorAll('.faq-trigger').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        if (b.nextElementSibling) {
          b.nextElementSibling.style.maxHeight = '0';
        }
      });

      // Toggle current
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        if (content) {
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      }
    });
  });
});
