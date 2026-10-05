(() => {
  'use strict';

  // anti-clickjacking (GitHub Pages não deixa configurar cabeçalhos)
  if (window.top !== window.self) { try { window.top.location = window.self.location; } catch (e) { document.body.innerHTML = ''; } }

  const root = document.documentElement;
  root.classList.add('js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = ms => new Promise(r => setTimeout(r, ms));

  /* ---- menu mobile ---- */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open);
  });
  const closeMenu = () => { navLinks.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); };

  /* ---- seções com entrada animada ---- */
  const secoes = [...document.querySelectorAll('main > section:not(.hero)')];
  secoes.forEach(s => s.classList.add('rv'));
  let busy = true; // fica true durante a abertura e as trocas de aba

  const io = new IntersectionObserver(es => {
    if (busy) return;
    es.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.12 });
  secoes.forEach(s => io.observe(s));

  const revelaVisiveis = () => secoes.forEach(s => {
    const r = s.getBoundingClientRect();
    if (r.top < innerHeight * 0.85 && r.bottom > 0) s.classList.add('in');
  });

  /* ---- aba ativa (laranja) ---- */
  const links = [...document.querySelectorAll('.nav-links a:not(.btn), .foot-links a')]
    .filter(a => a.getAttribute('href').startsWith('#'));
  const ids = [...new Set(links.map(a => a.getAttribute('href').slice(1)))];
  const alvos = ids.map(id => document.getElementById(id)).filter(Boolean);
  const todas = [...document.querySelectorAll('main > section[id]')];

  let ticking = false;
  const atualizaAtiva = () => {
    ticking = false;
    const linha = 70 + innerHeight * 0.35;
    let atual = null;
    todas.forEach(s => { if (s.getBoundingClientRect().top <= linha) atual = s; });
    const id = atual && alvos.includes(atual) ? atual.id : null;
    links.forEach(a => {
      const on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('active', on);
      on ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current');
    });
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(atualizaAtiva); } }, { passive: true });

  /* ---- cortina: saída → troca → abertura ---- */
  const cortina = document.getElementById('curtain');
  const estado = c => { cortina.className = 'curtain' + (c ? ' ' + c : ''); };

  async function irPara(alvo) {
    if (busy) return;
    busy = true;
    estado('cover');                 // SAÍDA: cortina fecha
    await wait(480);
    if (alvo.id === 'topo') window.scrollTo({ top: 0, behavior: 'instant' });
    else alvo.scrollIntoView({ behavior: 'instant', block: 'start' });
    secoes.forEach(s => s.classList.remove('in'));
    void document.body.offsetHeight;
    await wait(80);
    estado('leave');                 // ABERTURA: cortina abre
    await wait(120);
    revelaVisiveis();                // conteúdo sobe suave
    atualizaAtiva();
    await wait(480);
    estado('');
    busy = false;
  }

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    const alvo = document.getElementById(a.getAttribute('href').slice(1));
    if (!alvo) return;
    e.preventDefault();
    closeMenu();
    if (reduce) { alvo.scrollIntoView({ block: 'start' }); return; }
    history.pushState(null, '', a.getAttribute('href'));
    irPara(alvo);
  });

  /* ---- abertura inicial ---- */
  async function abertura() {
    if (reduce) { busy = false; revelaVisiveis(); atualizaAtiva(); return; }
    estado('cover');
    cortina.style.transition = 'none';
    void cortina.offsetWidth;
    cortina.style.transition = '';
    await wait(350);
    estado('leave');
    await wait(450);
    estado('');
    busy = false;
    revelaVisiveis();
    atualizaAtiva();
  }
  if (document.readyState === 'complete') abertura(); else addEventListener('load', abertura);
})();
