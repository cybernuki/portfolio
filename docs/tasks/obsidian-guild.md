# Task: re-theme the portfolio to "Obsidian Guild"

## Objective
Re-theme and restructure the freelance portfolio from the retro handheld console look to the approved dark-fantasy
identity "Obsidian Guild". The site exists to SELL freelance services:
clarity and conversion first, atmosphere second. Content stays sourced from `src/content/portfolio-content.json`.

## Information architecture (conversion-ordered)
1 Title screen (hero) / 2 Abilities (4 classes) / 3 Quest Log (proof) / 4 The Journey / 5 Codex (FAQ) / 6 Arsenal / 7 Join the Party.
Slim HUD top bar with an always-visible compact ember CTA. Embers: ONE R3F Points layer (<=~150, ~50 phones).

## Constraints
- No metrics; no confidential client names; English B2; "Co-founder & Tech Lead" only for Subinvoxa.
- Keep: motion tiers full/calm/static (+ OPTIONS / M key), gsap.matchMedia "all" condition + regression test, Lenis on fine pointers,
  es/en + hreflang + detection, SEO (one h1, sitemap, robots, llms.txt, JSON-LD, per-locale OG), AA contrast, no-WebGL usable, mobile-first.
- One easing curve: cubic-bezier(.22,.8,.24,1). No Witcher / Baldur's Gate / D&D assets. Own inline SVG sigils.
- Branch feat/obsidian-guild from feat/initial-site. Conventional commits.

## Tasks
- [x] G01 Domain (TDD): selected-service state + CTA availability / safe quest link
- [x] G02 Domain (TDD): quest ordering, FAQ mapping, service facts guard, arsenal grouping
- [x] G03 Domain (TDD): ember particle budget per tier and viewport, cubic-bezier easing, tier capabilities, HUD active section, contrast tokens
- [x] G04 Remove retro console code (console, boot, easter, dither, scenes, memory card) and dead tests
- [x] G05 Theme: tokens, fonts, grain, vignette, frame, buttons, dividers, sigils
- [x] G06 Sections: hero, abilities, quests, journey, codex, arsenal, party (EN + ES copy)
- [x] G07 HUD + options + light-sweep transition
- [x] G08 Embers (R3F Points) + CSS fallback
- [x] G09 SEO: metadata, JSON-LD (#party), llms.txt, OG redesign
- [x] G10 Playwright e2e (phone 390x844, 360, desktop; full/calm/static) + screenshots
- [x] G11 Verify: typecheck, lint, test, build, e2e, hashed name guard, TODO check, gzip size
- [x] G12 Dev server on 0.0.0.0:3100 (200 on /en and /es), report

## Acceptance criteria
typecheck / lint (0 errors) / test / build / Playwright pass; built output has no confidential names and no visible "TODO";
first-load gzip JS compared with the previous 181.6 kB; screenshots (phone first) in `docs/evidence/obsidian/`.

## Evidence log
(append below, newest last)

- Strict TDD: new domain suites written first and run red (11 suites failed to import, plus the tier capabilities test), then green. Suites: party selection and CTA, quest order, FAQ, class copy guard (bullets are verbatim excerpts of the JSON details), arsenal, ember budget, easing, HUD active section, palette contrast. Guard test extended (UI copy, borrowed game names, Co-founder only for Subinvoxa).
- pnpm typecheck OK, pnpm lint 0 errors / 0 warnings, pnpm test 18 files / 103 tests passed, pnpm build OK.
- Playwright (next start :3101): 93 passed, 3 skipped (desktop-only wheel test on phones, screenshots on phone-small). Projects phone 390x844 touch, phone-small 360x740 touch, desktop 1440x900; tiers full/calm/static.
- Screenshots: docs/evidence/obsidian/ (01-phone-* first, then 02-desktop-*).
- First-load JS gzip: 182.9 kB (previous 181.6 kB). Three/R3F stays lazy; GSAP, CustomEase and Lenis load after hydration; static tier fetches no GSAP (tested).
- Confidential-name check (hashed guard over visible text, JSON-LD and OG text) is clean. Built en/es HTML contain no "TODO".
- Deviations: ember button gradient is #b8402a to #86281a (the original #d5583a top stop gave 3.7:1 for the label, AA needs 4.5:1; the ember token #c8452b is kept for glows); class names and quest tabs use Cinzel only at 20px and up (reference used 16px); "Start this quest" buttons are outlined gold so the ember stays the single main action; the boot intro and the Konami palette swap were removed (retro features, boot was optional).
