---
name: add-testimonial
description: Add a client or attendee quote to the site, either a Work The Room attendee quote or a Taylored Success Management client quote. Use when Bill pastes a testimonial or says "add a quote" or "add a testimonial".
---

# Add a testimonial

Goal: real quotes from real people appear in the right place, word for word, and prove the work.

Follow `CLAUDE.md` for workflow, voice and the pre-PR checklist.

## What Bill provides
- The quote, exactly as the person said or wrote it
- Their name, and their title and company (or just the company)
- Which business it's for: **Work The Room** (an attendee) or **TSM** (a consulting client)

If the business isn't clear, ask. If Bill hasn't said the person agreed to be quoted by name, ask once: "Do you have their OK to put their name on the site?" If not, use their title and company only, for example "VP of Customer Success, SaaS company".

## Rules for the quote
- Use their exact words. Fix only obvious typos and say which ones you fixed in the summary.
- If the quote runs longer than about 50 words, suggest a shorter cut in the summary, but publish the full quote unless Bill approves the cut.
- Never invent, combine or reword quotes. Never add a quote Bill didn't give you.
- Escape special characters in names and companies (for example `&` becomes `&amp;`).

## Where it goes

**Work The Room quote.** On `work-the-room.html`, add a slide at the start of `.carousel-track` in the "What attendees say" section, so the newest quote shows first:
```html
<figure class="slide">
  <blockquote><p>{quote}</p></blockquote>
  <figcaption>{name}<span class="role">{title, company}</span></figcaption>
</figure>
```

**TSM quote.**
- If `index.html` has no client quotes section yet, create one directly after the "Businesses where the customer relationship is the product." section. Use the same carousel structure and classes as the Work The Room quotes (`data-carousel`, `.carousel-track`, `.carousel-controls`), with its own `aria-labelledby` heading id. Write the eyebrow and heading in Bill's voice using the `bills-voice` skill, short and not salesy. Example direction: eyebrow "Client results", heading "What clients say".
- If the section already exists, add the new slide at the start of its track.

**One-quote carousels.** If a carousel has only one slide, hide its arrows, dots and Pause button, so visitors don't see controls that do nothing. Show them again automatically once there are two or more slides.

## Structured data
Do **not** add Review or AggregateRating markup for these quotes. Google treats reviews a business posts about itself as self-serving and can ignore or penalize them. The visible quote is what helps with trust and AI answers.

## Marginal improvement and changelog
Follow the marginal improvement rule in `CLAUDE.md`, then add one line to `docs/CHANGELOG.md`.

## Open the PR and report
Run the `CLAUDE.md` pre-PR checklist, then open the PR. Tell Bill in plain English:
- **Added:** the quote, who it's from, and which page it's on
- **Typos fixed:** if any
- **Suggested shorter cut:** if the quote is long
- **New section created:** if this was the first TSM quote, with the heading you used
- **Improvement made:** the backlog item
