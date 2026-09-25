# Improvement backlog

Each PR fixes the top unchecked item that fits safely (see CLAUDE.md). Check items off with the date. Add new findings at the bottom of the right section.

## Quick wins (one per PR)
- [ ] Compress the 8 gallery photos (`images/wtr-event-*.jpg`, currently 146 to 217 KB each) to under 100 KB each, or convert to WebP with the same visual quality.
- [ ] Add the "Upcoming Events" section's past-event handling: if no upcoming events exist, show a friendly "Next date coming soon" message with a link to the Work The Room LinkedIn page instead of an empty section.
- [ ] Add a basic Organization or ContactPage JSON-LD block to `contact.html`.
- [ ] Review every meta description for length (roughly 140 to 160 characters) and make sure each one names what the page is about.
- [ ] Check that every gallery photo's alt text describes the specific photo, not a generic phrase.

## Bigger items (Bill decides when)
- [ ] Build the event cards and Event JSON-LD automatically from `data/events.json` (the file now exists; the page is still updated by hand from it).
- [ ] Add a TSM client testimonial section once Bill has a first quote. Currently all social proof is for Work The Room.
- [ ] Add privacy-friendly analytics (Plausible or Fathom) so Bill can see visits and RSVP clicks.
- [ ] Add a short founder video to the homepage or About page.

## Outside the repo (Bill does these, not Claude Code)
- [ ] Create a Google Business Profile (for TSM and/or Work The Room).
- [ ] Let event syncs read Eventbrite: in the Claude Code cloud environment settings, add `eventbrite.com` and `*.eventbrite.com` to allowed domains, or add an `EVENTBRITE_TOKEN`.
- [ ] Verify the site in Bing Webmaster Tools and submit `sitemap.xml`.

## Done
- [x] 2026-09-25 Added `lastmod` dates to every `sitemap.xml` entry.
- [x] 2026-09-25 Removed the past Sept 22 event, added Dec 15, and created `data/events.json` as the single event record.
- [x] 2026-09-21 Favicon, `og:image`, robots.txt, sitemap.xml, canonical tags, JSON-LD, custom 404.
- [x] 2026-09-21 Google Search Console verified, homepage indexing requested, sitemap submitted.
- [x] 2026-09-21 Substack feed on homepage, Fraunces headline font, logo hover no longer slants.
