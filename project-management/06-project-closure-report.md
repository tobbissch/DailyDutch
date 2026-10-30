# DailyDutch — Project Closure Report

Version 1.0 (draft, before deployment) · 28 October 2026

## 1. Summary

DailyDutch delivered a free, login-free Dutch course web app with 120 daily lessons (A1–A2),
spaced-repetition review, text-to-speech and offline support. Scope, budget (€0) and the core
quality rule are met. The project is **not yet closed**: deployment, the content read-through
and final sign-off remain.

## 2. Objectives vs. results

| # | Objective | Target | Result | Met? |
| --- | --- | --- | --- | --- |
| O1 | Complete A1–A2 curriculum | 120 lessons | 120 lessons, 1,822 words | Yes |
| O2 | Known-words-only rule | 0 errors | 0 errors (`npm run check`) | Yes |
| O3 | Retention via review | Working review | Leitner spaced repetition (8 boxes, up to 60-day intervals) | Yes |
| O4 | Phone + offline | Installable PWA | Manifest, icons, service worker | Yes |
| O5 | Public, free | Live URL | Not yet deployed | Pending |

## 3. Scope, time, cost

| Area | Planned | Actual | Variance / comment |
| --- | --- | --- | --- |
| Scope | Must + Should items | All Must/Should done except deployment; Could item (Sounds page) also delivered | Slightly ahead on features |
| Time | [deadline] | Build done 25 Oct 2026; remaining work planned before [date] | [on time / late] |
| Cost | €0 | €0 | None |

## 4. Remaining work (to meet the Definition of Done)

| # | Task | Owner | Due | Done |
| --- | --- | --- | --- | --- |
| 1 | Read through lessons 4–120; fix Dutch and story continuity | [Content author] | [date] | [ ] |
| 2 | Daily use test; fix annoyances | [Tester] | [date] | [ ] |
| 3 | Deploy to Vercel (see plan below) | [Developer] | [date] | [ ] |
| 4 | Smoke test live URL on desktop + phone | [Tester] | [date] | [ ] |
| 5 | Update `PLAN.md`; tag release `v1.0.0` | [Developer] | [date] | [ ] |
| 6 | Sponsor sign-off | [PM] | [date] | [ ] |

## 5. Deployment plan (Vercel)

1. Push `main` to GitHub (`origin`).
2. In Vercel: New Project → import the GitHub repo.
3. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
4. Deploy; open the production URL.
5. Smoke test: home, a lesson, review, my words, sounds, listen button, "Add to Home Screen", offline reload.
6. Put the live URL in the README / presentation.

Rollback: redeploy the previous deployment in Vercel, or serve `dist/` from any static host.

## 6. Handover / maintenance

| Item | Where |
| --- | --- |
| Source code | GitHub `tobbissch/DailyDutch` |
| How to write/edit lessons | `docs/writing-lessons.md` |
| Plan and status | `PLAN.md` |
| Run locally | `npm install`, `npm run dev` |
| Quality checks | `npm run check`, `npm test`, `npm run build` |
| Rebuild word list | `npm run wordlist` (downloads open data to `data/raw/`) |
| Releasing an update | Commit to `main` → Vercel redeploys; bump `VERSION` in `public/sw.js` if cached files change |

## 7. Closure checklist

- [x] All deliverables built (app, content, tooling, docs)
- [x] Risks reviewed; open risks have an owner
- [x] Lessons learned recorded (`05-lessons-learned.md`)
- [ ] Definition of Done fully met (`04-definition-of-done-and-quality.md`)
- [ ] Product handed over / live
- [ ] Final presentation given
- [ ] Documents archived and submitted
- [ ] Sponsor sign-off

## 8. Sign-off

| Role | Name | Decision (accept / accept with remarks) | Signature | Date |
| --- | --- | --- | --- | --- |
| Sponsor / examiner | | | | |
| Project manager | | | | |
