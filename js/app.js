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
      accent: '#c29a5c', cover: `${BASE}projects/verus/01.jpg`, images: P('verus', ['07', '09', '01', '19', '27', '33', '23', '24']) },
    { id: 'convencao', title: 'Convenção Rodrigues', category: 'Brand Experience', chapter: 'Experiência', year: '2026',
      role: 'Key visual · Ambientação · Desdobramentos', statement: 'Performance é hábito. Cultura é identidade.',
      description: 'Sistema visual para uma convenção de grande escala, conectando energia, performance e cultura em credenciamento, palco, sinalização, uniformes e comunicação digital.',
      accent: '#ff29bd', cover: `${BASE}projects/convencao/04.jpg`, images: P('convencao', ['04', '05', '06', '07', '09']) },
    { id: 'parintins', title: 'Parintins', category: 'Campanha 360º', chapter: 'Campanha', year: '2026',
      role: 'Conceito · KV · Identidade regional', statement: 'Conforto que emociona.',
      description: 'Uma campanha que traduz a potência cultural de Parintins para o varejo, equilibrando o azul e o vermelho em peças, ambientes e brindes com presença regional.',
      accent: '#237bff', cover: `${BASE}projects/parintins/01.jpg`, images: P('parintins', ['01', '02', '03', '05', '06', '10', '11', '12', '09']) },
    { id: 'bravolt', title: 'Bravolt', category: 'Branding & Retail', chapter: 'Varejo', year: '2025',
      role: 'Identidade · Embalagens · Campanha', statement: 'Mais conforto. Mais economia.',
      description: 'Uma marca direta, tecnológica e acessível para o varejo de eletro, com um sistema que ganha escala em embalagens, mídia externa, uniformes, digital e produtos.',
      accent: '#17cbd0', cover: `${BASE}projects/bravolt/01.jpg`, images: P('bravolt', ['01', '02', '03', '11', '23', '29', '35', '20', '09']) },
    { id: 'feijao', title: 'Feijão Autoposto', category: 'Identidade & Experiência', chapter: 'Identidade', year: 'Case',
      role: 'Identidade · Mascote · Uniformes', statement: 'Uma marca próxima, energética e feita para movimentar.',
      description: 'Sistema visual para um autoposto com forte presença popular, combinando vermelho, amarelo e personalidade — da fachada aos uniformes e ao mascote.',
      accent: '#ffcd05', cover: `${BASE}projects/feijao/fachada.webp`, images: P('feijao', ['logo-colorida', 'logo-vermelho-branco', 'logo-vermelho-amarelo', 'logo-amarelo-vermelho', 'fachada', 'equipe', 'corredor', 'manga-longa'], 'webp') },
    { id: 'caloi', title: 'Caloi', category: 'Design Ambiental', chapter: 'Institucional', year: 'Case',
      role: 'Mural · Comunicação interna · Ambientação', statement: 'Cultura e propósito transformados em percurso visual.',
      description: 'Mural corporativo que organiza visão, valores, estratégia e propósito como uma jornada contínua, conectando o universo do ciclismo à cultura organizacional.',
      accent: '#ed1c24', cover: `${BASE}projects/caloi/mural-aplicado.webp`, images: P('caloi', ['mural-aplicado', 'angulo-conceitual', 'detalhe-mural'], 'webp') },
  ];
  // miniaturas leves (800px) para a galeria 3D e a abertura; as imagens cheias ficam para o case
  const thumb = src => src.replace(`${BASE}projects/`, `${BASE}thumbs/`).replace(/\.\w+$/, '.jpg');
  const N = projects.length;
  const pad = n => String(n).padStart(2, '0');
  const mod = (a, n) => ((a % n) + n) % n;

  /* ---------- Liquid refraction where supported (Chromium) ---------- */
  try {
    const brands = navigator.userAgentData && navigator.userAgentData.brands;
    if (brands && brands.some(b => /Chromium/.test(b.brand)) && matchMedia('(hover:hover)').matches) root.classList.add('liquid-ok');
  } catch (e) {}

  /* ---------- Hero split text ---------- */
  let charN = 0;
  $$('[data-split]').forEach(el => {
    const words = el.textContent.split(' '); el.textContent = '';
    words.forEach((wd, wi) => {
      const w = document.createElement('span'); w.className = 'word';
      [...wd].forEach(ch => {
        const s = document.createElement('span');
        s.className = 'char'; s.textContent = ch;
        s.style.transitionDelay = (0.5 + (charN++) * 0.022) + 's';
        w.appendChild(s);
      });
      el.appendChild(w);
      if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
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

  /* ---------- Scroll progress, dock hide ---------- */
  const dockWrap = $('.dock-wrap');
  let lastY = scrollY;
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    root.style.setProperty('--sp', h > 0 ? (scrollY / h).toFixed(4) : 0);
    const y = scrollY;
    if (!sheetOpen) dockWrap.classList.toggle('is-hidden', y > lastY && y > 400);
    lastY = y;
    heroKick(); scrub();
  };
  addEventListener('scroll', onScroll, { passive: true });

  /* ---------- HERO: work floating in 3D space ---------- */
  const hero = $('#hero'), space = $('#space'), heroCenter = $('.hero-center');
  const world = document.createElement('div'); world.className = 'space-world'; space.appendChild(world);
  const T = [ // [projectIndex, imageIndex, fx, fy, z, w]
    [0, 0, -0.36, -0.27, -150, 300], [1, 0, 0.35, -0.29, -300, 320], [2, 0, -0.40, 0.27, -80, 290], [3, 0, 0.39, 0.29, -120, 300],
    [4, 0, -0.13, -0.40, -700, 270], [5, 0, 0.15, 0.41, -650, 290], [0, 3, -0.31, 0.01, -950, 300], [2, 3, 0.31, 0.0, -1000, 320],
    [1, 2, 0.02, -0.37, -1350, 280], [3, 5, -0.04, 0.39, -1250, 270], [4, 3, -0.49, -0.04, -480, 240], [5, 1, 0.50, -0.07, -560, 250],
  ];
  const tiles = T.map(([pi, ii, fx, fy, z, w], k) => {
    const p = projects[pi];
    const el = document.createElement('div');
    el.className = 'tile';
    el.innerHTML = `<div class="tile-in glass"><img src="${thumb(ii ? p.images[ii] || p.cover : p.cover)}" alt="" loading="${k < 6 ? 'eager' : 'lazy'}" draggable="false"></div>`;
    const inner = el.firstChild;
    inner.style.setProperty('--dur', (7 + (k % 5) * 1.3) + 's');
    inner.style.setProperty('--del', (-k * 1.7) + 's');
    const depth = Math.max(0, (-z - 500) / 260);
    inner.style.filter = `blur(${depth.toFixed(2)}px) brightness(${(1 - Math.min(0.45, -z / 2600)).toFixed(2)})`;
    el.addEventListener('click', () => openSheet(pi));
    world.appendChild(el);
    return { el, fx, fy, z, w };
  });
  const layoutTiles = () => {
    const W = innerWidth, H = innerHeight, small = W < 700;
    tiles.forEach(t => {
      const k = (1000 - t.z) / 1000; // keep screen position independent of depth
      t.x = t.fx * W * k * (small ? 1.25 : 1); t.y = t.fy * H * k;
      t.el.style.setProperty('--w', (t.w * (small ? 0.5 : W < 1100 ? 0.75 : 1)) + 'px');
    });
  };
  let mx = 0, my = 0, cmx = 0, cmy = 0, hp = 0, chp = 0, heroRaf = 0;
  const heroFrame = () => {
    cmx += (mx - cmx) * 0.06; cmy += (my - cmy) * 0.06; chp += (hp - chp) * 0.12;
    const zPush = chp * 1100;
    world.style.transform = `translateZ(${zPush.toFixed(1)}px) rotateY(${(cmx * 7).toFixed(3)}deg) rotateX(${(-cmy * 5).toFixed(3)}deg)`;
    for (const t of tiles) {
      const ez = t.z + zPush;
      const op = ez < 350 ? 1 : Math.max(0, 1 - (ez - 350) / 400);
      t.el.style.transform = `translate3d(${t.x.toFixed(1)}px,${t.y.toFixed(1)}px,${t.z}px) translate(-50%,-50%)`;
      t.el.style.opacity = op.toFixed(3);
      t.el.style.visibility = op < 0.01 ? 'hidden' : 'visible';
    }
    const q = Math.min(1, chp * 1.7);
    heroCenter.style.opacity = (1 - q).toFixed(3);
    heroCenter.style.transform = `translateY(${(-q * 60).toFixed(1)}px) scale(${(1 - q * 0.08).toFixed(4)})`;
    heroCenter.style.filter = q > 0.01 ? `blur(${(q * 10).toFixed(1)}px)` : '';
    if (Math.abs(mx - cmx) > 0.001 || Math.abs(my - cmy) > 0.001 || Math.abs(hp - chp) > 0.0005) heroRaf = requestAnimationFrame(heroFrame);
    else heroRaf = 0;
  };
  function heroKick() {
    const r = hero.getBoundingClientRect();
    hp = reduce ? 0 : Math.min(1, Math.max(0, -r.top / (r.height * 0.9)));
    if (!heroRaf && r.bottom > 0) heroRaf = requestAnimationFrame(heroFrame);
  }
  if (!reduce) addEventListener('pointermove', e => {
    mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; heroKick();
  }, { passive: true });
  addEventListener('resize', () => { layoutTiles(); heroKick(); });
  layoutTiles(); heroKick();

  /* ---------- Glass lens over hero (desktop) ---------- */
  const lens = $('#lens'), lensInner = $('#lensInner');
  if (matchMedia('(hover:hover)').matches && !reduce) {
    const clone = heroCenter.cloneNode(true);
    clone.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
    clone.querySelector('.hero-title').classList.add('is-in');
    lensInner.appendChild(clone);
    const R = 110, S = 1.45;
    let lx = 0, ly = 0, tx = 0, ty = 0, lensRaf = 0, inHero = false;
    const sizeInner = () => { lensInner.style.width = hero.offsetWidth + 'px'; lensInner.style.height = hero.offsetHeight + 'px'; };
    const lensFrame = () => {
      lx += (tx - lx) * 0.18; ly += (ty - ly) * 0.18;
      lens.style.transform = `translate(${(lx - R).toFixed(1)}px,${(ly - R).toFixed(1)}px)`;
      lensInner.style.transform = `translate(${(R - lx * S).toFixed(1)}px,${(R - ly * S).toFixed(1)}px) scale(${S})`;
      clone.style.opacity = heroCenter.style.opacity;
      lens.style.opacity = inHero && (+heroCenter.style.opacity || 1) > 0.5 ? '' : '0';
      if (Math.abs(tx - lx) > 0.2 || Math.abs(ty - ly) > 0.2) lensRaf = requestAnimationFrame(lensFrame); else lensRaf = 0;
    };
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      tx = e.clientX - r.left; ty = e.clientY - r.top;
      if (!inHero) { inHero = true; lx = tx; ly = ty; sizeInner(); lens.classList.add('is-on'); }
      if (!lensRaf) lensRaf = requestAnimationFrame(lensFrame);
    });
    hero.addEventListener('pointerleave', () => { inHero = false; lens.classList.remove('is-on'); });
    addEventListener('resize', sizeInner);
  }

  /* ---------- Manifesto scroll-scrub ---------- */
  const scrubEl = $('#scrub'), manifesto = $('#sobre');
  const HL = ['dez', 'anos', 'sistemas', 'visuais.', 'impacto,'];
  scrubEl.innerHTML = scrubEl.textContent.trim().split(/\s+/).map(w => `<span class="w${HL.includes(w) ? ' hl' : ''}">${w}</span>`).join(' ');
  const words = $$('.w', scrubEl);
  let lastOn = -1;
  function scrub() {
    const r = manifesto.getBoundingClientRect();
    const total = r.height - innerHeight;
    const p = Math.min(1, Math.max(0, (-r.top + innerHeight * 0.35) / (total + innerHeight * 0.1)));
    const on = reduce ? words.length : Math.round(p * words.length * 1.1);
    if (on === lastOn) return; lastOn = on;
    words.forEach((w, i) => w.classList.toggle('on', i < on));
  }
  scrub();

  /* ---------- Magnetic buttons ---------- */
  if (matchMedia('(hover:hover)').matches && !reduce) {
    $$('.magnetic').forEach(el => {
      el.style.transition = 'transform .45s cubic-bezier(.34,1.56,.64,1),box-shadow .3s,background .3s,translate .5s cubic-bezier(.34,1.56,.64,1)';
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.translate = `${((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1)}px`;
      });
      el.addEventListener('pointerleave', () => { el.style.translate = '0 0'; });
    });
  }

  /* ---------- Dock active pill ---------- */
  const pill = $('.dock-pill');
  const navLinks = $$('.dock-links a');
  const movePill = a => {
    if (!a) { pill.style.opacity = 0; return; }
    pill.style.opacity = 1; pill.style.width = a.offsetWidth + 'px';
    pill.style.transform = `translateX(${a.offsetLeft}px)`;
  };
  const sections = ['hero', 'sobre', 'projetos', 'arquivo', 'pacotes', 'trajetoria', 'perfil', 'contato'].map(id => document.getElementById(id));
  const sio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      let id = e.target.id; if (id === 'arquivo' || id === 'trajetoria' || id === 'pacotes') id = 'perfil';
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
        const m = el.classList.contains('mini-portrait') ? 14 : el.classList.contains('card') ? 4 : 9;
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
        <div class="rc-img"><img src="${thumb(p.cover)}" alt="${p.title}" draggable="false" loading="${i < 3 ? 'eager' : 'lazy'}"></div>
        <span class="rc-chip glass">${p.chapter} · ${p.year}</span>
        <span class="rc-open" aria-hidden="true">↗</span>
        <i class="rc-dim" aria-hidden="true"></i>
        <div class="rc-tag"><b>${p.title}</b><small>${pad(i + 1)} / ${pad(N)}</small></div>
      </div>
      <div class="rc-reflect" aria-hidden="true"><img src="${thumb(p.cover)}" alt="" draggable="false" loading="lazy"></div>`;
    ring.appendChild(c);
    const d = document.createElement('button');
    d.setAttribute('role', 'tab'); d.setAttribute('aria-label', p.title);
    d.addEventListener('click', () => goTo(i));
    dots.appendChild(d);
    return c;
  });

  const parts = cards.map(c => ({ dim: $('.rc-dim', c), img: $('.rc-img img', c) }));
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
      c.style.visibility = op < 0.01 ? 'hidden' : 'visible';
      parts[i].dim.style.opacity = (Math.min(a, 2) * 0.3).toFixed(3);
      parts[i].img.style.transform = `scale(${(1.12 - Math.max(0, 1 - a) * 0.08).toFixed(4)}) translateX(${(Math.max(-2, Math.min(2, rel)) * -14).toFixed(1)}px)`;
      c.style.zIndex = String(100 - Math.round(a * 10));
      c.style.pointerEvents = op < 0.2 ? 'none' : 'auto';
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

  addEventListener('resize', layout);
  layout();
  if (document.fonts) document.fonts.ready.then(layout);

  /* ---------- Project viewer: info rail + justified mosaic + lightbox ---------- */
  const sheet = $('#sheet'), panel = $('.sheet-panel'), rowsEl = $('#shRows');
  let sheetOpen = false, current = 0, lastFocus = null;
  const DIM = {"projects/bravolt/01.jpg":1.776,"projects/bravolt/02.jpg":1.672,"projects/bravolt/03.jpg":1.776,"projects/bravolt/09.jpg":1.776,"projects/bravolt/11.jpg":1.333,"projects/bravolt/20.jpg":1.339,"projects/bravolt/23.jpg":1.136,"projects/bravolt/29.jpg":1.332,"projects/bravolt/35.jpg":1.646,"projects/caloi/angulo-conceitual.webp":1.729,"projects/caloi/detalhe-mural.webp":3.413,"projects/caloi/mural-aplicado.webp":1.73,"projects/convencao/04.jpg":1.776,"projects/convencao/05.jpg":1.471,"projects/convencao/06.jpg":1.487,"projects/convencao/07.jpg":1.468,"projects/convencao/09.jpg":1.471,"projects/feijao/corredor.webp":0.8,"projects/feijao/equipe.webp":1.6,"projects/feijao/fachada.webp":1.6,"projects/feijao/logo-amarelo-vermelho.webp":1.432,"projects/feijao/logo-colorida.webp":1.288,"projects/feijao/logo-vermelho-amarelo.webp":1.432,"projects/feijao/logo-vermelho-branco.webp":1.432,"projects/feijao/manga-longa.webp":0.832,"projects/parintins/01.jpg":1.79,"projects/parintins/02.jpg":0.753,"projects/parintins/03.jpg":0.783,"projects/parintins/05.jpg":1.333,"projects/parintins/06.jpg":1.333,"projects/parintins/09.jpg":1.79,"projects/parintins/10.jpg":1.483,"projects/parintins/11.jpg":1.483,"projects/parintins/12.jpg":1.468,"projects/verus/01.jpg":1.778,"projects/verus/07.jpg":1.778,"projects/verus/09.jpg":1.778,"projects/verus/19.jpg":1.778,"projects/verus/23.jpg":1.778,"projects/verus/24.jpg":1.778,"projects/verus/27.jpg":1.778,"projects/verus/33.jpg":1.778};
  const arOf = src => DIM[src.slice(BASE.length)] || 1.6;
  const buildRows = imgs => {
    const small = innerWidth < 760;
    const rows = []; let row = [], sum = 0;
    // target = soma de proporções por linha: menor = imagens maiores
    const target = () => small ? 1.5 : rows.length === 0 ? 1.5 : rows.length % 3 === 0 ? 1.7 : 3.1;
    imgs.forEach((src, k) => {
      const ar = arOf(src); row.push({ src, k, ar }); sum += ar;
      if (sum >= target()) { rows.push({ row, sum, t: target() }); row = []; sum = 0; }
    });
    if (row.length) { const t = target(); rows.push({ row, sum, t, last: true }); }
    return rows;
  };
  let rowsMode = null;
  const renderRows = () => {
    const p = projects[current];
    rowsMode = innerWidth < 760;
    rowsEl.innerHTML = buildRows(p.images).map(R =>
      `<div class="vrow"${R.last && R.sum < R.t ? ` style="max-width:${Math.max(45, Math.min(100, R.sum / R.t * 100)).toFixed(1)}%"` : ''}>` +
      R.row.map(it => `<button class="vfig" type="button" data-k="${it.k}" style="flex:${it.ar} 1 0;aspect-ratio:${it.ar};transition-delay:${(0.1 + Math.min(it.k, 8) * 0.05).toFixed(2)}s" aria-label="Ampliar imagem ${it.k + 1} de ${p.images.length}"><img src="${it.src}" alt="${p.title} — imagem ${it.k + 1}" loading="${it.k < 4 ? 'eager' : 'lazy'}" draggable="false"></button>`).join('') +
      '</div>').join('');
  };
  rowsEl.addEventListener('load', e => { // imagens novas sem proporção cadastrada
    const img = e.target, key = (img.getAttribute('src') || '').slice(BASE.length);
    if (img.tagName !== 'IMG' || DIM[key] || !img.naturalHeight) return;
    DIM[key] = +(img.naturalWidth / img.naturalHeight).toFixed(3); renderRows();
  }, true);
  rowsEl.addEventListener('click', e => { const f = e.target.closest('.vfig'); if (f) lbOpenAt(+f.dataset.k); });
  addEventListener('resize', () => { if (sheetOpen && rowsMode !== (innerWidth < 760)) renderRows(); });

  const fill = i => {
    const p = projects[i]; current = i;
    $('#shNum').textContent = `${pad(i + 1)} / ${pad(N)}`;
    $('#shCat').textContent = p.category;
    $('#shTitle').textContent = p.title;
    $('#shStatement').textContent = p.statement;
    $('#shDesc').textContent = p.description;
    $('#shRole').innerHTML = p.role.split(' · ').map(r => `<span>${r}</span>`).join('');
    $('#shYear').textContent = p.year;
    $('#shYearRow').hidden = !/^\d{4}$/.test(p.year);
    $('#shCount').textContent = `${p.images.length} imagens`;
    renderRows();
    panel.scrollTop = 0;
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
  $('#sheetCta').addEventListener('click', () => closeSheet());
  const swapSheet = d => {
    const nx = mod(current + d, N);
    if (reduce) { fill(nx); return; }
    panel.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'ease-in' }).onfinish = () => {
      sheet.classList.remove('is-open'); fill(nx); void panel.offsetWidth;
      sheet.classList.add('is-open');
      panel.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, easing: 'ease-out' });
    };
  };
  $('#shPrev').addEventListener('click', () => swapSheet(-1));
  $('#shNext').addEventListener('click', () => swapSheet(1));

  // lightbox
  const lb = $('#lb'), lbImg = $('#lbImg'), lbCount = $('#lbCount');
  let lbOpen = false, lbK = 0;
  const lbShow = (k, d = 0) => {
    const p = projects[current];
    lbK = mod(k, p.images.length);
    lbImg.src = p.images[lbK]; lbImg.alt = `${p.title} — imagem ${lbK + 1}`;
    lbCount.textContent = `${p.title} · ${pad(lbK + 1)} / ${pad(p.images.length)}`;
    if (!reduce) lbImg.animate([{ opacity: 0, transform: `translateX(${d * 40}px) scale(.98)` }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' });
  };
  function lbOpenAt(k) {
    lb.hidden = false; lbOpen = true; lbShow(k);
    requestAnimationFrame(() => lb.classList.add('is-open'));
    $('#lbClose').focus({ preventScroll: true });
  }
  const lbClose = () => {
    if (!lbOpen) return;
    lbOpen = false; lb.classList.remove('is-open');
    setTimeout(() => { if (!lbOpen) lb.hidden = true; }, 320);
    const f = $(`.vfig[data-k="${lbK}"]`, rowsEl); if (f) f.focus({ preventScroll: true });
  };
  $('#lbClose').addEventListener('click', lbClose);
  $('#lbPrev').addEventListener('click', () => lbShow(lbK - 1, -1));
  $('#lbNext').addEventListener('click', () => lbShow(lbK + 1, 1));
  let lbX = null;
  lb.addEventListener('pointerdown', e => { lbX = e.clientX; });
  lb.addEventListener('pointerup', e => {
    if (lbX == null) return; const dx = e.clientX - lbX; lbX = null;
    if (Math.abs(dx) > 50) lbShow(lbK + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    else if (e.target === lb) lbClose();
  });

  addEventListener('keydown', e => {
    if (lbOpen) {
      if (e.key === 'Escape') lbClose();
      else if (e.key === 'ArrowRight') lbShow(lbK + 1, 1);
      else if (e.key === 'ArrowLeft') lbShow(lbK - 1, -1);
      else if (e.key === 'Tab') {
        const f = $$('button', lb); const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
      return;
    }
    if (!sheetOpen) return;
    if (e.key === 'Escape') closeSheet();
    else if (e.key === 'ArrowRight') swapSheet(1);
    else if (e.key === 'ArrowLeft') swapSheet(-1);
    else if (e.key === 'Tab') {
      const f = $$('button, a[href]', panel); const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Journey: 3D timeline (line + dots) ---------- */
  {
    // Troque `img` pelas fotos de cada época (ex.: assets/timeline/2015.jpg). As atuais são provisórias.
    const TL = [
      { from: 2015, to: 2018, period: '2015 — 2018', role: 'Designer Gráfico Jr', company: 'Rebool Camisaria', desc: 'Artes para camisetas personalizadas, mídias digitais, impressas e peças gráficas.', img: `${BASE}projects/caloi/angulo-conceitual.webp` },
      { from: 2019, to: 2019, period: '2019', role: 'Designer Gráfico', company: 'Seven Graf', desc: 'Materiais para comunicação visual, mídias digitais e impressas, com atendimento ao cliente.', img: `${BASE}projects/verus/09.jpg` },
      { from: 2020, to: 2024, period: '2020 — 2024', role: 'Designer Gráfico Pleno / Social Media', company: 'Rebool Camisaria', desc: 'Campanhas, branding e criativos para tráfego pago. Supervisão de marketing e social media.', img: `${BASE}projects/bravolt/03.jpg` },
      { from: 2025, to: null, period: '2025 — agora', role: 'Designer Sênior', company: 'Rodrigues Colchões', desc: 'Direção e criação de campanhas para varejo, mídias digitais, e-commerce e comunicação visual.', also: ['Diretor de Arte · Vibeup Marketing · 2025 — agora', 'Designer Gráfico · Vanguarda Martech · abr — out 2026'], img: `${BASE}projects/convencao/06.jpg` },
    ];
    const Y0 = 2015, Y1 = 2026, NY = Y1 - Y0 + 1, STEP_T = 10;
    const stageT = $('#tlStage'), ringT = $('#tlRing'), ghost = $('#tlGhost');
    const el = { period: $('#tlPeriod'), step: $('#tlStep'), role: $('#tlRole'), company: $('#tlCompany'), desc: $('#tlDesc'), also: $('#tlAlso') };
    const jobOf = i => TL.findIndex(j => Y0 + i >= j.from && Y0 + i <= (j.to || Y1));
    const bgs = TL.map(j => { const b = document.createElement('i'); b.style.backgroundImage = `url("${j.img}")`; $('#tlBg').appendChild(b); return b; });
    const nodes = Array.from({ length: NY }, (_, i) => {
      const n = document.createElement('div');
      n.className = 'tl-node' + (TL.some(j => j.from === Y0 + i) ? ' is-major' : '');
      n.dataset.i = i;
      n.innerHTML = `<span class="tl-seg"></span><span class="tl-dot"></span><span class="tl-year">${Y0 + i}</span>`;
      ringT.appendChild(n);
      return n;
    });

    let p = 2025 - Y0, v = 0, tg = p, Rt = 900, nw = 150, sel = -1, job = -1, rafT = 0, drag = false;
    const clamp = x => Math.max(0, Math.min(NY - 1, x));
    const select = i => {
      sel = i;
      const j = jobOf(i);
      nodes.forEach((n, k) => { n.classList.toggle('is-sel', k === i); n.classList.toggle('in-range', jobOf(k) === j); });
      ghost.textContent = Y0 + i;
      stageT.setAttribute('aria-valuenow', Y0 + i);
      stageT.setAttribute('aria-valuetext', `${Y0 + i}: ${TL[j].role}, ${TL[j].company}`);
      if (j === job) return; job = j;
      el.period.textContent = TL[j].period; el.step.textContent = `${pad(j + 1)} / ${pad(TL.length)}`;
      el.role.textContent = TL[j].role; el.company.textContent = TL[j].company; el.desc.textContent = TL[j].desc;
      el.also.innerHTML = (TL[j].also || []).map(a => `<li>${a}</li>`).join(''); el.also.hidden = !TL[j].also;
      [el.role, el.company, el.period.parentElement].forEach(x => { x.classList.remove('swap'); void x.offsetWidth; x.classList.add('swap'); });
      bgs.forEach((b, k) => b.classList.toggle('on', k === j));
    };
    const draw = () => {
      for (let i = 0; i < NY; i++) {
        const rel = i - p, a = Math.abs(rel);
        nodes[i].style.transform = `rotateY(${(rel * STEP_T).toFixed(3)}deg) translateZ(${Rt.toFixed(1)}px)`;
        nodes[i].style.opacity = (a < 3 ? 1 : Math.max(0, 1 - (a - 3) / 3)).toFixed(3);
        nodes[i].style.pointerEvents = a > 5.5 ? 'none' : 'auto';
      }
      const s = clamp(Math.round(p));
      if (s !== sel) select(s);
    };
    const tick = () => {
      if (!drag) {
        if (reduce) { p = tg; v = 0; }
        else { v += (tg - p) * 0.08; v *= 0.72; p += v; }
      }
      draw();
      if (drag || Math.abs(tg - p) > 0.0005 || Math.abs(v) > 0.0005) rafT = requestAnimationFrame(tick);
      else { p = tg; draw(); rafT = 0; }
    };
    const go = () => { if (!rafT) rafT = requestAnimationFrame(tick); };
    const to = i => { tg = clamp(i); go(); };
    const size = () => {
      nw = nodes[0].offsetWidth || 150;
      Rt = nw / (2 * Math.tan(STEP_T * Math.PI / 360));
      ringT.style.transform = `translateZ(${(-Rt).toFixed(1)}px)`;
      draw();
    };

    let x0 = 0, y0 = 0, p0 = 0, lx = 0, lt = 0, mv = 0, hit = null, ax = null, id = null;
    stageT.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      id = e.pointerId; x0 = lx = e.clientX; y0 = e.clientY; lt = performance.now();
      p0 = p; mv = 0; v = 0; ax = e.pointerType === 'mouse' ? 'x' : null;
      hit = e.target.closest('.tl-node'); drag = true; tg = p; go();
    });
    addEventListener('pointermove', e => {
      if (!drag || e.pointerId !== id) return;
      const dx = e.clientX - x0, dy = e.clientY - y0;
      if (!ax) { if (Math.hypot(dx, dy) < 6) return; ax = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'; if (ax === 'y') { drag = false; to(Math.round(p)); return; } }
      mv = Math.max(mv, Math.abs(dx));
      if (mv > 4) stageT.classList.add('is-dragging');
      const now = performance.now();
      v = -((e.clientX - lx) / nw) / Math.max(1, now - lt) * 16;
      lx = e.clientX; lt = now;
      p = Math.max(-0.4, Math.min(NY - 0.6, p0 - dx / nw));
    }, { passive: true });
    const up = e => {
      if (!drag || (e && e.pointerId !== id)) return;
      drag = false; stageT.classList.remove('is-dragging');
      if (mv < 6 && hit) to(+hit.dataset.i); else to(Math.round(p + v * 8));
      v = 0;
    };
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);
    let wt = 0;
    stageT.addEventListener('wheel', e => {
      const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
      if (!dx) return;
      e.preventDefault(); drag = true; p = Math.max(-0.4, Math.min(NY - 0.6, p + dx / (nw * 1.5))); go();
      clearTimeout(wt); wt = setTimeout(() => { drag = false; to(Math.round(p)); }, 140);
    }, { passive: false });
    stageT.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); to(Math.round(tg) + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); to(Math.round(tg) - 1); }
      else if (e.key === 'Home') { e.preventDefault(); to(0); }
      else if (e.key === 'End') { e.preventDefault(); to(NY - 1); }
    });
    // buttons jump between career stages
    $('#tlPrev').addEventListener('click', () => {
      const cur = Math.round(tg), j = jobOf(cur), start = TL[j].from - Y0;
      to(cur > start ? start : j > 0 ? TL[j - 1].from - Y0 : 0);
    });
    $('#tlNext').addEventListener('click', () => {
      const j = jobOf(Math.round(tg));
      to(j < TL.length - 1 ? TL[j + 1].from - Y0 : NY - 1);
    });
    addEventListener('resize', size);
    size();
  }

  /* ---------- Plans: expand / collapse ---------- */
  {
    const tg = $('#plansToggle'), body = $('#plansBody'), label = $('b', tg);
    let doneT = 0;
    const setPlans = open => {
      tg.setAttribute('aria-expanded', open);
      label.textContent = open ? 'Fechar pacotes' : 'Ver pacotes e valores';
      clearTimeout(doneT); body.classList.remove('is-done');
      body.classList.toggle('is-open', open);
      if (open) doneT = setTimeout(() => body.classList.add('is-done'), 850); // libera o brilho dos cartões
    };
    tg.addEventListener('click', () => setPlans(tg.getAttribute('aria-expanded') !== 'true'));
    $$('a[href="#pacotes"]').forEach(a => a.addEventListener('click', () => setPlans(true)));
    if (location.hash === '#pacotes') setPlans(true);
  }

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
