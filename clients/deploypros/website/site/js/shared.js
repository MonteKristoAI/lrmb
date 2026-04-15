/* ============================================
   DEPLOYPROS.COM — Shared JavaScript
   Scroll Reveal, Sticky Header, Mobile Menu,
   Counter Animation, Smooth Scroll
   ============================================ */

(function () {
  'use strict';

  // --- Sticky Header ---
  const header = document.querySelector('.header');
  if (header) {
    let lastScroll = 0;
    const scrollThreshold = 60;

    window.addEventListener('scroll', function () {
      const currentScroll = window.scrollY;
      if (currentScroll > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // --- Mobile Menu Toggle ---
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      menuToggle.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Scroll Reveal (IntersectionObserver) ---
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  // --- Hero Entrance Animation ---
  function initHeroEntrance() {
    var heroElements = document.querySelectorAll('.hero-enter');
    if (!heroElements.length) return;

    // Trigger after a short delay for page load
    setTimeout(function () {
      heroElements.forEach(function (el) {
        el.classList.add('visible');
      });
    }, 200);
  }

  // --- Counter Animation ---
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var duration = 2000;
    var startTime = null;

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function update(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easedProgress = easeOutCubic(progress);
      var current = easedProgress * target;

      if (decimals > 0) {
        el.textContent = prefix + current.toFixed(decimals) + suffix;
      } else {
        el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  function initCounters() {
    var counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          var headerOffset = 80;
          var elementPosition = targetEl.getBoundingClientRect().top;
          var offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // --- Active Nav Link ---
  function initActiveNav() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  // --- Architecture Diagram Line Draw (for dprompt page) ---
  function initArchDiagramAnimation() {
    var diagram = document.querySelector('.arch-diagram');
    if (!diagram) return;

    var lines = diagram.querySelectorAll('.arch-line');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          lines.forEach(function (line, i) {
            setTimeout(function () {
              line.classList.add('arch-line--animated');
            }, i * 300);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(diagram);
  }

  // --- Testimonials Auto-Advance ---
  function initTestimonialCarousel() {
    var track = document.querySelector('.testimonials-track');
    if (!track) return;

    var cards = track.querySelectorAll('.testimonial-card');
    if (cards.length < 2) return;

    var cardWidth = cards[0].offsetWidth + 24; // card width + gap
    var currentIndex = 0;
    var autoAdvance;
    var isPaused = false;

    function advance() {
      currentIndex = (currentIndex + 1) % cards.length;
      track.scrollTo({
        left: currentIndex * cardWidth,
        behavior: 'smooth'
      });
    }

    function startAutoAdvance() {
      autoAdvance = setInterval(function () {
        if (!isPaused) advance();
      }, 5000);
    }

    track.addEventListener('mouseenter', function () { isPaused = true; });
    track.addEventListener('mouseleave', function () { isPaused = false; });
    track.addEventListener('touchstart', function () { isPaused = true; }, { passive: true });
    track.addEventListener('touchend', function () {
      setTimeout(function () { isPaused = false; }, 3000);
    });

    startAutoAdvance();
  }

  // --- Parallax on Hero Grid ---
  function initParallax() {
    var heroGrid = document.querySelector('.hero-grid');
    if (!heroGrid || window.innerWidth < 768) return;

    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY;
      heroGrid.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
    }, { passive: true });
  }

  // --- Initialize Lucide Icons ---
  function initIcons() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  // --- Init All ---
  function init() {
    initScrollReveal();
    initHeroEntrance();
    initCounters();
    initSmoothScroll();
    initActiveNav();
    initArchDiagramAnimation();
    initTestimonialCarousel();
    initParallax();
    initIcons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
