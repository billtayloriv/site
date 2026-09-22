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
    'Process scales busywork. People still earn trust.',
    'The best teams automate everything except the relationship.'
  ];
  let lineIndex = 0;

  // Offscreen twin used to measure each tagline's real wrapped height, so the
  // reserved space always matches the line currently on screen instead of the
  // tallest tagline in the set.
  const sizer = document.createElement('span');
  sizer.setAttribute('aria-hidden', 'true');
  sizer.style.cssText = 'position:absolute; visibility:hidden; min-height:0; pointer-events:none; left:-9999px; top:0;';
  document.body.appendChild(sizer);

  const measureHeight = (text) => {
    const computed = getComputedStyle(heroRotator);
    sizer.style.width = heroRotator.getBoundingClientRect().width + 'px';
    sizer.style.font = computed.font;
    sizer.style.lineHeight = computed.lineHeight;
    sizer.style.letterSpacing = computed.letterSpacing;
    sizer.textContent = text;
    return sizer.scrollHeight;
  };

  const applyHeight = () => {
    heroRotator.style.minHeight = measureHeight(lines[lineIndex]) + 'px';
  };
  applyHeight();
  window.addEventListener('resize', applyHeight);

  setInterval(() => {
    heroRotator.classList.add('is-fading');
    setTimeout(() => {
      lineIndex = (lineIndex + 1) % lines.length;
      heroRotator.textContent = lines[lineIndex];
      applyHeight();
      heroRotator.classList.remove('is-fading');
    }, 400);
  }, 7000);
}

// Homepage "Latest articles" section: pulls the 3 most recent Substack posts client-side via
// rss2json's free feed-to-JSON API. The section ships with a plain "Read the newsletter on
// Substack" link as its actual HTML, so a failed or slow fetch (or JS being off) just leaves
// that in place rather than needing a separate error state - the section can never look broken.
const articlesContainer = document.querySelector('[data-articles]');
if (articlesContainer) {
  const escapeHtml = (str) => str.replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
  const stripHtml = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html || '';
    return (div.textContent || '').replace(/\s+/g, ' ').trim();
  };
  const excerpt = (html, max) => {
    const text = stripHtml(html);
    return text.length > max ? `${text.slice(0, max).trim()}…` : text;
  };
  const formatDate = (dateStr) => {
    // rss2json passes the feed's pubDate through as-is, usually as "YYYY-MM-DD HH:MM:SS"
    // rather than ISO 8601. Most engines parse that fine, but it's not spec-guaranteed, so
    // retry with a 'T' separator (which is guaranteed) before giving up.
    let d = new Date(dateStr);
    if (Number.isNaN(d.getTime()) && typeof dateStr === 'string') {
      d = new Date(dateStr.replace(' ', 'T'));
    }
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const FEED_URL = 'https://billconnects.substack.com/feed';
  const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(FEED_URL)}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  fetch(API_URL, { signal: controller.signal })
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error('rss2json request failed'))))
    .then((data) => {
      const posts = (data.items || []).slice(0, 3);
      if (data.status !== 'ok' || !posts.length) return; // leave the static fallback link as-is

      const cards = posts.map((post) => `
        <article class="card">
          <span class="tag">${escapeHtml(formatDate(post.pubDate))}</span>
          <h3><a href="${escapeHtml(post.link)}" target="_blank" rel="noopener">${escapeHtml(post.title)}</a></h3>
          <p>${escapeHtml(excerpt(post.description || post.content || '', 140))}</p>
        </article>
      `).join('');

      articlesContainer.innerHTML = `
        <div class="grid grid-3">${cards}</div>
        <div class="btn-row">
          <a class="btn btn-ghost" href="https://billconnects.substack.com" target="_blank" rel="noopener">View all posts on Substack</a>
        </div>
      `;
    })
    .catch(() => {}) // fetch failed, timed out, or was aborted - fallback link stays put
    .finally(() => clearTimeout(timeoutId));
}

