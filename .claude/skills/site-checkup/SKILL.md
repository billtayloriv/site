---
name: site-checkup
description: Monthly health check of tayloredsuccessmanagement.com. Finds broken links, stale events, leftover placeholders, slow images and search or AI-visibility gaps, updates the improvement backlog, and fixes the top item. Use when Bill says "site checkup", "health check", or a scheduled routine asks for it.
---

# Site checkup

Goal: catch problems before visitors do, and keep `docs/IMPROVEMENTS.md` an accurate, prioritized list of what to improve next.

Follow `CLAUDE.md` for workflow and the pre-PR checklist. This skill mostly reads and reports. It changes the site only through Step 3.

## Step 1: Run the checks
Check the repo files, and use web fetches for anything live. If a check can't run (for example a site blocks automated visits, which LinkedIn often does), mark it "couldn't verify", not "broken".

**Content**
- [ ] No leftover placeholder text ("Add your", "TODO", "REPLACE", "lorem") on any page
- [ ] No em dashes in visible text
- [ ] Contact details on every page match `CLAUDE.md`
- [ ] Footer copyright year is current
- [ ] Hero taglines in `js/main.js` are each about 50 characters or fewer

**Links**
- [ ] Every internal link points to a file that exists
- [ ] External links still work: each Eventbrite link, https://billconnects.substack.com, both LinkedIn links

**Events**
- [ ] No event in `data/events.json` or on `work-the-room.html` has already happened (America/New_York time)
- [ ] The cards and the Event JSON-LD list the same events

**Substack feed**
- [ ] The feed service still returns posts: fetch `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fbillconnects.substack.com%2Ffeed` and confirm it returns at least one item

**Images**
- [ ] No image in `images/` over 150 KB (logos and icons excepted)
- [ ] Every `<img>` has specific alt text (decorative images use `alt=""`), plus width and height
- [ ] Gallery images below the first three use `loading="lazy"`

**Search and AI visibility**
- [ ] Every indexable page has a unique `<title>` (under about 60 characters), a meta description (about 140 to 160 characters), `rel="canonical"`, `og:title`, `og:description` and `og:image`
- [ ] Every JSON-LD block is valid JSON and matches visible content (FAQ answers word for word, events, business details)
- [ ] `sitemap.xml` lists every indexable page with a current `lastmod`, and leaves out `thanks.html` and `404.html`
- [ ] `robots.txt` allows all crawlers, including GPTBot, ClaudeBot, PerplexityBot and Google-Extended, and points to the sitemap
- [ ] The live homepage loads at https://tayloredsuccessmanagement.com

## Step 2: Update the backlog
In `docs/IMPROVEMENTS.md`:
- Add each new problem found, in plain English, under **Quick wins** (under 15 minutes) or **Bigger items**. Don't duplicate items already listed.
- Put anything visitors would notice first (broken links, past events, placeholder text), then speed, then search.
- Check off any open item that is already fixed, with today's date.
- Leave the **Outside the repo** section for things only Bill can do (Google Business Profile, Bing Webmaster Tools and so on). Remind him of those in the summary.

Write the full results to `docs/CHECKUP.md`, replacing the previous report: today's date, then each check marked pass, fail or couldn't verify, with one line of detail for each failure.

## Step 3: Fix
- **Past events are always fixed in this run.** Follow the `update-events` skill to remove them.
- Then follow the marginal improvement rule in `CLAUDE.md`: fix the top quick win and check it off.
- Don't fix anything else. Everything else waits in the backlog.

## Step 4: Changelog, PR and report
Add one line to `docs/CHANGELOG.md`, for example "Monthly checkup: 2 issues found, removed past event, compressed 3 photos." Run the `CLAUDE.md` pre-PR checklist and open the PR. Tell Bill in plain English:
- **Health:** how many checks passed, failed, or couldn't be verified
- **Fixed in this PR:** each fix
- **New in the backlog:** each new item
- **Needs you:** anything only Bill can do
