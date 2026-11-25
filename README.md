# ergo-fit

A workstation sizing calculator and reference catalog built with Next.js, TypeScript, and Tailwind CSS. Calculator inputs stay in the browser. Content and product dimensions are stored in static JSON.

## Local development

Install dependencies with `npm ci` and start the development server with `npm run dev`.

Run the production gates with `npm run typecheck`, `node --test`, and `npm run build`. Run `npm start` to serve the production build.

## Production configuration

Copy `.env.example` to `.env.local` for local verification. On Vercel, set the corresponding variables in the Production environment before deploying.

- `NEXT_PUBLIC_SITE_URL` supplies the canonical origin for page metadata, structured data, the sitemap, and robots.txt. The local fallback is `https://ergo-fit.example`.
- `SITE_OPERATOR` and `SITE_CONTACT_EMAIL` supply the public identity and email shown on the trust pages. Set both for production.
- Affiliate destinations belong in `data/affiliate-links.json`, grouped by program and keyed by the product’s existing `affiliateKey`. A `null` tracking URL indicates that a link is missing. Set a program to `approved` and enter the partner-issued HTTPS URL for each exact product configuration after confirming eligibility for this site. If a network supplies the URL, generate it through the approved property in the partner dashboard. Keep `utmParams` empty unless the program permits adding UTMs to its links. Unavailable affiliate links fall back to manufacturer specs.

## AdSense readiness

Ads are off by default. Setting only `NEXT_PUBLIC_ADSENSE_CLIENT` to a real `ca-pub-...` ID adds the AdSense verification meta tag without loading an ad script. The commented `public/ads.txt` example does not authorize a seller. Copy the exact entry from the AdSense account when appropriate.

Setting `NEXT_PUBLIC_ADSENSE_ENABLED=true` with a valid client ID previews the space reserved for a manual ad. That preview makes no ad requests. Before serving ads, obtain AdSense approval, publish the account's authorized ads.txt entry, and connect the approved ad unit through the applicable consent controls. Keep automatic placements off if using the reserved manual slot.

[AdSense site verification](https://support.google.com/adsense/answer/7584263) · [ads.txt guide](https://support.google.com/adsense/answer/12171612) · [Google consent requirements](https://support.google.com/adsense/answer/13554116)
