const btn  = document.querySelector('.hamburger');
const menu = document.getElementById('mobile-menu');

function closeMenu(){ menu.classList.remove('open'); btn.setAttribute('aria-expanded','false'); }
function openMenu(){  menu.classList.add('open');    btn.setAttribute('aria-expanded','true');  }

btn.addEventListener('click', () => menu.classList.contains('open') ? closeMenu() : openMenu());
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

const mobileDdBtn = document.querySelector('.mobile-dd-btn');
const mobileSubmenu = document.querySelector('.mobile-submenu');

 

if (mobileDdBtn && mobileSubmenu) {
  mobileDdBtn.addEventListener('click', () => {
    const open = mobileSubmenu.classList.toggle('open');
    mobileDdBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}
