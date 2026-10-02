# Portfolio

Bilingual (EN/ES) freelance portfolio for Jhonatan Arenas. Next.js, React Three Fiber embers, GSAP and Lenis motion.

## Develop

```bash
pnpm install
pnpm dev -H 0.0.0.0 -p 3100   # http://localhost:3100/en and /es
pnpm typecheck && pnpm lint && pnpm test
pnpm build && pnpm e2e          # Playwright runs against `next start`
```

## Content

Edit `src/content/portfolio-content.json`. It is the single source of truth for all site copy, and the site imports it directly.

## Deploy

Vercel works with the defaults: framework Next.js, install `pnpm install`, build `pnpm build`.

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes | Public origin (for example `https://your-domain.com`) for canonical links, hreflang, sitemap, OG images and JSON-LD. Without it the site falls back to `http://localhost:3100`. |
| `GITHUB_TOKEN` | no | Raises the GitHub API rate limit for the open-source cards. Without it, a failed or rate-limited request falls back to the case-study JSON. |
| `NEXT_PUBLIC_ENABLE_AUDIO` | no | `true` brings back the music and sound-effects controls. Off by default. |

The build needs network access only for Google Fonts (page fonts and OG image fonts). If the OG font fetch fails, the image falls back to the default sans font.
