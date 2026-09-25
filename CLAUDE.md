# Taylored Success Management website: house rules

Read this before every change. These rules apply to every task in this repo.

## What this site is
- Live at https://tayloredsuccessmanagement.com, hosted on GitHub Pages from `main`.
- Owner: Bill Taylor, founder of Taylored Success Management (TSM) and Work The Room (WTR).
- Plain static HTML, CSS and JavaScript. No build step, no frameworks, no npm packages.
- Bill is not a developer. He reviews every change as a pull request and merges it himself.

## Workflow (always)
1. Work on a branch and open a pull request. Never push straight to `main`.
2. Keep each PR to one purpose, plus the one marginal improvement described below.
3. End every task with a plain-English summary: what changed, which files, and anything Bill must check on the live site.
4. Before opening the PR, run the pre-PR checklist at the bottom of this file.

## Never do
- Never edit or delete `CNAME`. It connects the custom domain.
- Never remove `robots.txt` or `sitemap.xml`, and never block AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended).
- Never add frameworks, build tools, trackers or external libraries without Bill asking for them.
- Never invent facts: no made-up stats, testimonials, client names, event details or prices. If something is missing, leave it out and say so in the summary.
- Never use em dashes in any visible text or copy. Use periods, commas or restructure the sentence.

## Voice and copy
- All visible copy is written in Bill's voice. Use the `bills-voice` skill for any new or rewritten text.
- Direct, warm, sharp. No corporate filler, no "in today's fast-paced world" openers.
- Core thesis: AI handles execution, humans own judgment, trust and relationships.
- Naming: "Taylored Success Management" is the consulting business. "Taylored Success" is the Substack publication. "Work The Room" is the networking event.

## Brand and design
- Colors live only in the `:root` variables at the top of `css/styles.css` (indigo `#2f3192`, teal `#008292` and their tints). Change colors there, never inline.
- Fonts: `--font` is Montserrat for body text, nav and buttons. `--font-heading` is Fraunces for h1 and h2 only.
- Homepage hero rotator taglines live in `js/main.js`. Every tagline must fit on two lines at desktop width, same as the others, so the page does not jump when they rotate.
- Every animation must respect `prefers-reduced-motion`.
- Logo hover is a subtle scale only. No rotation or slant.

## Site map
- `index.html` home (hero rotator, services, Substack feed, Work The Room teaser)
- `about.html` Bill's bio and headshot
- `what-we-do.html` services and FAQ
- `work-the-room.html` upcoming events, testimonials carousel, photo gallery, How We Roll, FAQ
- `contact.html` email and LinkedIn, location "Greater Philadelphia Region" (no street address)
- `thanks.html` confirmation page (noindex)
- `404.html` custom not-found page
- `images/` logos, favicons, `og-share.png`, headshot, `wtr-event-*.jpg` gallery photos
- `js/main.js` reveals, sticky header, hero rotator, carousel, lightbox, Substack feed
- `css/styles.css` all styles

## SEO and AI visibility (keep these intact on every change)
- Every indexable page keeps: a unique `<title>`, a meta description, `rel="canonical"`, Open Graph tags including `og:image`, and favicons.
- Structured data (JSON-LD) must match what is visible on the page:
  - `index.html` ProfessionalService
  - `about.html` Person and Organization
  - `what-we-do.html` FAQPage
  - `work-the-room.html` Event (one per upcoming event) and FAQPage
- If you change visible content that also appears in JSON-LD (events, FAQ answers, business details), update the JSON-LD in the same PR.
- If you add, rename or remove a page, update `sitemap.xml` in the same PR.
- Images always get real, specific alt text, `loading="lazy"` (except above-the-fold images), and width and height attributes.

## Contact details (source of truth)
- Email: bill@tayloredsuccessmanagement.com
- LinkedIn (Bill): https://www.linkedin.com/in/billtayloriv
- LinkedIn (Work The Room): https://www.linkedin.com/company/work-the-room-professional-networking
- Substack: https://billconnects.substack.com (feed: https://billconnects.substack.com/feed)

## Marginal improvement rule (every PR)
Every PR must also make exactly one small improvement from `docs/IMPROVEMENTS.md`:
1. Pick the top unchecked item that fits in the same PR without risk. Small means under 15 minutes and touching few files.
2. Do it, then check it off in `docs/IMPROVEMENTS.md` with the date.
3. If you notice a new issue while working, add it to the backlog. Do not fix it unless it is the one item you picked.
4. Name the improvement separately in the PR summary so Bill can see it.

## Changelog rule (every PR)
Add one dated line to the top of `docs/CHANGELOG.md` describing the change and the improvement, in plain English.

## Pre-PR checklist
- [ ] No em dashes in any visible text.
- [ ] No leftover placeholder text ("Add your", "TODO", "REPLACE").
- [ ] All internal links point to files that exist.
- [ ] JSON-LD still matches visible content, and is valid JSON.
- [ ] `sitemap.xml` is current.
- [ ] Hero taglines still fit on two lines.
- [ ] Nothing outside the task's scope changed, except the one backlog improvement.
- [ ] `docs/IMPROVEMENTS.md` and `docs/CHANGELOG.md` updated.
