---
name: update-copy
description: Change any wording on the site in Bill's voice, and keep page titles, search descriptions and structured data in sync with it. Use when Bill asks to rewrite, reword, tighten, add or remove text on any page.
---

# Update copy

Goal: every word on the site sounds like Bill, and search engines and AI tools see the same message visitors do.

Follow `CLAUDE.md` for workflow and the pre-PR checklist.

## Step 0: Load Bill's voice first
Load the `bills-voice` skill (`.claude/skills/bills-voice/SKILL.md`) before writing anything. If it is not available, stop and tell Bill: "I can't load your voice skill, so I haven't changed anything." Never write site copy without it.

## Step 1: Understand the ask
Bill will give one of two things:
- **Exact wording.** Use it as written. The only changes allowed are replacing em dashes (per `CLAUDE.md`) and fixing obvious typos. List both in the summary.
- **A direction**, like "make the About intro warmer" or "tighten the services section". Write new copy in his voice.

If it's unclear which page or section he means, ask once, quoting the text you think he means.

## Step 2: Write it
- Follow the `bills-voice` rules: direct, warm, sharp, no filler openers, no over-hedging, no em dashes.
- Keep the core thesis where it fits: AI handles execution, people own trust and relationships.
- Use the right names: "Taylored Success Management" for the consulting business, "Work The Room" for the event, "Taylored Success" only for the Substack.
- Keep the search phrases a page depends on. If a rewrite drops phrases like "customer success", "SaaS", "IT service", or "networking" and a location (South Jersey, Philadelphia) from a heading or intro, keep them or name the tradeoff in the summary.
- Never invent facts, numbers, clients or results.

## Step 3: Protect the layout
- **Hero taglines** in `js/main.js` must fit on two lines at desktop width, like the others. Aim for no more than about 50 characters.
- **Headings and card text:** keep new text within about 10% of the old length unless Bill asked for more. If a browser is available in the session, check the page at desktop (1280px) and phone (390px) widths, and confirm nothing wraps onto extra lines or pushes other elements out of place.

## Step 4: Keep search in sync
If the change affects what a page is about, or its main heading or intro, update in the same PR:
- `<title>` (under about 60 characters, ending with "| Taylored Success Management")
- Meta description (about 140 to 160 characters, naming what the page offers)
- `og:title` and `og:description` to match
- Any JSON-LD that repeats the changed text: FAQ questions and answers, the ProfessionalService description on `index.html`, the Person description on `about.html`

If you change an FAQ answer on the page, change the matching FAQPage answer too, word for word.

## Step 5: Voice check
Before opening the PR, reread every new line and confirm:
- [ ] No em dashes
- [ ] No generic openers or corporate filler
- [ ] Each sentence says something specific
- [ ] It sounds like one person talking to a peer, not a company talking to a market

## Step 6: Marginal improvement and changelog
Follow the marginal improvement rule in `CLAUDE.md`. For this skill, a good improvement is tightening one other meta description or heading on the same page. Then add one line to `docs/CHANGELOG.md`.

## Step 7: Open the PR and report
Run the `CLAUDE.md` pre-PR checklist, then open the PR. Tell Bill in plain English:
- **Before and after** for each changed piece of text
- **For headlines and hero lines:** two alternate versions he can swap in
- **Search updates:** any title, description or structured data you changed to match
- **Anything you fixed** in his exact wording (em dashes, typos)
- **Improvement made:** the backlog item
