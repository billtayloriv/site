---
name: update-events
description: Sync the Upcoming Events section on work-the-room.html with Taylored Success Management's published, not-yet-happened Eventbrite events. Use when Bill says "update events", adds or cancels an event, or an event date has passed.
---

# Update events

Goal: `work-the-room.html` shows every Work The Room event that is published on Eventbrite and has not happened yet, and nothing else. The visible event cards and the Event structured data always match.

Follow `CLAUDE.md` for workflow, voice and the pre-PR checklist.

## Sources
- Organizer page (source of truth): https://www.eventbrite.com/o/taylored-success-management-121003428044
- Organizer ID: `121003428044`
- Event data file in this repo: `data/events.json`
- Timezone for all events: America/New_York. Offset is `-04:00` until the first Sunday of November and `-05:00` after, until the second Sunday of March.

## Step 1: Find the published, upcoming events
Try these in order and use the first one that returns a real event list.

1. **Eventbrite API**, only if the environment variable `EVENTBRITE_TOKEN` is set:
   `GET https://www.eventbriteapi.com/v3/organizers/121003428044/events/?status=live&order_by=start_asc&expand=venue,ticket_availability`
   with header `Authorization: Bearer $EVENTBRITE_TOKEN`. Never print or commit the token.
2. **Organizer page.** Fetch the organizer page above. Its event list usually loads by JavaScript, so a plain fetch may show "Upcoming" with nothing under it. If so, do not assume there are no events. Go to option 3.
3. **Ask Bill.** Say: "I can't read your Eventbrite organizer page directly. Paste the link for any event that isn't on the site yet (for example worktheroomMMDD.eventbrite.com)." Also re-check every event already in `data/events.json`.

For every candidate event, open its own Eventbrite page and read: title, start and end date and time, venue name, full street address, ticket price, and status.

Keep an event only if all of these are true:
- It is published and not cancelled or postponed.
- Its start time is after right now (America/New_York).

Never guess missing details. If a kept event is missing a venue, time or price, still show what is known and list the gap in the summary.

## Step 2: Update `data/events.json`
This file is the single source of truth. If it does not exist, create it from the events currently on `work-the-room.html`, then apply Step 1.

Format, sorted by start date, soonest first:
```json
[
  {
    "title": "Work The Room: Professional Networking – Swedesboro, NJ",
    "start": "2026-12-15T18:00:00-05:00",
    "end": "2026-12-15T20:00:00-05:00",
    "venue": "Swedesboro Brewing Company",
    "street": "95 Woodstown Road",
    "city": "Swedesboro",
    "state": "NJ",
    "zip": "08085",
    "price": 5,
    "priceLabel": "$5 + fees",
    "url": "https://worktheroomMMDD.eventbrite.com"
  }
]
```
Use the event's short vanity link (worktheroomMMDD.eventbrite.com) when one exists, otherwise its full Eventbrite URL. For a free event use `"price": 0` and `"priceLabel": "Free"`.

## Step 3: Rebuild the page from the data file
In `work-the-room.html`:

**Visible cards.** Replace everything inside the Upcoming Events grid with one card per event, in date order, using exactly this markup:
```html
<article class="card event-card">
  <h3>{title}</h3>
  <dl class="event-meta">
    <div><dt>When</dt><dd>{Weekday, Month D, YYYY, h:mm–h:mm PM}</dd></div>
    <div><dt>Where</dt><dd>{venue}, {street}, {city}, {state} {zip}</dd></div>
    <div><dt>Cost</dt><dd>{priceLabel}</dd></div>
  </dl>
  <div class="btn-row">
    <a class="btn" href="{url}" target="_blank" rel="noopener">Reserve your spot</a>
  </div>
</article>
```
If there is only one event, make sure the single card does not stretch awkwardly across the grid.

**No events.** If the list is empty, replace the cards with one short message in Bill's voice saying the next date is coming soon, plus a link to https://www.linkedin.com/company/work-the-room-professional-networking. Never leave the section blank.

**Structured data.** In `<head>`, delete every existing `"@type": "Event"` JSON-LD block and add one per event using the same structure already on the page (Place, PostalAddress, Offer with price and URL, organizer Work The Room). Do not touch the FAQPage block. Make sure every block is valid JSON.

**Sitemap.** Update the `lastmod` date for `work-the-room.html` in `sitemap.xml` to today.

## Step 4: Marginal improvement and changelog
Follow the marginal improvement rule in `CLAUDE.md`: fix the top backlog item in `docs/IMPROVEMENTS.md` that fits safely, and check it off. Then add one line to `docs/CHANGELOG.md`, for example "Events synced: added Dec 15 Swedesboro, removed Sept 22 Collingswood. Improvement: compressed gallery photos."

## Step 5: Open the PR and report
Run the `CLAUDE.md` pre-PR checklist, then open the PR. In the summary, tell Bill in plain English:
- **Added:** each new event with its date
- **Removed:** each event taken off and why (date passed, cancelled, unpublished)
- **Kept:** events still showing
- **Missing info:** any detail you could not find
- **Improvement made:** the backlog item
- **Reminder:** removing an event from the website does not cancel it on Eventbrite. Refunds and attendee notices happen there.
