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

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll progress bar
const progressBar = document.querySelector('.scroll-progress');
if (progressBar) {
  const updateProgress = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
    progressBar.style.width = `${pct}%`;
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
}

// Shrink the header once the page is scrolled
const siteHeader = document.querySelector('.site-header');
if (siteHeader) {
  const updateHeader = () => {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

// Fade/slide sections and cards in as they scroll into view
if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealTargets = document.querySelectorAll(
    '.card, .steps li, .chain, .profile, .belief blockquote, .principles > div, .band-inner > div, .carousel, .faq details, .gallery-item, .contact-side, .contact-grid > div'
  );
  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 90}ms`;
  });
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealTargets.forEach((el) => revealObserver.observe(el));
}

// Homepage hero headline rotator
const heroRotator = document.getElementById('hero-rotator');
if (heroRotator && !prefersReducedMotion) {
  const lines = [
    'AI handles execution. You own the relationships.',
    'Process scales the busywork. Trust still has to be earned by a person.',
    "The teams that win with AI didn't automate the relationship. They automated everything else."
  ];
  let lineIndex = 0;
  setInterval(() => {
    heroRotator.classList.add('is-fading');
    setTimeout(() => {
      lineIndex = (lineIndex + 1) % lines.length;
      heroRotator.textContent = lines[lineIndex];
      heroRotator.classList.remove('is-fading');
    }, 400);
  }, 4500);
}

// Past events photo carousel: shows several photos at once, auto-advances one at a time.
// 4s per step (images read faster than the quote carousel's text, so it can move quicker),
// paused on hover/focus/touch, and a visible Pause button so it never scrolls without a way to stop it.
// It loops by scrolling in one direction indefinitely: the real photos are cloned once and
// appended after themselves, and once the scroll position passes the end of the real set it is
// silently reset back by exactly one set-width, landing on the pixel-identical clone so the loop
// never visibly rewinds or jumps back to the start.
const galleryCarousel = document.querySelector('[data-gallery-carousel]');
if (galleryCarousel) {
  const gTrack = galleryCarousel.querySelector('.gallery-track');
  const gItems = Array.from(gTrack.children);
  const gPrevBtn = galleryCarousel.querySelector('[data-gallery-prev]');
  const gNextBtn = galleryCarousel.querySelector('[data-gallery-next]');
  const gToggleBtn = galleryCarousel.querySelector('[data-gallery-toggle]');
  const G_DELAY = 4000;
  const gReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  gItems.forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.setAttribute('tabindex', '-1');
    clone.removeAttribute('data-lightbox-trigger');
    gTrack.appendChild(clone);
  });

  let gPaused = gReduceMotion;
  let gHovering = false;
  let gFocused = false;
  let gTouching = false;
  let gVisible = true;
  let gSetWidth = 0;

  const gStepWidth = () => {
    const gap = parseFloat(getComputedStyle(gTrack).columnGap) || 18;
    return gItems[0].getBoundingClientRect().width + gap;
  };

  const gComputeSetWidth = () => { gSetWidth = gTrack.scrollWidth / 2; };
  gComputeSetWidth();
  window.addEventListener('resize', gComputeSetWidth);

  const gRender = () => {
    gToggleBtn.textContent = gPaused ? 'Play' : 'Pause';
    gToggleBtn.setAttribute('aria-label', gPaused ? 'Start automatic sliding' : 'Pause automatic sliding');
  };

  // An instant scrollLeft jump fights CSS scroll-snap and gets silently reverted, so briefly
  // turn snapping off while repositioning, then restore it once the next scroll is under way
  const gJumpBy = (delta) => {
    gTrack.style.scrollSnapType = 'none';
    gTrack.scrollLeft += delta;
    requestAnimationFrame(() => { gTrack.style.scrollSnapType = ''; });
  };

  const gAdvance = (direction) => {
    const behavior = gReduceMotion ? 'auto' : 'smooth';
    if (direction < 0 && gTrack.scrollLeft - gStepWidth() < 0) {
      gJumpBy(gSetWidth);
    }
    gTrack.scrollBy({ left: direction * gStepWidth(), behavior });
  };

  // Silently rewind by one set-width once we scroll past the real photos and onto their clones,
  // whether that scroll came from the auto-timer, the arrows, or someone dragging the track by hand
  gTrack.addEventListener('scroll', () => {
    if (gSetWidth > 0 && gTrack.scrollLeft > gSetWidth + 1) {
      gJumpBy(-gSetWidth);
    }
  });

  gPrevBtn.addEventListener('click', () => gAdvance(-1));
  gNextBtn.addEventListener('click', () => gAdvance(1));
  gToggleBtn.addEventListener('click', () => { gPaused = !gPaused; gRender(); });

  galleryCarousel.addEventListener('mouseenter', () => { gHovering = true; });
  galleryCarousel.addEventListener('mouseleave', () => { gHovering = false; });
  galleryCarousel.addEventListener('focusin', () => { gFocused = true; });
  galleryCarousel.addEventListener('focusout', () => { gFocused = false; });
  gTrack.addEventListener('touchstart', () => { gTouching = true; }, { passive: true });
  gTrack.addEventListener('touchend', () => { setTimeout(() => { gTouching = false; }, G_DELAY); }, { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { gVisible = entry.isIntersecting; }, { threshold: 0.3 }).observe(galleryCarousel);
  }

  setInterval(() => {
    if (gPaused || gHovering || gFocused || gTouching || !gVisible || document.hidden) return;
    gAdvance(1);
  }, G_DELAY);

  gRender();
}

// Lightbox for the "past events" photo gallery
const lightbox = document.querySelector('[data-lightbox]');
if (lightbox) {
  const lightboxImg = lightbox.querySelector('[data-lightbox-img]');
  const closeBtn = lightbox.querySelector('[data-lightbox-close]');
  let lastFocused = null;

  const openLightbox = (src, alt) => {
    lastFocused = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  };

  document.querySelectorAll('[data-lightbox-trigger]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const img = btn.querySelector('img');
      openLightbox(img.src, img.alt);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
  });
}

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
