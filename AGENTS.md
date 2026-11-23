<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Engineering contract

- Use the Next.js App Router, TypeScript with `strict: true`, and Tailwind CSS.
- Use deterministic static JSON catalogs in `data/`. Do not depend on external paid APIs or databases.
- Run `npm run typecheck`, `node --test`, and `npm run build` for every task. All three must pass before completion.
- Place clear, conspicuous FTC affiliate disclosures on every product recommendation surface, close to the recommendations and links. Use plain language that explains the commission. [FTC Endorsement Guides](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking)
- Resolve affiliate destinations through `data/affiliate-links.json`. Use `rel="sponsored noopener noreferrer"` on affiliate links. Keep placeholder URLs out of published links.
- Keep display ads disabled by default until AdSense approval. When enabled, reserve responsive container dimensions before ad load and preserve that space on delayed or empty responses to prevent layout shifts.
- Present estimates as educational workstation sizing guidance only. Include a visible disclaimer that they do not constitute medical advice. The height-based formulas are project heuristics informed by BIFMA G1-2013 workstation adjustment principles. Avoid claims of standards compliance or guaranteed individual fit. [BIFMA G1-2013 guideline](https://store.accuristech.com/bifma/products/preview/1854112)
