# DailyDutch — Project Charter

SRH Haarlem University of Applied Sciences · Project Management course
Version 1.0 · 28 October 2026

> Fill in everything in `[brackets]` before handing in.

## 1. Project summary

DailyDutch is a free web app that teaches Dutch from zero to A2 level in 120 short daily lessons.
No account, no ads, no payment: open the site, do today's lesson, review the words that are due.
Progress is stored in the learner's own browser.

## 2. Business case

International students and newcomers in the Netherlands need everyday Dutch quickly.
Existing apps mostly lock content behind subscriptions or accounts, teach isolated words without
grammar, or use sentences with words the learner has never seen. DailyDutch solves this with:

- a fixed daily rhythm (one lesson per day, 10–15 minutes);
- a strict "known words only" rule: every Dutch sentence uses only words taught in that lesson or earlier;
- built-in spaced repetition so words are actually remembered;
- zero cost for the learner and zero running cost for the team (static hosting).

## 3. Objectives (SMART)

| # | Objective | Measure | Target | Deadline |
| --- | --- | --- | --- | --- |
| O1 | Complete A1–A2 curriculum | Number of lessons | 120 lessons | [date] |
| O2 | Lessons only use words already taught | `npm run check` errors | 0 errors | [date] |
| O3 | Learners retain vocabulary | Spaced-repetition review available | Working review page | [date] |
| O4 | Usable on a phone, also offline | Installable PWA | Installs + works offline | [date] |
| O5 | Publicly available, free | Live URL without login | Deployed on Vercel | [date] |

## 4. Scope

**In scope**

- 120 lessons, each with: new words (with example sentence), a grammar point with exercises, a dialogue with gap-fill lines
- Lesson flow: words → grammar → dialogue
- Review page using spaced repetition (Leitner boxes)
- "My words": learner adds/removes own words
- Home page: today's lesson, due reviews, streak, words known
- Pronunciation ("Sounds") page with Dutch pronunciation rules
- Listen buttons using the browser's Dutch voice
- Installable Progressive Web App with offline support
- Content tooling: word-list builder from open data, coverage report, content validator
- Unit tests, authoring guide, deployment

**Out of scope**

- User accounts, login, syncing progress between devices
- Payments, ads, tracking
- Native iOS/Android apps
- B1 level and higher
- Recorded human audio
- Teacher/class dashboards

## 5. Deliverables

1. Web application (Vite + React + TypeScript), source in Git (GitHub)
2. 120 lesson files (`src/content/lessons/day-001.json` … `day-120.json`)
3. Word list from open data (`data/wordlist.json`) and its build script
4. Content validator, coverage script, unit tests
5. Authoring guide (`docs/writing-lessons.md`) and project plan (`PLAN.md`)
6. Live deployment on Vercel
7. Project-management documents (this folder) and the final presentation

## 6. Stakeholders

| Stakeholder | Interest | Influence |
| --- | --- | --- |
| Lecturer / examiner (sponsor) | Correct PM process, working result | High |
| Project team | Pass the course, build a useful product | High |
| Learners (international students, newcomers) | Free, clear Dutch lessons | Medium |
| Classmates / test users | Give feedback, use the app | Low |
| Open-data providers (OpenSubtitles frequency list, Wiktionary/kaikki.org) | Correct attribution (CC BY-SA 4.0) | Low |
| Hosting provider (Vercel) | Fair use of free tier | Low |

## 7. Team and roles

| Role | Name | Responsibilities |
| --- | --- | --- |
| Sponsor / examiner | [Lecturer name] | Approves charter, assesses outcome |
| Project manager | [Name] | Planning, schedule, risks, reporting, presentation |
| Developer | [Name] | App, tooling, tests, deployment |
| Content author | [Name] | Lessons, word list, Dutch quality |
| Tester / QA | [Name] | Daily use test, lesson read-through |

## 8. Milestones

| Milestone | Date |
| --- | --- |
| M0 Charter approved | [date] |
| M1 Setup done (toolchain, scaffold) | 19 Oct 2026 |
| M2 MVP: lesson format, validator, lessons 1–3, review, my words | 24 Oct 2026 |
| M3 Content complete: 120 lessons | 25 Oct 2026 |
| M4 PWA + audio + Sounds page | 25 Oct 2026 |
| M5 Content read-through + daily use test | [date] |
| M6 Deployed on Vercel | [date] |
| M7 Final presentation and closure | [date] |

## 9. Budget and resources

- Money: €0. All tools and data are free/open (Node.js, Vite, React, Vitest, GitHub, Vercel free tier).
- Effort: team hours within the course block. [Planned hours per person]
- Hardware: team laptops and phones for testing.

## 10. Constraints

- No budget; free hosting only.
- Fixed course deadline.
- No backend: all learner data stays in the browser (`localStorage`).
- Open data must keep its license (CC BY-SA 4.0) and attribution.

## 11. Assumptions

- Learners use a modern browser; a Dutch text-to-speech voice is available on most devices.
- Learners understand English (all explanations are in English).
- Vercel's free tier remains available for static sites.

## 12. High-level risks

See `03-risk-register.md`. Main ones: Dutch language errors in fast-written lessons, scope creep,
no Dutch voice on some devices, learners losing progress when clearing browser data.

## 13. Success criteria

The project is successful when:

- objectives O1–O5 are met;
- every item of the Definition of Done (`04-definition-of-done-and-quality.md`) is ticked;
- the sponsor signs off the closure report.

## 14. Approval

| Role | Name | Signature | Date |
| --- | --- | --- | --- |
| Sponsor / examiner | | | |
| Project manager | | | |
| Team member | | | |
| Team member | | | |
