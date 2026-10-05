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

  /* ---- troca de aba: saída suave -> rolagem suave -> entrada ---- */
  let indo = false;
  const fimScroll = () => new Promise(res => {
    let last = -1, n = 0;
    const t = setInterval(() => {
      if (scrollY === last) { if (++n >= 3) { clearInterval(t); res(); } }
      else { n = 0; last = scrollY; }
    }, 60);
    setTimeout(() => { clearInterval(t); res(); }, 2500);
  });

  async function irPara(alvo) {
    if (indo) return;
    indo = true;
    // SAÍDA: o que está na tela some subindo
    const saindo = secoes.filter(s => {
      const r = s.getBoundingClientRect();
      return s !== alvo && r.top < innerHeight && r.bottom > 0;
    });
    saindo.forEach(s => s.classList.add('sai'));
    await wait(280);
    alvo.classList.remove('in');
    // rolagem suave até a seção
    if (alvo.id === 'topo') window.scrollTo({ top: 0, behavior: 'smooth' });
    else alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
    await fimScroll();
    // ENTRADA: conteúdo novo sobe suave
    saindo.forEach(s => { s.classList.remove('sai'); s.classList.remove('in'); });
    revelaVisiveis();
    atualizaAtiva();
    indo = false;
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

  /* ---- carregamento inicial ---- */
  const iniciar = () => { busy = false; revelaVisiveis(); atualizaAtiva(); };
  if (document.readyState === 'complete') iniciar(); else addEventListener('load', iniciar);
})();
