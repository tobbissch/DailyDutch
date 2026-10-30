# DailyDutch — Definition of Done and Quality Report

Version 1.0 · 28 October 2026

## 1. Definition of Done (project level)

The project is "done" only when every box is ticked.

- [x] 120 lessons exist (`day-001` … `day-120`), each with words, grammar and a dialogue
- [x] `npm run check` passes with 0 errors (only already-taught words in every sentence)
- [x] Unit tests pass (`npm test`)
- [x] Type-check and production build succeed (`npm run build`)
- [x] Lesson flow, review, my words, home, sounds pages work
- [x] Installable as PWA and usable offline
- [x] Source code in Git with GitHub remote
- [ ] Lessons 4–120 read through for correct Dutch and story continuity
- [ ] At least [N] days of daily use testing done; annoyances fixed
- [ ] Deployed on Vercel; public URL works without login
- [ ] Smoke test on the live URL: desktop + phone (install, offline, audio)
- [ ] `PLAN.md` updated (all "Next" items closed)
- [ ] Project documents complete; sponsor sign-off on closure report

**Current status: 7 of 13 done. Not yet done — remaining: content read-through, daily-use test, deployment, live test, sign-off.**

## 2. Definition of Done (per lesson)

- [x] Has `day`, `title`, words with English gloss and example sentence
- [x] Grammar: learner-facing title, 3–6 points, 4–6 examples, 4–6 exercises
- [x] Dialogue: 6–10 lines (A1) or 8–14 lines (A2), 3–5 gap-fill lines
- [x] Names used in sentences listed in `names`
- [x] Passes `npm run check`
- [ ] Read and approved by a Dutch speaker

## 3. Quality measures

| Measure | Tool | Result (28 Oct 2026) |
| --- | --- | --- |
| Content rule: known words only | `npm run check` (`scripts/check-content.mjs`) | "Content OK: 120 lessons, 1822 words." |
| Unit tests: spaced repetition, dates/streak, answer checking | `npm test` (Vitest) | 7 / 7 passed |
| Type safety | `tsc --noEmit` (part of `npm run build`) | Passes |
| Build gate | `npm run build` = check → type-check → build | Fails on any content or type error |
| Vocabulary coverage | `npm run coverage` | Picks frequent words not yet taught |
| Manual review | Daily use, read-through | Pending |

## 4. Content metrics

| Item | Count |
| --- | --- |
| Lessons | 120 (A1: 1–30, A2: 31–120) |
| Vocabulary words | 1,822 |
| Grammar exercises | 660 |
| Dialogue lines | 1,436 |
| Unit tests | 7 |
| App + tooling code | ~1,330 lines (TypeScript/JS) |
| Production build | ~0.9 MB including icons, no backend |
