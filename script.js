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


document.querySelectorAll('[data-carousel]').forEach(makeCarousel);

function makeCarousel(root) {
  const track    = root.querySelector('[data-carousel-track]');
  const slides   = Array.from(track?.children || []);
  const prevBtn  = root.querySelector('[data-carousel-prev]');
  const nextBtn  = root.querySelector('[data-carousel-next]');
  const dotsWrap = root.querySelector('[data-carousel-dots]');

  if (!track || !slides.length || !prevBtn || !nextBtn || !dotsWrap) {
    console.warn('Carousel: missing element(s).'); return;
  }

  // Build dots
  dotsWrap.innerHTML = '';
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', `Go to slide ${i + 1}`);
    if (i === 0) b.setAttribute('aria-selected', 'true');
    dotsWrap.appendChild(b);
  });
  const dots = Array.from(dotsWrap.children);

  let index = 0;

  const apply = (animate = true, extraPct = 0) => {
    track.style.transition = animate ? 'transform .35s ease' : 'none';
    // base is -index * 100%, plus an optional drag offset in %
    const basePct = -index * 100 + extraPct;
    track.style.transform = `translate3d(${basePct}%, 0, 0)`;
    if (extraPct === 0) {
      dots.forEach((d, k) => d.setAttribute('aria-selected', k === index ? 'true' : 'false'));
    }
  };

  const goTo = (i, animate = true) => {
    index = (i + slides.length) % slides.length;
    apply(animate, 0);
  };

  // Prevent form submit side-effects
  prevBtn.type = prevBtn.type || 'button';
  nextBtn.type = nextBtn.type || 'button';

  // Arrow clicks
  prevBtn.addEventListener('click', (e) => { e.preventDefault(); goTo(index - 1, true); });
  nextBtn.addEventListener('click', (e) => { e.preventDefault(); goTo(index + 1, true); });

  // Dot clicks
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i, true)));

  // Keyboard
  if (!root.hasAttribute('tabindex')) root.setAttribute('tabindex', '0');
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(index - 1, true); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1, true); }
  });

  // Swipe/drag on track only; ignore controls
  let startX = 0, dx = 0, isDown = false;
  const isOnControl = (el) =>
    !!el.closest('[data-carousel-prev], [data-carousel-next], [data-carousel-dots]');

  track.addEventListener('pointerdown', (e) => {
    if (isOnControl(e.target)) return;
    isDown = true; startX = e.clientX; dx = 0;
    track.style.transition = 'none';
    track.setPointerCapture?.(e.pointerId);
  });

  track.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    dx = e.clientX - startX;
    // convert pixel drag to percent of the carousel viewport width
    const rootWidth = root.clientWidth || 1;
    const dragPct = (dx / rootWidth) * 100;
    apply(false, dragPct);
  });

  const endPointer = (e) => {
    if (!isDown) return;
    isDown = false;
    const rootWidth = root.clientWidth || 1;
    const dragPct = (dx / rootWidth) * 100;
    const thresholdPct = 20; // 20% swipe to change slide
    if (dragPct >  thresholdPct) goTo(index - 1, true);
    else if (dragPct < -thresholdPct) goTo(index + 1, true);
    else goTo(index, true);
    track.releasePointerCapture?.(e.pointerId);
  };
  track.addEventListener('pointerup', endPointer);
  track.addEventListener('pointercancel', endPointer);

  // Init + resize
  const init = () => apply(false, 0);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
  window.addEventListener('resize', () => requestAnimationFrame(() => apply(false, 0)));
}
