# Writing DailyDutch lessons

Free daily Dutch lessons (Vite + React). One JSON file per day in
`src/content/lessons/day-NNN.json`. Type definitions: `src/types.ts`. Finished examples to match in tone, length and style:
`day-001.json`, `day-002.json`, `day-003.json` (read all three first).

New lessons: pick vocabulary with `npm run coverage` (frequent words not yet taught, from `data/wordlist.json`),
write the `words` first, then examples, grammar and dialogue. `data/wordlist.json` also has articles, plurals and verb
forms for each word.

## The core rule (enforced by `npm run check`)

Every Dutch sentence in a lesson (word examples, grammar examples, exercises with the answer filled in, dialogue lines)
may only use tokens that were taught in that lesson or an earlier one: each word's `nl`, `plural` and `forms`, plus
the lesson's `names`. Earlier lessons' vocabulary is already final, so you can rely on it — read the earlier lesson
files (all of them, from day 1 up to yours) to know what is available. A quick way to list known tokens:

    node -e 'const fs=require("fs");const d="src/content/lessons/";const s=new Set();for(const f of fs.readdirSync(d).sort()){const l=JSON.parse(fs.readFileSync(d+f));if(l.day>Number(process.argv[1]))break;for(const n of l.names??[])s.add(n.toLowerCase());for(const w of l.words)for(const x of [w.nl,w.plural??"",...(w.forms??[])])for(const t of x.toLowerCase().split(/[^\p{L}\x27]+/u))t&&s.add(t)}console.log([...s].sort().join(" "))' 30

(prints every token known by the end of day 30). If a sentence needs a word that isn't taught yet, rephrase it.

Run `npm run check` often; it must end with zero errors.

## What to fill in

- **words**: for every word:
  - `en`: replace the Wiktionary gloss with a short learner gloss like the hand-written lessons ("to have", "bicycle",
    "already").
  - check `article` (de/het), `plural` and `forms` are correct. Fix what's wrong.
  - `forms`: verbs need the conjugations used in sentences (ik/jij/hij forms, past singular/plural, participle;
    separable verbs also e.g. "sta op", "opsta"); adjectives their -e, comparative and superlative forms. Add any missing form you need.
    You may delete clearly archaic forms (gij-forms like "zijt", "hadt", "kwaamt") but never other forms or plurals:
    later lessons may rely on them.
  - Some curriculum entries are odd (a plural listed as the word, a wrong part of speech chosen, "want" glossed as a mitten).
    Fix the entry so it's a good learner word: e.g. `nl: "mensen"` → `nl: "mens", plural: "mensen"`; remove a wrong
    `article` from a non-noun. When changing `nl`, keep the old spelling available in `plural` or `forms`.
  - add an `example` to every word: one short natural sentence (or phrase) with English translation.
- You may add **at most 2 extra words per lesson** if the lesson really needs them (unique `id`, slug of the word).
  Never delete or move words.
- `names`: list any people/place names used in sentences (they're allowed without being vocabulary). Speakers in the
  dialogue are not checked, but names inside sentences are.
- **grammar**: rewrite `title` into a short learner-facing title (like "de or het?", "Present tense: ik woon, jij woont").
  3–6 `points` in plain English (clear, concise, correct, aimed at an English speaker). 4–6 `examples`. 4–6 `exercises`:
  `prompt` contains `___`, `answer` is the missing word(s), `hint` is short (infinitive, "de / het", "not", ...).
- **dialogue**: Dutch `title`, English `scene` (you may refine the planned scene), lines with `speaker`, `nl`, `en`.
  A1 (days 4–30): 6–10 lines. A2 (31–120): 8–14 lines. Mark 3–5 lines with `gap`: a word or short phrase that occurs
  literally in that line, ideally from this lesson's words or grammar.

## Quality

- Correct, natural, standard Netherlands Dutch. Short sentences at A1; longer and with subordinate clauses at A2.
- Use the lesson's new words heavily and recycle earlier words. Don't use grammar the learner hasn't met yet where it
  can be avoided (e.g. no past tense before day 27, no subordinate clauses before day 33), though fixed phrases are fine.
- English translations natural, not word-for-word (add "lit." notes only where useful).
- Keep JSON formatting like the existing files: one word object per line, one point/example/exercise/dialogue line per line.

## Recurring cast (keep consistent)

- **Sara** — from Spain, moved to Amsterdam, learning Dutch; later works at an office (a design agency).
- **Tom** — Dutch, lives in Utrecht, Sara's friend; later they become a couple (around day 64) and buy a house (day 117).
- **Anna** — Tom's sister; husband **Mark**; their kids **Noor** (girl, 7) and **Daan** (boy, 10).
- **Henk** and **Ria** — Tom's parents. **Oma Riet** — Tom's grandmother, grew up on a farm.
- **Fatima** — Sara's colleague and friend. **Peter** — their manager.
- **Lucía** — Sara's friend from Spain. **Javier** — Sara's cousin.
- **meneer De Vries** / **mevrouw De Vries** — Sara's older neighbours.
- Places: Amsterdam, Utrecht, Spanje, Nederland are already known names. Add others to `names` when used.
