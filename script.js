  const btn  = document.querySelector('.hamburger');
  const menu = document.getElementById('mobile-menu');

  function closeMenu(){ menu.classList.remove('open'); btn.setAttribute('aria-expanded','false'); }
  function openMenu(){  menu.classList.add('open');    btn.setAttribute('aria-expanded','true');  }

  btn.addEventListener('click', () => menu.classList.contains('open') ? closeMenu() : openMenu());
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });