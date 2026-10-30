# DailyDutch — Risk Register

Version 1.0 · 28 October 2026
Scale: Probability (P) and Impact (I) 1 = low … 5 = high. Score = P × I.

| ID | Risk | P | I | Score | Response | Mitigation / action | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | Dutch errors or broken story continuity in lessons 4–120 (written quickly) | 4 | 4 | 16 | Reduce | Read-through of all lessons by a (near-)native speaker; fix and re-run `npm run check` | Content author | Open |
| R2 | A sentence uses a word that was not taught yet | 3 | 3 | 9 | Avoid | Automated validator in build (`npm run check`), build fails on any error | Developer | Closed (0 errors) |
| R3 | Scope creep (accounts, sync, more levels, native apps) | 3 | 4 | 12 | Avoid | Clear out-of-scope list in charter; MoSCoW; new ideas go to "later" list | Project manager | Controlled |
| R4 | Not finished before deadline | 3 | 5 | 15 | Reduce | MVP first, then increments; content tooling to speed up writing | Project manager | Mostly closed (only read-through + deploy left) |
| R5 | No Dutch text-to-speech voice on a learner's device | 3 | 2 | 6 | Accept | Prefer nl-NL voice, fall back to any Dutch voice; app works without audio | Developer | Accepted |
| R6 | Learner loses progress (clears browser data, switches device) | 3 | 3 | 9 | Accept | Explained as limitation; possible future export/import | Developer | Accepted |
| R7 | Deployment fails or free hosting changes | 2 | 4 | 8 | Reduce | Static build (`dist/`) runs on any static host (Vercel, Netlify, GitHub Pages) | Developer | Open |
| R8 | Old cached version after update (service worker) | 2 | 2 | 4 | Reduce | Network-first for pages, hashed assets, cache `VERSION` bump | Developer | Mitigated |
| R9 | License issues with open data | 1 | 3 | 3 | Avoid | Only CC BY-SA 4.0 sources; attribution in code; raw data not committed | Developer | Mitigated |
| R10 | Team member unavailable | 2 | 3 | 6 | Reduce | Authoring guide + plan in repo so others can continue | Project manager | Open |

## Heat map (current, before mitigation)

| Impact → / Probability ↓ | 1–2 | 3 | 4–5 |
| --- | --- | --- | --- |
| **4–5** | | | R1 |
| **3** | R5 | R2, R6, R10 | R3, R4 |
| **1–2** | R8 | R9 | R7 |

## Issue log (risks that happened)

| Date | Issue | Action | Result |
| --- | --- | --- | --- |
| 25 Oct 2026 | Speech too slow / unnatural for learners | Tuned speech rate (`RATE = 0.8`) | Fixed |
| [date] | [add issues found during read-through or deployment] | | |
