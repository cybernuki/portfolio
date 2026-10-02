# Task: initial freelance portfolio site

## Objective
Mobile-first, bilingual (es/en) scrollytelling FREELANCE portfolio for Jhonatan Arenas. It sells services
(MCP servers, Claude Code setup, bots/agents, prototype-to-production). A phone visitor must grasp the offer
and how to hire within 5 seconds. A retro-handheld-console story proves craft but never buries services/CTAs.

## Scope
Next.js (latest) + TS strict + Tailwind + pnpm, GSAP (ScrollTrigger, SplitText) + Lenis (fine pointers), one R3F
canvas, Vitest + RTL, Playwright. Architecture: `src/features/<feature>/{domain,ui}`; pure logic in domain (strict TDD).

## Constraints
- Content only from `src/content/portfolio-content.json` (committed, imported directly; the single source of truth).
- `TODO(...)` placeholder values never render literally; no email published; no metrics; "lead" only for Subinvoxa; English B2; no education.
- Three motion tiers: full / calm / static. Resolution: stored > prefers-reduced-motion (calm) > full.
- gsap.matchMedia must include an always-true "all" condition (regression-tested).
- Conventional commits.

## Tasks
- [x] T01 Scaffold (Next, TS, Tailwind, Vitest, Playwright config)
- [x] T02 Domain: motion tier + matchMedia conditions (TDD)
- [x] T03 Domain: content selection, TODO sanitising, repo merge, locale (TDD)
- [x] T04 Domain: scene progress, HUD visibility, boot schedule, stack blocks, roving, sequence (TDD)
- [x] T05 SEO: metadata, hreflang, sitemap, robots, llms.txt, JSON-LD, OG per locale
- [x] T06 UI: layout/tokens/fonts, server-rendered scenes (semantic HTML)
- [x] T07 UI: HUD, menu/options, boot, audio, easter egg, dither dissolve
- [x] T08 UI: R3F console canvas (low-res, stepped), WebGL fallback
- [x] T09 UI: motion runtime (GSAP/ScrollTrigger/Lenis, tiers)
- [x] T10 Playwright e2e: touch + desktop, 3 tiers, screenshots
- [x] T11 Verify: typecheck, lint, test, build, gzip JS size
- [x] T12 Dev server on 0.0.0.0:3100, report

## Acceptance criteria
Typecheck/lint/test/build pass; Playwright (390x844 touch + desktop) in all 3 tiers:
ready flag, scroll-responsive scenes, tap+keyboard interactions, no horizontal overflow, 0 page errors; screenshots in
`docs/evidence/` (phone first); first-load gzip JS size noted.

## Evidence log
(append below, newest last)

- Strict TDD: 11 domain suites written first, run red (Failed to resolve import, 11 suites), then green (53 tests); content guard added later (60 tests total, 12 files).
- pnpm typecheck OK (TS 6), pnpm lint 0 errors/0 warnings (ESLint 9), pnpm test 60 passed, pnpm build OK.
- Playwright (next start :3101): 49 passed across projects phone 390x844 touch, phone-small 360x740, desktop 1440x900; tiers full/calm/static; screenshots in docs/evidence (01-phone-* first).
- First-load JS gzip: 181.6 kB (React/Next included). Three/R3F (~920 kB raw) and GSAP/Lenis load lazily after hydration; static tier fetches no GSAP (tested).
- Confidential client names are enforced by a hashed guard (SHA-256 of 1-3 word grams) over content, UI copy, JSON-LD and OG text; built output clean.
- Deviations: jsdom replaced by happy-dom (Node 22.11 lacks require(esm)); TypeScript pinned to 6 and ESLint to 9 (ecosystem not ready for TS7/ESLint10); Boot only plays in the full tier.
