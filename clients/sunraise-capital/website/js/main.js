/* ============================================
   SunRaise Capital — Main JavaScript
   Scroll reveal, glass header, stat counters,
   rotating text, mobile menu, mega dropdown
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initGlassHeader();
  initStatCounters();
  initRotatingText();
  initMobileMenu();
  initMegaDropdown();
  initChartAnimation();
  initConstellation();
});

/* --- Scroll Reveal --- */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));
}

/* --- Glass Header on Scroll --- */
function initGlassHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const checkScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('header-glass');
      header.classList.remove('header-transparent');
    } else {
      header.classList.remove('header-glass');
      header.classList.add('header-transparent');
    }
  };

  checkScroll();
  window.addEventListener('scroll', checkScroll, { passive: true });
}

/* --- Animated Stat Counters --- */
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
  el.classList.add('counting');
  const target = parseFloat(el.dataset.count);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
  const duration = 2000;
  const start = performance.now();

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutExpo(progress);
    const current = target * easedProgress;

    if (decimals > 0) {
      el.textContent = prefix + current.toFixed(decimals) + suffix;
    } else {
      el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      if (decimals > 0) {
        el.textContent = prefix + target.toFixed(decimals) + suffix;
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    }
  }

  requestAnimationFrame(update);
}

/* --- Rotating Text in Hero --- */
function initRotatingText() {
  const el = document.getElementById('rotating-text');
  if (!el) return;

  const words = JSON.parse(el.dataset.words || '[]');
  const colors = JSON.parse(el.dataset.colors || '[]');
  if (!words.length) return;

  let index = 0;

  setInterval(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';

    setTimeout(() => {
      index = (index + 1) % words.length;
      el.textContent = words[index];
      if (colors.length) {
        el.style.color = colors[index] || colors[0];
      }
      el.style.transform = 'translateY(-8px)';
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, 350);
  }, 3000);
}

/* --- Mobile Menu --- */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isHidden = menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    document.body.style.overflow = isHidden ? 'hidden' : '';
    toggle.setAttribute('aria-expanded', isHidden);

    // Animate hamburger to X
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

  // Close on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      document.body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --- Mega Dropdown --- */
function initMegaDropdown() {
  const trigger = document.getElementById('mega-trigger');
  const dropdown = document.getElementById('mega-dropdown');
  if (!trigger || !dropdown) return;

  let hideTimeout;

  trigger.addEventListener('mouseenter', () => {
    clearTimeout(hideTimeout);
    dropdown.classList.add('show');
  });

  trigger.addEventListener('mouseleave', () => {
    hideTimeout = setTimeout(() => dropdown.classList.remove('show'), 200);
  });

  dropdown.addEventListener('mouseenter', () => {
    clearTimeout(hideTimeout);
  });

  dropdown.addEventListener('mouseleave', () => {
    hideTimeout = setTimeout(() => dropdown.classList.remove('show'), 200);
  });
}

/* --- SVG Chart Animation --- */
function initChartAnimation() {
  const charts = document.querySelectorAll('.chart-line-animate');
  if (!charts.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  charts.forEach(el => observer.observe(el));
}

/* --- Smooth scroll for anchor links --- */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;

  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* --- Hero Constellation Animation --- */
function initConstellation() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.getElementById('hero-constellation');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 420, H = 420;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.scale(dpr, dpr);

  const nodes = [
    { x: 210, y: 190, r: 46, label: 'SunRaise', sub: 'ALIGNMENT', primary: true },
    { x: 210, y: 55, r: 30, label: 'Capital', sub: 'Partners', primary: false },
    { x: 80, y: 330, r: 30, label: 'Installer', sub: 'Partners', primary: false },
    { x: 340, y: 330, r: 30, label: 'Home', sub: 'owners', primary: false },
  ];

  const particles = [];
  for (let i = 0; i < 35; i++) {
    particles.push({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.5 + 0.3, a: Math.random() * 0.12 + 0.02
    });
  }

  // Mouse interaction
  let mouseX = -1000, mouseY = -1000;
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) * (W / rect.width);
    mouseY = (e.clientY - rect.top) * (H / rect.height);
  });
  canvas.addEventListener('mouseleave', () => { mouseX = -1000; mouseY = -1000; });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Particles with mouse attraction
    particles.forEach(p => {
      // Mouse attraction
      const mdx = mouseX - p.x;
      const mdy = mouseY - p.y;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mDist < 150 && mDist > 1) {
        p.vx += (mdx / mDist) * 0.015;
        p.vy += (mdy / mDist) * 0.015;
      }
      // Damping
      p.vx *= 0.995;
      p.vy *= 0.995;

      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(232,151,26,' + p.a + ')';
      ctx.fill();
    });

    // Connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(232,151,26,' + (0.035 * (1 - dist / 90)) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Main structural lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(210, 144); ctx.lineTo(210, 85);
    ctx.moveTo(210, 236); ctx.lineTo(80, 300);
    ctx.moveTo(210, 236); ctx.lineTo(340, 300);
    ctx.moveTo(80, 330); ctx.lineTo(340, 330);
    ctx.stroke();

    // Nodes
    nodes.forEach(n => {
      // Glow
      if (n.primary) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 15, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(232,151,26,0.03)';
        ctx.fill();
      }
      // Circle
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.primary ? 'rgba(232,151,26,0.12)' : 'rgba(255,255,255,0.05)';
      ctx.fill();
      ctx.strokeStyle = n.primary ? 'rgba(232,151,26,0.25)' : 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
      // Label
      ctx.fillStyle = n.primary ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.65)';
      ctx.font = n.primary ? '700 13px Plus Jakarta Sans, Inter, sans-serif' : '600 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(n.label, n.x, n.y - 3);
      ctx.fillStyle = 'rgba(255,255,255,0.32)';
      ctx.font = '9px Inter, sans-serif';
      ctx.fillText(n.sub, n.x, n.y + 12);
    });

    animId = requestAnimationFrame(draw);
  }

  // Pause when hero is off-screen for performance
  let animId;
  const heroObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!animId) animId = requestAnimationFrame(draw);
    } else {
      if (animId) { cancelAnimationFrame(animId); animId = null; }
    }
  }, { threshold: 0 });
  heroObserver.observe(canvas.parentElement);

  animId = requestAnimationFrame(draw);
}
