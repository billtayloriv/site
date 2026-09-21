// Mobile menu toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

// Keep the footer year current
document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// Quote slider: slides on its own, and people can also swipe, use the arrows, or pause it
document.querySelectorAll('[data-carousel]').forEach((root) => {
  const track = root.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const dotsWrap = root.querySelector('[data-dots]');
  const prevBtn = root.querySelector('[data-prev]');
  const nextBtn = root.querySelector('[data-next]');
  const toggleBtn = root.querySelector('[data-toggle]');
  const DELAY = 6500; // milliseconds each quote stays on screen
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let index = 0;
  let userPaused = reduceMotion; // people who prefer less motion start paused
  let hovering = false;
  let focused = false;
  let touching = false;
  let visible = true;

  slides.forEach((slide, i) => {
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${i + 1} of ${slides.length}`);
  });

  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Show quote ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
    return dot;
  });

  function render() {
    dots.forEach((dot, i) => {
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    const paused = userPaused;
    toggleBtn.textContent = paused ? 'Play' : 'Pause';
    toggleBtn.setAttribute('aria-label', paused ? 'Start automatic sliding' : 'Pause automatic sliding');
    track.setAttribute('aria-live', paused ? 'polite' : 'off');
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.scrollTo({ left: index * track.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' });
    render();
  }

  // Keep the dots in step when someone swipes or scrolls the track by hand
  let scrollTimer;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const current = Math.round(track.scrollLeft / track.clientWidth);
      if (current !== index) {
        index = Math.min(Math.max(current, 0), slides.length - 1);
        render();
      }
    }, 80);
  });

  window.addEventListener('resize', () => {
    track.scrollTo({ left: index * track.clientWidth, behavior: 'auto' });
  });

  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));
  toggleBtn.addEventListener('click', () => {
    userPaused = !userPaused;
    render();
  });

  // Pause while someone is reading or interacting
  root.addEventListener('mouseenter', () => { hovering = true; });
  root.addEventListener('mouseleave', () => { hovering = false; });
  root.addEventListener('focusin', () => { focused = true; });
  root.addEventListener('focusout', () => { focused = false; });
  track.addEventListener('touchstart', () => { touching = true; }, { passive: true });
  track.addEventListener('touchend', () => { setTimeout(() => { touching = false; }, DELAY); }, { passive: true });

  // Only slide while the section is actually on screen
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.3 }).observe(root);
  }

  setInterval(() => {
    if (userPaused || hovering || focused || touching || !visible || document.hidden) return;
    goTo(index + 1);
  }, DELAY);

  render();
});
