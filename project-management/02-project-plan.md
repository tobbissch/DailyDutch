# DailyDutch — Project Plan

Requirements, work breakdown, schedule, stakeholder and communication plan.
Version 1.0 · 28 October 2026

## 1. Approach

Iterative, Agile-style delivery: build a thin working slice first (lesson format + 3 lessons + review),
validate it, then scale content and add features in small increments. Progress is tracked in `PLAN.md`
(Done / Next) and in Git commits.

## 2. Requirements (MoSCoW)

| Priority | Requirement | Status |
| --- | --- | --- |
| Must | 120 daily lessons (words, grammar, dialogue) A1–A2 | Done |
| Must | Sentences only use words already taught (validated automatically) | Done |
| Must | Lesson flow: words → grammar → dialogue with exercises | Done |
| Must | Spaced-repetition review of learned words | Done |
| Must | Progress saved without login (browser storage) | Done |
| Must | Publicly reachable URL | Open (deployment) |
| Should | Home page with today's lesson, due reviews, streak, words known | Done |
| Should | Listen buttons (Dutch text-to-speech) | Done |
| Should | Installable on phone, works offline (PWA) | Done |
| Should | "My words" list | Done |
| Could | Pronunciation page with rules and examples | Done |
| Could | Export/import of progress | Not planned |
| Won't (this project) | Accounts, sync, native apps, B1+, payments | — |

## 3. Work breakdown structure (WBS)

```
1  DailyDutch
├── 1.1 Project management
│   ├── 1.1.1 Project charter
│   ├── 1.1.2 Project plan, WBS, schedule
│   ├── 1.1.3 Risk register
│   ├── 1.1.4 Status reporting
│   └── 1.1.5 Closure: lessons learned, closure report, presentation
├── 1.2 Setup
│   ├── 1.2.1 Toolchain (Node, Vite, React, TypeScript, Vitest)
│   └── 1.2.2 Git repository + GitHub
├── 1.3 Content system
│   ├── 1.3.1 Lesson data format (types.ts)
│   ├── 1.3.2 Content validator ("known words only" rule)
│   ├── 1.3.3 Word list from open data (frequency + Wiktionary)
│   ├── 1.3.4 Coverage script
│   └── 1.3.5 Authoring guide
├── 1.4 Lesson content
│   ├── 1.4.1 Lessons 1–3 (hand-written reference lessons)
│   ├── 1.4.2 Lessons 4–30 (A1)
│   ├── 1.4.3 Lessons 31–120 (A2)
│   └── 1.4.4 Read-through / language check
├── 1.5 Application
│   ├── 1.5.1 Lesson page (words, grammar, dialogue)
│   ├── 1.5.2 Review (spaced repetition)
│   ├── 1.5.3 My words
│   ├── 1.5.4 Home (today, due, streak, known)
│   ├── 1.5.5 Speech (listen buttons)
│   ├── 1.5.6 Sounds page (pronunciation)
│   └── 1.5.7 PWA (manifest, icons, service worker)
├── 1.6 Quality
│   ├── 1.6.1 Unit tests
│   ├── 1.6.2 Build gate (check + type-check + build)
│   └── 1.6.3 Daily use test
└── 1.7 Release
    ├── 1.7.1 Deploy to Vercel
    └── 1.7.2 Smoke test on desktop and phone
```

## 4. Schedule and milestones

Actual dates come from the Git history and file timestamps. Fill in the planned dates from your own planning.

| ID | Milestone / work package | Planned | Actual | Status |
| --- | --- | --- | --- | --- |
| M0 | Charter approved | [date] | [date] | [ ] |
| M1 | Toolchain set up | [date] | 19 Oct 2026 | Done |
| M2 | MVP: format, validator, lessons 1–3, review, my words, home | [date] | 24 Oct 2026 | Done |
| M3 | Lessons 4–120 complete (word list + coverage tooling) | [date] | 25 Oct 2026 | Done |
| M4 | PWA, listen buttons, Sounds page | [date] | 25 Oct 2026 | Done |
| M5 | Read-through of lessons 4–120 + daily use test | [date] | — | Open |
| M6 | Deployed on Vercel + smoke test | [date] | — | Open |
| M7 | Final presentation + closure sign-off | [date] | — | Open |

```
Oct 2026        19   20   21   22   23   24   25   26   27   28   ...   [deadline]
Setup           ███
App + format                             ███
Lessons 1–120                            ███  ███
PWA + audio                                   ███
Read-through                                            ░░░  ░░░  ░░░
Deploy                                                            ░░░
Presentation                                                      ░░░   ░░░
                ███ done   ░░░ remaining
```

## 5. Stakeholder analysis (power / interest)

| | Low interest | High interest |
| --- | --- | --- |
| **High power** | Hosting provider (keep satisfied: stay within free tier) | Lecturer / examiner (manage closely) |
| **Low power** | Open-data providers (monitor: keep attribution) | Learners, classmates/test users (keep informed, ask feedback) |

## 6. Communication plan

| Who | What | How | When | Owner |
| --- | --- | --- | --- | --- |
| Team | Progress, blockers, next tasks | Stand-up (chat or in person) | [daily / 2× week] | Project manager |
| Team | Work done | Git commits, `PLAN.md` Done/Next | Continuous | Everyone |
| Lecturer | Status, issues, decisions | Status report / meeting | [per course schedule] | Project manager |
| Test users | Try app, give feedback | Live link + short form/chat | After deployment | Tester |
| Lecturer + class | Final result | Final presentation + documents | [date] | Whole team |
