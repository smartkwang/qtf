/* ===================================================================
   질문중심수업 · QFT — Interactions
   =================================================================== */

(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ----- Progress bar -----
  const bar = document.querySelector('.progress__bar');
  const onScroll = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    bar.style.width = (Math.min(1, Math.max(0, scrolled)) * 100).toFixed(2) + '%';
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ----- Reveal on scroll -----
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        if (e.target.dataset.once !== 'no') io.unobserve(e.target);
      }
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal, [data-reveal]').forEach(el => io.observe(el));

  // ----- Particles in hero -----
  if (!reduced) {
    const layer = document.querySelector('.particles');
    if (layer) {
      const glyphs = ['?', '?', '?', '·', '?', '?'];
      for (let i = 0; i < 36; i++) {
        const s = document.createElement('span');
        s.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
        s.style.left = (Math.random() * 100).toFixed(2) + '%';
        s.style.bottom = (-10 - Math.random() * 30).toFixed(2) + '%';
        s.style.fontSize = (12 + Math.random() * 26).toFixed(1) + 'px';
        s.style.animationDuration = (16 + Math.random() * 22).toFixed(1) + 's';
        s.style.animationDelay = (-Math.random() * 30).toFixed(1) + 's';
        s.style.opacity = (0.04 + Math.random() * 0.10).toFixed(2);
        layer.appendChild(s);
      }
    }
  }

  // ----- QFT ring chips: position around center -----
  const stage = document.querySelector('.qft__stage');
  if (stage) {
    const chips = stage.querySelectorAll('.qft__chip');
    const N = chips.length;
    const radiusPct = 46;
    chips.forEach((c, i) => {
      const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
      const x = 50 + Math.cos(angle) * radiusPct;
      const y = 50 + Math.sin(angle) * radiusPct;
      c.style.left = x + '%';
      c.style.top  = y + '%';
      c.style.transitionDelay = (i * 70) + 'ms';
    });
  }

  // ----- Improve toggle (closed/open) -----
  const tog = document.querySelector('.improve__toggle');
  if (tog) {
    const buttons = tog.querySelectorAll('button');
    const closedCard = document.querySelector('.imp.is-closed');
    const openCard   = document.querySelector('.imp.is-open');
    const setMode = (mode) => {
      buttons.forEach(b => b.classList.toggle('is-active', b.dataset.mode === mode));
      buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
      if (mode === 'transform') {
        closedCard.classList.remove('is-faded');
        openCard.classList.remove('is-faded');
      } else if (mode === 'closed') {
        closedCard.classList.remove('is-faded');
        openCard.classList.add('is-faded');
      } else {
        openCard.classList.remove('is-faded');
        closedCard.classList.add('is-faded');
      }
    };
    buttons.forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
    setMode('transform');
  }

  // ----- Checklist persistence (light, optional) -----
  document.querySelectorAll('.checklist input').forEach((input, i) => {
    const key = 'qft.checklist.' + i;
    try {
      if (localStorage.getItem(key) === '1') input.checked = true;
      input.addEventListener('change', () => {
        try { localStorage.setItem(key, input.checked ? '1' : '0'); } catch (_) {}
      });
    } catch (_) { /* ignore */ }
  });

  // ----- Smooth anchors (nav) -----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const y = target.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
        }
      }
    });
  });
})();