// Past events photo carousel: shows several photos at once and glides continuously in one
// direction. Positioned with a plain CSS transform driven by requestAnimationFrame, not native
// scrolling - position wraps with a simple modulo every frame, so there is no scroll-snap to
// fight and no discrete "jump back to the start" event for a fast tab or a queued-up timer to
// ever expose: the wrap is just normal arithmetic, not a special corrective case.
const galleryCarousel = document.querySelector('[data-gallery-carousel]');
if (galleryCarousel) {
  const gTrack = galleryCarousel.querySelector('.gallery-track');
  const gItems = Array.from(gTrack.children);
  const gPrevBtn = galleryCarousel.querySelector('[data-gallery-prev]');
  const gNextBtn = galleryCarousel.querySelector('[data-gallery-next]');
  const gToggleBtn = galleryCarousel.querySelector('[data-gallery-toggle]');
  const SECONDS_PER_PHOTO = 4;
  const gReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  gItems.forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.setAttribute('tabindex', '-1');
    clone.removeAttribute('data-lightbox-trigger');
    // Strip the scroll-reveal state: the real photo gets faded in by its own
    // IntersectionObserver entry, but nothing ever separately observes the clone, so without
    // this it would inherit "reveal" (opacity: 0) and stay invisible forever once scrolled into.
    clone.classList.remove('reveal', 'is-visible');
    clone.style.transitionDelay = '';
    gTrack.appendChild(clone);
  });

  let gPaused = gReduceMotion;
  let gHovering = false;
  let gFocused = false;
  let gTouching = false;
  let gVisible = true;
  let gPosition = 0; // px advanced so far; wrapped into [0, setWidth) every frame
  let gLastFrame = null;

  const gStepWidth = () => {
    const gap = parseFloat(getComputedStyle(gTrack).columnGap) || 18;
    return gItems[0].getBoundingClientRect().width + gap;
  };

  // Read fresh every time rather than caching once, so a late image load or a resize can never
  // leave this stale
  const gSetWidth = () => gTrack.scrollWidth / 2;

  const gRender = () => {
    gToggleBtn.textContent = gPaused ? 'Play' : 'Pause';
    gToggleBtn.setAttribute('aria-label', gPaused ? 'Start automatic sliding' : 'Pause automatic sliding');
  };

  const gPaint = () => { gTrack.style.transform = `translate3d(${-gPosition}px, 0, 0)`; };

  const gStep = (direction) => {
    const setWidth = gSetWidth();
    if (setWidth <= 0) return;
    gTrack.classList.add('is-stepping');
    gPosition = (gPosition + direction * gStepWidth() + setWidth) % setWidth;
    gPaint();
    setTimeout(() => gTrack.classList.remove('is-stepping'), 450);
  };

  const gTick = (now) => {
    if (gLastFrame === null) gLastFrame = now;
    // Cap elapsed time per frame: rAF fully pauses in a backgrounded tab, so the first frame
    // after it's foregrounded again would otherwise report however many seconds or minutes
    // actually passed, jumping gPosition forward by that whole distance in one leap. Clamping
    // it just means the carousel loses a bit of "catch-up" motion instead of visibly teleporting.
    const dt = Math.min((now - gLastFrame) / 1000, 0.1);
    gLastFrame = now;
    const running = !gPaused && !gHovering && !gFocused && !gTouching && gVisible && !document.hidden;
    if (running) {
      const setWidth = gSetWidth();
      if (setWidth > 0) {
        const pxPerSecond = gStepWidth() / SECONDS_PER_PHOTO;
        gPosition = (gPosition + pxPerSecond * dt) % setWidth;
        gPaint();
      }
    }
    requestAnimationFrame(gTick);
  };

  gPrevBtn.addEventListener('click', () => gStep(-1));
  gNextBtn.addEventListener('click', () => gStep(1));
  gToggleBtn.addEventListener('click', () => { gPaused = !gPaused; gRender(); });

  galleryCarousel.addEventListener('mouseenter', () => { gHovering = true; });
  galleryCarousel.addEventListener('mouseleave', () => { gHovering = false; });
  galleryCarousel.addEventListener('focusin', () => { gFocused = true; });
  galleryCarousel.addEventListener('focusout', () => { gFocused = false; });
  galleryCarousel.addEventListener('touchstart', () => { gTouching = true; }, { passive: true });
  galleryCarousel.addEventListener('touchend', () => { setTimeout(() => { gTouching = false; }, SECONDS_PER_PHOTO * 1000); }, { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { gVisible = entry.isIntersecting; }, { threshold: 0.3 }).observe(galleryCarousel);
  }

  gPaint();
  gRender();
  requestAnimationFrame(gTick);
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
