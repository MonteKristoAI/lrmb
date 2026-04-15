/* ============================================
   Apparent Inc. — Level 10 Main JavaScript
   Particle field, custom cursor, magnetic buttons,
   3D tilt, split text, glass header, stat counters,
   rotating text, mobile menu, mega dropdown, loader
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initScrollReveal();
  initGlassHeader();
  initStatCounters();
  initRotatingText();
  initMobileMenu();
  initMegaDropdown();
  initSplitText();
  initParticleField();
  initCustomCursor();
  initMagneticButtons();
  initTiltCards();
  initSmoothAnchors();
});

/* ─── BRANDED LOADER ─── */
function initLoader() {
  const loader = document.getElementById('site-loader');
  if (!loader) return;

  // Skip on return visits within session
  if (sessionStorage.getItem('apparent-loaded')) {
    loader.remove();
    return;
  }

  sessionStorage.setItem('apparent-loaded', '1');

  setTimeout(() => {
    loader.classList.add('loaded');
    setTimeout(() => loader.remove(), 600);
  }, 1800);
}

/* ─── SCROLL REVEAL (IntersectionObserver) ─── */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
    .forEach(el => observer.observe(el));

  // Comparison table row reveal with stagger
  const tableRows = document.querySelectorAll('.comparison-table tbody tr');
  if (tableRows.length) {
    const rowObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const row = entry.target;
          const index = Array.from(tableRows).indexOf(row);
          setTimeout(() => row.classList.add('visible'), index * 80);
          rowObserver.unobserve(row);
        }
      });
    }, { threshold: 0.1 });
    tableRows.forEach(tr => rowObserver.observe(tr));
  }
}

/* ─── GLASS HEADER ─── */
function initGlassHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const check = () => {
    if (window.scrollY > 40) {
      header.classList.add('header-glass');
      header.classList.remove('header-transparent');
    } else {
      header.classList.remove('header-glass');
      header.classList.add('header-transparent');
    }
  };

  check();
  window.addEventListener('scroll', check, { passive: true });
}

/* ─── STAT COUNTERS ─── */
function initStatCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
  const duration = 2200;
  const start = performance.now();

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const current = target * easeOutExpo(progress);

    const useLocale = !el.dataset.noformat && target < 1900; // Don't format years
    el.textContent = prefix + (decimals > 0 ? current.toFixed(decimals) : (useLocale ? Math.floor(current).toLocaleString() : String(Math.floor(current)))) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = prefix + (decimals > 0 ? target.toFixed(decimals) : (useLocale ? target.toLocaleString() : String(target))) + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* ─── ANIMATED TEXT CYCLE (framer-motion quality, pure JS) ─── */
function initRotatingText() {
  // Support both old (#rotating-text) and new (.text-cycle-wrapper) patterns
  const wrapper = document.querySelector('.text-cycle-wrapper');
  const legacyEl = document.getElementById('rotating-text');

  if (wrapper) {
    initTextCycle(wrapper);
  } else if (legacyEl) {
    initLegacyRotating(legacyEl);
  }
}

function initTextCycle(wrapper) {
  const words = JSON.parse(wrapper.dataset.words || '[]');
  const interval = parseInt(wrapper.dataset.interval || '3000');
  if (!words.length) return;

  // Hidden measurement container
  const measure = document.createElement('div');
  measure.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;white-space:nowrap;';
  measure.className = wrapper.className;
  document.body.appendChild(measure);

  let index = 0;
  let currentSpan = null;

  function getWordWidth(word) {
    measure.textContent = word;
    measure.style.font = getComputedStyle(wrapper).font;
    measure.style.fontWeight = '700';
    measure.style.fontSize = getComputedStyle(wrapper.parentElement).fontSize;
    return measure.getBoundingClientRect().width + 4; // small buffer
  }

  function showWord(wordIndex) {
    const word = words[wordIndex];

    // Create new word span (stays in flow = proper baseline alignment)
    const span = document.createElement('span');
    span.className = 'text-cycle-word entering';
    span.textContent = word;
    span.setAttribute('aria-hidden', 'true');

    // Exit current word (becomes absolute so it overlaps during exit)
    if (currentSpan) {
      const oldSpan = currentSpan;
      oldSpan.classList.remove('entering');
      oldSpan.classList.add('exiting');
      setTimeout(() => oldSpan.remove(), 450);
    }

    wrapper.appendChild(span);
    currentSpan = span;
  }

  // Set initial word
  showWord(0);
  wrapper.setAttribute('aria-label', words.join(', '));

  // Cycle
  setInterval(() => {
    index = (index + 1) % words.length;
    showWord(index);
  }, interval);
}

// Legacy fallback for old markup
function initLegacyRotating(el) {
  const words = JSON.parse(el.dataset.words || '[]');
  if (!words.length) return;
  let index = 0;
  setInterval(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    setTimeout(() => {
      index = (index + 1) % words.length;
      el.textContent = words[index];
      el.style.transform = 'translateY(-10px)';
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, 350);
  }, 2800);
}

/* ─── MOBILE MENU ─── */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isHidden = menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    document.body.style.overflow = isHidden ? 'hidden' : '';
    toggle.setAttribute('aria-expanded', String(isHidden));

    const bars = toggle.querySelectorAll('.menu-bar');
    if (bars.length === 3) {
      if (isHidden) {
        bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
      } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
      }
    }
  });

  function closeMenu() {
    menu.classList.add('hidden');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
    const bars = toggle.querySelectorAll('.menu-bar');
    if (bars.length === 3) {
      bars[0].style.transform = 'none';
      bars[1].style.opacity = '1';
      bars[2].style.transform = 'none';
    }
    toggle.focus();
  }

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Escape key closes mobile menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
      e.preventDefault();
      closeMenu();
    }
  });
}

