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





// ===== Simple Carousel (arrows, dots, swipe) =====
function makeCarousel(root){
  const track = root.querySelector('[data-carousel-track]');
  const slides = Array.from(track.children);
  const prevBtn = root.querySelector('[data-carousel-prev]');
  const nextBtn = root.querySelector('[data-carousel-next]');
  const dotsWrap = root.querySelector('[data-carousel-dots]');

  // Build dots
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', `Go to slide ${i+1}`);
    if (i === 0) b.setAttribute('aria-selected', 'true');
    dotsWrap.appendChild(b);
  });
  const dots = Array.from(dotsWrap.children);

  let index = 0;
  let w = root.clientWidth;

  function updateWidth(){ w = root.clientWidth; goTo(index, false); }
  window.addEventListener('resize', updateWidth);

  function goTo(i, animate = true){
    index = (i + slides.length) % slides.length;
    track.style.transition = animate ? 'transform .35s ease' : 'none';
    track.style.transform = `translateX(${-index * w}px)`;
    dots.forEach((d, k) => d.setAttribute('aria-selected', k === index ? 'true' : 'false'));
  }

  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

  // Keyboard support
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
  });

  // Touch swipe
  let startX = 0, dx = 0, isDown = false, isMoving = false;

  root.addEventListener('pointerdown', (e) => {
    isDown = true; isMoving = true; startX = e.clientX; dx = 0;
    track.style.transition = 'none';
    root.setPointerCapture(e.pointerId);
  });
  root.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    dx = e.clientX - startX;
    track.style.transform = `translateX(${ -index * w + dx }px)`;
  });
  root.addEventListener('pointerup', (e) => {
    if (!isDown) return;
    isDown = false;
    // snap threshold: 20% of width
    const threshold = w * 0.2;
    if (dx > threshold) goTo(index - 1);
    else if (dx < -threshold) goTo(index + 1);
    else goTo(index);
    isMoving = false;
    root.releasePointerCapture?.(e.pointerId);
  });
  root.addEventListener('pointercancel', () => { if (isMoving) goTo(index); isDown = false; });

  // Init
  updateWidth();
}

// Initialize all carousels on the page
document.querySelectorAll('[data-carousel]').forEach(makeCarousel);
