(() => {
  'use strict';
  const BASE = (window.VALK_BASE || 'assets/');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;

  const P = (id, list, ext = 'jpg') => list.map(n => `${BASE}projects/${id}/${n}.${ext}`);
  const projects = [
    { id: 'verus', title: 'Verus', category: 'Branding & Beauty', chapter: 'Identidade', year: '2026',
      role: 'Estratégia · Identidade · Direção de arte', statement: 'Beleza verdadeira é aquela que permanece.',
      description: 'Uma identidade premium construída para transformar verdade, cuidado e permanência em uma linguagem visual sofisticada — do símbolo às embalagens e aplicações de campanha.',
      accent: '#c29a5c', images: P('verus', ['01', '07', '09', '19', '23', '24', '27', '33']) },
    { id: 'convencao', title: 'Convenção Rodrigues', category: 'Brand Experience', chapter: 'Experiência', year: '2026',
      role: 'Key visual · Ambientação · Desdobramentos', statement: 'Performance é hábito. Cultura é identidade.',
      description: 'Sistema visual para uma convenção de grande escala, conectando energia, performance e cultura em credenciamento, palco, sinalização, uniformes e comunicação digital.',
      accent: '#ff29bd', images: P('convencao', ['04', '05', '06', '07', '09']) },
    { id: 'parintins', title: 'Parintins', category: 'Campanha 360º', chapter: 'Campanha', year: '2026',
      role: 'Conceito · KV · Identidade regional', statement: 'Conforto que emociona.',
      description: 'Uma campanha que traduz a potência cultural de Parintins para o varejo, equilibrando o azul e o vermelho em peças, ambientes e brindes com presença regional.',
      accent: '#237bff', images: P('parintins', ['01', '02', '03', '05', '06', '09', '10', '11', '12']) },
    { id: 'bravolt', title: 'Bravolt', category: 'Branding & Retail', chapter: 'Varejo', year: '2025',
      role: 'Identidade · Embalagens · Campanha', statement: 'Mais conforto. Mais economia.',
      description: 'Uma marca direta, tecnológica e acessível para o varejo de eletro, com um sistema que ganha escala em embalagens, mídia externa, uniformes, digital e produtos.',
      accent: '#17cbd0', images: P('bravolt', ['01', '02', '03', '09', '11', '20', '23', '29', '35']) },
    { id: 'feijao', title: 'Feijão Autoposto', category: 'Identidade & Experiência', chapter: 'Identidade', year: 'Case',
      role: 'Identidade · Mascote · Uniformes', statement: 'Uma marca próxima, energética e feita para movimentar.',
      description: 'Sistema visual para um autoposto com forte presença popular, combinando vermelho, amarelo e personalidade — da fachada aos uniformes e ao mascote.',
      accent: '#ffcd05', images: P('feijao', ['fachada', 'corredor', 'manga-longa', 'logo-colorida', 'logo-vermelho-branco', 'logo-vermelho-amarelo', 'logo-amarelo-vermelho', 'equipe'], 'webp') },
    { id: 'caloi', title: 'Caloi', category: 'Design Ambiental', chapter: 'Institucional', year: 'Case',
      role: 'Mural · Comunicação interna · Ambientação', statement: 'Cultura e propósito transformados em percurso visual.',
      description: 'Mural corporativo que organiza visão, valores, estratégia e propósito como uma jornada contínua, conectando o universo do ciclismo à cultura organizacional.',
      accent: '#ed1c24', images: P('caloi', ['mural-aplicado', 'detalhe-mural', 'angulo-conceitual'], 'webp') },
  ];
  const N = projects.length;
  const pad = n => String(n).padStart(2, '0');
  const mod = (a, n) => ((a % n) + n) % n;

  /* ---------- Liquid refraction where supported (Chromium) ---------- */
  try {
    const brands = navigator.userAgentData && navigator.userAgentData.brands;
    if (brands && brands.some(b => /Chromium/.test(b.brand))) root.classList.add('liquid-ok');
  } catch (e) {}

  /* ---------- Hero split text ---------- */
  $$('[data-split]').forEach(el => {
    const t = el.textContent; el.textContent = '';
    [...t].forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'char'; s.textContent = ch;
      s.style.transitionDelay = (0.15 + i * 0.045 + (el.tagName === 'EM' ? 0.25 : 0)) + 's';
      el.appendChild(s);
    });
  });
  requestAnimationFrame(() => setTimeout(() => $('.hero-title').classList.add('is-in'), 60));

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  const groups = new Map();
  $$('.reveal').forEach(el => {
    const p = el.parentElement; const k = groups.get(p) || 0; groups.set(p, k + 1);
    el.style.setProperty('--d', Math.min(k * 0.07, 0.42) + 's');
    io.observe(el);
  });

  /* ---------- Count up ---------- */
  $$('[data-count]').forEach(el => {
    const end = +el.dataset.count; if (reduce) return;
    const o = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; o.disconnect();
      const t0 = performance.now();
      const tick = t => { const k = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    o.observe(el);
  });

  /* ---------- Cursor light, scroll progress, dock hide ---------- */
  const cl = $('.cursor-light');
  addEventListener('pointermove', e => { cl.style.setProperty('--cx', e.clientX + 'px'); cl.style.setProperty('--cy', e.clientY + 'px'); }, { passive: true });
  const dockWrap = $('.dock-wrap');
  let lastY = scrollY;
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    root.style.setProperty('--sp', h > 0 ? (scrollY / h).toFixed(4) : 0);
    const y = scrollY;
    if (!sheetOpen) dockWrap.classList.toggle('is-hidden', y > lastY && y > 400);
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Dock active pill ---------- */
  const pill = $('.dock-pill');
  const navLinks = $$('.dock-links a');
  const movePill = a => {
    if (!a) { pill.style.opacity = 0; return; }
    pill.style.opacity = 1; pill.style.width = a.offsetWidth + 'px';
    pill.style.transform = `translateX(${a.offsetLeft}px)`;
  };
  const sections = ['top', 'projetos', 'indice', 'arquivo', 'perfil', 'contato'].map(id => document.getElementById(id));
  const sio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      let id = e.target.id; if (id === 'arquivo') id = 'indice';
      navLinks.forEach(a => a.classList.toggle('is-active', a.dataset.nav === id));
      movePill(navLinks.find(a => a.dataset.nav === id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => s && sio.observe(s));
  addEventListener('resize', () => movePill($('.dock-links a.is-active')));

  /* ---------- Tilt + shine ---------- */
  if (matchMedia('(hover:hover)').matches && !reduce) {
    $$('.tilt').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        const m = el.classList.contains('portrait') ? 9 : 4;
        el.style.setProperty('--ry', ((x - .5) * m).toFixed(2) + 'deg');
        el.style.setProperty('--rx', ((.5 - y) * m).toFixed(2) + 'deg');
        el.style.setProperty('--mx', (x * 100) + '%');
        el.style.setProperty('--my', (y * 100) + '%');
      });
      el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
    });
  }

  /* ---------- 3D project ring ---------- */
  const stage = $('#ringStage'), ring = $('#ring'), dots = $('#ringDots');
  const cards = projects.map((p, i) => {
    const c = document.createElement('div');
    c.className = 'ring-card'; c.dataset.i = i;
    c.style.setProperty('--ac', p.accent);
    c.innerHTML = `
      <div class="rc-frame glass">
        <div class="rc-img"><img src="${p.images[0]}" alt="${p.title}" draggable="false" loading="${i < 3 ? 'eager' : 'lazy'}"></div>
        <span class="rc-chip glass">${p.chapter} · ${p.year}</span>
        <span class="rc-open" aria-hidden="true">↗</span>
        <div class="rc-tag"><b>${p.title}</b><small>${pad(i + 1)} / ${pad(N)}</small></div>
      </div>
      <div class="rc-reflect" aria-hidden="true"><img src="${p.images[0]}" alt="" draggable="false" loading="lazy"></div>`;
    ring.appendChild(c);
    const d = document.createElement('button');
    d.setAttribute('role', 'tab'); d.setAttribute('aria-label', p.title);
    d.addEventListener('click', () => goTo(i));
    dots.appendChild(d);
    return c;
  });

  let pos = 0, vel = 0, target = 0, R = 800, STEP = 34, cw = 460, pxPer = 400;
  const layout = () => {
    cw = cards[0].offsetWidth || 460;
    const narrow = innerWidth < 640;
    STEP = narrow ? 40 : 34;
    R = cw / (2 * Math.tan((STEP * Math.PI / 180) / 2)) + (narrow ? 18 : 36);
    pxPer = cw * (narrow ? 0.75 : 0.62);
    ring.style.transform = `translateZ(${-R}px)`;
    render(true);
  };

  let front = -1;
  const render = (force) => {
    for (let i = 0; i < N; i++) {
      let rel = i - pos;
      rel = mod(rel + N / 2, N) - N / 2;
      const a = Math.abs(rel);
      const op = a < 1.5 ? 1 : Math.max(0, 1 - (a - 1.5) / 0.8);
      const c = cards[i];
      c.style.transform = `rotateY(${rel * STEP}deg) translateZ(${R}px)`;
      c.style.opacity = op.toFixed(3);
      c.style.filter = `brightness(${(1 - Math.min(a, 2) * 0.28).toFixed(3)}) saturate(${(1 - Math.min(a, 2) * 0.2).toFixed(3)})`;
      c.style.zIndex = String(100 - Math.round(a * 10));
      c.style.pointerEvents = op < 0.2 ? 'none' : 'auto';
      c.style.setProperty('--f', Math.max(0, 1 - a).toFixed(3));
      c.style.setProperty('--rel', Math.max(-2, Math.min(2, rel)).toFixed(3));
    }
    const f = mod(Math.round(pos), N);
    if (f !== front || force) setFront(f);
  };

  const hud = { num: $('#riNum'), cat: $('#riCat'), title: $('#riTitle'), st: $('#riStatement'), info: $('.ring-info') };
  const setFront = f => {
    const changed = f !== front; front = f;
    const p = projects[f];
    cards.forEach((c, i) => c.classList.toggle('is-front', i === f));
    [...dots.children].forEach((d, i) => d.setAttribute('aria-selected', i === f));
    if (!changed) return;
    hud.num.textContent = `${pad(f + 1)} / ${pad(N)}`;
    hud.cat.textContent = p.category;
    hud.title.textContent = p.title;
    hud.st.textContent = p.statement;
    [hud.title, hud.st, hud.num.parentElement].forEach(el => { el.classList.remove('swap'); void el.offsetWidth; el.classList.add('swap'); });
    root.style.setProperty('--accent', p.accent);
  };

  // spring loop
  let raf = 0, dragging = false;
  const loop = () => {
    if (!dragging) {
      const k = reduce ? 1 : 0.075;
      vel += (target - pos) * k;
      vel *= reduce ? 0 : 0.74;
      pos += vel;
      if (reduce) pos = target;
    }
    render();
    if (dragging || Math.abs(target - pos) > 0.0005 || Math.abs(vel) > 0.0005) raf = requestAnimationFrame(loop);
    else { pos = target; render(); raf = 0; }
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
  const nearestTarget = i => { // shortest path to index i
    const cur = Math.round(target);
    const diff = mod(i - cur + N / 2, N) - N / 2;
    return cur + diff;
  };
  const goTo = i => { target = nearestTarget(i); kick(); userTouched(); };
  const step = d => { target = Math.round(target) + d; kick(); userTouched(); };

  // drag
  let sx = 0, sy = 0, spos = 0, lastX = 0, lastT = 0, moved = 0, downCard = null, axis = null, pid = null;
  stage.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    pid = e.pointerId; sx = lastX = e.clientX; sy = e.clientY; lastT = performance.now();
    spos = pos; moved = 0; vel = 0; axis = e.pointerType === 'mouse' ? 'x' : null;
    downCard = e.target.closest('.ring-card');
    dragging = true; target = pos; kick(); userTouched();
  });
  addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pid) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (!axis) { if (Math.hypot(dx, dy) < 6) return; axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'; if (axis === 'y') { dragging = false; target = Math.round(pos); kick(); return; } }
    moved = Math.max(moved, Math.abs(dx));
    if (moved > 4) stage.classList.add('is-dragging');
    const now = performance.now();
    const ddx = e.clientX - lastX; const dt = Math.max(1, now - lastT);
    vel = -(ddx / pxPer) / dt * 16; // per-frame velocity
    lastX = e.clientX; lastT = now;
    pos = spos - dx / pxPer;
  }, { passive: true });
  const end = e => {
    if (!dragging || (e && e.pointerId !== pid)) return;
    dragging = false; stage.classList.remove('is-dragging');
    if (moved < 6 && downCard) {
      const i = +downCard.dataset.i;
      if (i === front && Math.abs(pos - Math.round(pos)) < 0.2) { target = Math.round(pos); openSheet(i); }
      else goTo(i);
    } else {
      const proj = pos + vel * 9;
      target = Math.round(proj);
    }
    vel = 0; kick();
  };
  addEventListener('pointerup', end);
  addEventListener('pointercancel', end);

  // horizontal trackpad / shift-wheel
  let wheelT = 0;
  stage.addEventListener('wheel', e => {
    const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
    if (!dx) return;
    e.preventDefault(); userTouched();
    dragging = true; pos += dx / (pxPer * 1.4); kick();
    clearTimeout(wheelT);
    wheelT = setTimeout(() => { dragging = false; target = Math.round(pos); kick(); }, 140);
  }, { passive: false });

  stage.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSheet(front); }
  });
  $('#prevBtn').addEventListener('click', () => step(-1));
  $('#nextBtn').addEventListener('click', () => step(1));
  $('#openBtn').addEventListener('click', () => openSheet(front));

  // gentle autoplay while visible and idle
  let idleUntil = 0, inView = false;
  function userTouched() { idleUntil = performance.now() + 9000; }
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; }, { threshold: 0.4 }).observe(stage);
  stage.addEventListener('pointerenter', userTouched);
  if (!reduce) setInterval(() => {
    if (inView && !dragging && !sheetOpen && performance.now() > idleUntil && !document.hidden) { target = Math.round(target) + 1; kick(); }
  }, 4200);

  // index chapters jump to project
  $$('[data-goto]').forEach(a => a.addEventListener('click', () => setTimeout(() => goTo(+a.dataset.goto), 450)));

  addEventListener('resize', layout);
  layout();
  if (document.fonts) document.fonts.ready.then(layout);

  /* ---------- Project sheet ---------- */
  const sheet = $('#sheet'), panel = $('.sheet-panel'), gal = $('#shGallery');
  let sheetOpen = false, current = 0, lastFocus = null;
  const fill = i => {
    const p = projects[i]; current = i;
    $('#shNum').textContent = `${pad(i + 1)} / ${pad(N)}`;
    $('#shCat').textContent = p.category;
    $('#shYear').textContent = p.year;
    $('#shTitle').textContent = p.title;
    $('#shStatement').textContent = p.statement;
    $('#shDesc').textContent = p.description;
    $('#shRole').textContent = p.role;
    gal.innerHTML = p.images.map((src, k) => `<figure style="transition-delay:${0.12 + k * 0.06}s"><img src="${src}" alt="${p.title} — imagem ${k + 1}" loading="${k < 3 ? 'eager' : 'lazy'}" draggable="false"></figure>`).join('');
    gal.scrollLeft = 0; panel.scrollTop = 0;
    root.style.setProperty('--accent', p.accent);
  };
  function openSheet(i) {
    lastFocus = document.activeElement;
    fill(i);
    sheet.hidden = false; sheetOpen = true;
    document.body.style.overflow = 'hidden';
    dockWrap.classList.add('is-hidden');
    requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add('is-open')));
    setTimeout(() => $('.sheet-close').focus({ preventScroll: true }), 300);
  }
  const closeSheet = () => {
    if (!sheetOpen) return;
    sheet.classList.remove('is-open'); sheetOpen = false;
    document.body.style.overflow = '';
    dockWrap.classList.remove('is-hidden');
    goTo(current); setFront(mod(Math.round(target), N));
    root.style.setProperty('--accent', projects[current].accent);
    setTimeout(() => { if (!sheetOpen) sheet.hidden = true; }, 700);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  };
  $$('[data-close]', sheet).forEach(b => b.addEventListener('click', closeSheet));
  const swapSheet = d => {
    const nx = mod(current + d, N);
    panel.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${-d * 40}px)` }], { duration: 220, easing: 'ease-in' }).onfinish = () => {
      fill(nx);
      panel.animate([{ opacity: 0, transform: `translateX(${d * 40}px)` }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
    };
  };
  $('#shPrev').addEventListener('click', () => swapSheet(-1));
  $('#shNext').addEventListener('click', () => swapSheet(1));
  addEventListener('keydown', e => {
    if (!sheetOpen) return;
    if (e.key === 'Escape') closeSheet();
    if (e.key === 'ArrowRight' && !e.target.closest('.sheet-gallery')) swapSheet(1);
    if (e.key === 'ArrowLeft' && !e.target.closest('.sheet-gallery')) swapSheet(-1);
    if (e.key === 'Tab') { // focus trap
      const f = $$('button, a[href]', panel); const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // drag-to-scroll gallery with mouse
  let gx = 0, gl = 0, gd = false;
  gal.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; gd = true; gx = e.clientX; gl = gal.scrollLeft; gal.style.scrollSnapType = 'none'; gal.style.cursor = 'grabbing'; });
  addEventListener('pointermove', e => { if (gd) gal.scrollLeft = gl - (e.clientX - gx); });
  addEventListener('pointerup', () => { if (!gd) return; gd = false; gal.style.scrollSnapType = ''; gal.style.cursor = ''; });
  // swipe down on grabber to close (touch)
  let ty = null;
  panel.addEventListener('touchstart', e => { ty = panel.scrollTop <= 0 ? e.touches[0].clientY : null; }, { passive: true });
  panel.addEventListener('touchmove', e => {
    if (ty == null) return; const dy = e.touches[0].clientY - ty;
    if (dy > 0) { panel.style.transition = 'none'; panel.style.transform = `translateY(${dy * 0.8}px)`; }
  }, { passive: true });
  panel.addEventListener('touchend', e => {
    if (ty == null) return; const dy = e.changedTouches[0].clientY - ty; ty = null;
    panel.style.transition = ''; panel.style.transform = '';
    if (dy > 120) closeSheet();
  });

  /* ---------- Copy e-mail ---------- */
  const toast = $('#toast'); let tt = 0;
  const say = m => { toast.textContent = m; toast.classList.add('is-on'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('is-on'), 2200); };
  $('#copyEmail').addEventListener('click', () => {
    const email = 'valcaciodesign@gmail.com';
    const ok = () => say('E-mail copiado ✓');
    if (navigator.clipboard) navigator.clipboard.writeText(email).then(ok, () => say(email));
    else say(email);
  });
})();