/* ─── MEGA DROPDOWN ─── */
function initMegaDropdown() {
  const trigger = document.getElementById('mega-trigger');
  const dropdown = document.getElementById('mega-dropdown');
  if (!trigger || !dropdown) return;

  let hideTimeout;

  const triggerBtn = trigger.querySelector('button[aria-haspopup]');

  function openDropdown() {
    clearTimeout(hideTimeout);
    dropdown.classList.add('show');
    if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'true');
  }
  function closeDropdown() {
    dropdown.classList.remove('show');
    if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'false');
  }

  trigger.addEventListener('mouseenter', () => {
    clearTimeout(hideTimeout);
    openDropdown();
  });

  trigger.addEventListener('mouseleave', () => {
    hideTimeout = setTimeout(closeDropdown, 200);
  });

  dropdown.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
  dropdown.addEventListener('mouseleave', () => {
    hideTimeout = setTimeout(closeDropdown, 200);
  });

  // Keyboard: open on Enter/Space/ArrowDown, close on Escape
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      dropdown.classList.add('show');
      const firstLink = dropdown.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  });

  dropdown.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      dropdown.classList.remove('show');
      trigger.querySelector('a')?.focus();
    }
  });

  // Close on focusout (tab away)
  trigger.addEventListener('focusout', (e) => {
    setTimeout(() => {
      if (!trigger.contains(document.activeElement) && !dropdown.contains(document.activeElement)) {
        dropdown.classList.remove('show');
      }
    }, 100);
  });
}

/* ─── SPLIT TEXT REVEAL ─── */
function initSplitText() {
  document.querySelectorAll('.split-text').forEach(el => {
    const text = el.textContent.trim();
    const words = text.split(/\s+/);
    el.textContent = '';
    el.setAttribute('aria-label', text);

    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = word;
      span.style.transitionDelay = `${i * 60}ms`;
      span.setAttribute('aria-hidden', 'true');
      el.appendChild(span);

      // Add space between words
      if (i < words.length - 1) {
        el.appendChild(document.createTextNode('\u00A0'));
      }
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.split-text').forEach(el => observer.observe(el));
}

/* ─── PARTICLE FIELD (Canvas) ─── */
function initParticleField() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;
  const PARTICLE_COUNT = 90;
  const CONNECTION_DIST = 140;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2.2 + 0.6,
        a: Math.random() * 0.2 + 0.05
      });
    }
  }

  let mouseX = -1000, mouseY = -1000;
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouseX = -1000; mouseY = -1000; });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      // Mouse attraction
      const mdx = mouseX - p.x;
      const mdy = mouseY - p.y;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mDist < 200 && mDist > 1) {
        p.vx += (mdx / mDist) * 0.02;
        p.vy += (mdy / mDist) * 0.02;
      }

      p.vx *= 0.997;
      p.vy *= 0.997;
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      p.x = Math.max(0, Math.min(W, p.x));
      p.y = Math.max(0, Math.min(H, p.y));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(249,115,22,${p.a})`;
      ctx.fill();
      // Add soft glow around larger particles
      if (p.r > 1.5) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249,115,22,${p.a * 0.15})`;
        ctx.fill();
      }
    });

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(249,115,22,${0.07 * (1 - dist / CONNECTION_DIST)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  resize();
  createParticles();

  // Pause when off-screen
  const heroObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!animId) animId = requestAnimationFrame(draw);
    } else {
      if (animId) { cancelAnimationFrame(animId); animId = null; }
    }
  }, { threshold: 0 });
  heroObserver.observe(canvas.parentElement);

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  animId = requestAnimationFrame(draw);
}

/* ─── CUSTOM CURSOR ─── */
function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  let cx = -100, cy = -100, tx = -100, ty = -100;

  document.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    if (!cursor.classList.contains('visible')) cursor.classList.add('visible');
  });

  document.addEventListener('mouseleave', () => cursor.classList.remove('visible'));

  // Hover detection
  const interactiveSelectors = 'a, button, [role="button"], input, textarea, select, .tilt-card';
  const imageSelectors = '.img-zoom, .img-glow';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(imageSelectors)) {
      cursor.classList.add('hover-img');
      cursor.classList.remove('hover');
    } else if (e.target.closest(interactiveSelectors)) {
      cursor.classList.add('hover');
      cursor.classList.remove('hover-img');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelectors) || e.target.closest(imageSelectors)) {
      cursor.classList.remove('hover', 'hover-img');
    }
  });

  function animate() {
    cx += (tx - cx) * 0.15;
    cy += (ty - cy) * 0.15;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(animate);
  }
  animate();
}

/* ─── MAGNETIC BUTTONS ─── */
function initMagneticButtons() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.magnetic-wrap').forEach(wrap => {
    const btn = wrap.querySelector('.btn-energy, .btn-ghost, .btn-energy-light');
    if (!btn) return;

    wrap.addEventListener('mousemove', (e) => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      wrap.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });

    wrap.addEventListener('mouseleave', () => {
      wrap.style.transform = '';
      btn.style.transform = '';
    });
  });
}

/* ─── 3D TILT CARDS ─── */
function initTiltCards() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (y - 0.5) * -10;
      const rotateY = (x - 0.5) * 10;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s var(--ease)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
}

/* ─── SMOOTH ANCHORS ─── */
function initSmoothAnchors() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Move focus for skip link and section links (a11y)
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
}
