# Wastely website

Static site on Vercel (wastely.ca). No build step.

## Updating
Upload the files inside this folder to the root of the repo (branch main), all in one commit. Never upload the folder itself.

Keep these in the root: `vercel.json`, `support.js`, `services-data.js`, `image-slot.js`, `.image-slots.state.json`, `assets/`.

There is no `index.html`. `vercel.json` serves the home page at `/` and gives every page a clean address (`/contact`, `/estate-cleanout`).

## Google Ads landing pages
One page per service, e.g. `/estate-cleanout`, `/asbestos-removal`, `/land-clearing`.

## Settings
- Phone: (343) 801-1914
- Forms email go@wastely.ca via FormSubmit
- Service prices: `services-data.js` (`price`) and `Wastely.dc.html` (`JOBS`). Minimum job $2,500.
