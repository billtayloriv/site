---
name: add-event-photos
description: Add new Work The Room event photos to the gallery on work-the-room.html, compressed, privacy-safe and with real alt text. Use when Bill attaches event photos or says "add photos" or "update the gallery".
---

# Add event photos

Goal: new photos from Work The Room events appear in the "Photos from past events" gallery on `work-the-room.html`, load fast, and carry no hidden location data.

Follow `CLAUDE.md` for workflow and the pre-PR checklist.

## What Bill provides
- The photos, attached to his message.
- Optional: which event they are from (city and date) and anything worth noting, like "this is the sponsor table".

If he gives no event details, ask once: "Which event are these from (city and month)?" If he doesn't know, continue without it.

## Step 1: Check each photo
Skip a photo and say why in the summary if it is:
- A screenshot, flyer or graphic instead of a real event photo
- Very blurry, very dark, or a near-duplicate of another photo in the batch or already in the gallery

## Step 2: Prepare each photo
Use Python with Pillow (`pip install Pillow` if it is missing):
1. Fix rotation from the camera's orientation data.
2. Resize so the longest side is at most 1200 px. Never enlarge a smaller photo.
3. Strip all metadata, including GPS location, camera details and date.
4. Save as JPEG, quality around 80, aiming for under 150 KB. Lower the quality in small steps if needed, but not below 70.
5. Name it `images/wtr-event-N.jpg`, where N continues from the highest existing number. Never overwrite an existing file.

## Step 3: Write alt text
Look at each photo and describe what is actually in it, in one plain sentence under about 125 characters. Include the event city when known. Examples:
- "Two attendees laughing over drinks at Work The Room in Collingswood"
- "Group of attendees gathered around a high-top table at Swedesboro Brewing Company"

Never name people in alt text unless Bill names them. Never guess who someone is.

## Step 4: Add them to the gallery
In `work-the-room.html`, inside `.gallery-track`, add one block per new photo at the **start** of the track, so the newest photos show first:
```html
<button type="button" class="gallery-item" data-lightbox-trigger>
  <img src="images/wtr-event-N.jpg" alt="{alt text}" width="{width}" height="{height}" loading="lazy">
</button>
```
Use the real saved width and height. Keep `loading="lazy"` on every gallery image except the first three in the track.

**Size cap.** The gallery holds at most 12 photos. If adding the new ones would go over 12, do not delete anything on your own. List the oldest photos by file name in the summary and ask Bill which ones to retire.

## Step 5: Marginal improvement and changelog
Follow the marginal improvement rule in `CLAUDE.md`. If an existing gallery photo is over 150 KB, prefer compressing it (same Step 2 settings, same file name) as this run's improvement. Then add one line to `docs/CHANGELOG.md`.

## Step 6: Open the PR and report
Run the `CLAUDE.md` pre-PR checklist, then open the PR. Tell Bill in plain English:
- **Added:** how many photos, with each new file name and its alt text
- **Skipped:** any photo not used, and why
- **File sizes:** before and after for each photo
- **Gallery count:** total photos now showing
- **Improvement made:** the backlog item
- **Reminder:** make sure the people pictured are comfortable being on the website
