# Improvement backlog

Each PR fixes the top unchecked item that fits safely (see CLAUDE.md). Check items off with the date. Add new findings at the bottom of the right section.

## Quick wins (one per PR)
- [ ] Add the "Upcoming Events" section's past-event handling: if no upcoming events exist, show a friendly "Next date coming soon" message with a link to the Work The Room LinkedIn page instead of an empty section.

## Bigger items (Bill decides when)
- [ ] Build the event cards and Event JSON-LD automatically from `data/events.json` (the file now exists; the page is still updated by hand from it).
- [ ] Add a TSM client testimonial section once Bill has a first quote. Currently all social proof is for Work The Room.
- [ ] Add privacy-friendly analytics (Plausible or Fathom) so Bill can see visits and RSVP clicks.
- [ ] Add a short founder video to the homepage or About page.

## Outside the repo (Bill does these, not Claude Code)
- [ ] Create a Google Business Profile (for TSM and/or Work The Room).
- [ ] Verify the site in Bing Webmaster Tools and submit `sitemap.xml`.

## Done
- [x] 2026-10-06 Rewrote the alt text on gallery photos 1 to 8 so each one describes that specific photo (they all said some version of "attendees at a past event").
- [x] 2026-10-04 Reviewed every meta description. Trimmed `work-the-room.html` from 171 to 160 characters. The rest are in range or noindex pages (404, thanks); `what-we-do.html` sits at 164, close enough to leave.
- [x] 2026-09-25 Updated the HTML comment above the gallery in `work-the-room.html` so it says new photos go first, not below the last one.
- [x] 2026-09-25 Fixed the `width` and `height` on gallery photos 1 to 8 in `work-the-room.html`. They said 480x360, but the files are portrait 480x640.
- [x] 2026-09-25 Eventbrite API is now connected and working for event syncs (previously needed a token or manual links).
- [x] 2026-09-25 Added `width` and `height` to the headshot on `about.html` so the page does not shift while it loads.
- [x] 2026-09-25 Added ContactPage and Organization structured data to `contact.html` (email, LinkedIn, Greater Philadelphia Region).
- [x] 2026-09-25 Compressed the 8 original gallery photos to under 80 KB each (were 146 to 217 KB) and stripped their hidden metadata.
- [x] 2026-09-25 Added `lastmod` dates to every `sitemap.xml` entry.
- [x] 2026-09-25 Removed the past Sept 22 event, added Dec 15, and created `data/events.json` as the single event record.
- [x] 2026-09-21 Favicon, `og:image`, robots.txt, sitemap.xml, canonical tags, JSON-LD, custom 404.
- [x] 2026-09-21 Google Search Console verified, homepage indexing requested, sitemap submitted.
- [x] 2026-09-21 Substack feed on homepage, Fraunces headline font, logo hover no longer slants.
