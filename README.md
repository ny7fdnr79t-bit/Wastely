# Wastely website

Static site. No build step.

## Put it on GitHub Pages
1. Upload everything in this folder to the root of the repo (`ny7fdnr79t-bit/Wastely`, branch `main`).
2. Repo → Settings → Pages → Source: "Deploy from a branch", Branch: `main`, folder `/ (root)`.
3. The site loads from `index.html`, which forwards to `Wastely.dc.html`.

Keep `.image-slots.state.json`, `support.js`, `services-data.js` and `image-slot.js` in the root — pages depend on them.

## Google Ads landing pages
One page per service, e.g. `/estate-cleanout.dc.html`, `/asbestos-removal.dc.html`, `/land-clearing.dc.html`.

## Before launch
- Replace the placeholder phone `(000) 000-0000` / `tel:+10000000000` across all files.
- Connect the quote forms to email/CRM (e.g. Formspree, Netlify Forms) and add Google Ads conversion tracking.
- Swap the GoFundMe link on the home page (`#support`) for your campaign URL.
- Service prices live in `services-data.js` (`price`) and `Wastely.dc.html` (`JOBS`).
