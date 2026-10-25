// Builds data/wordlist.json: the most frequent Dutch lemmas with article, plural,
// verb forms and English glosses. Used to pick vocabulary for lessons.
//
// Sources (downloaded into data/raw/, not committed):
//   - Frequency: OpenSubtitles 2018 counts, github.com/hermitdave/FrequencyWords (CC BY-SA 4.0)
//   - Dictionary: English Wiktionary via kaikki.org (CC BY-SA 4.0)
import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createInterface } from 'node:readline'
import { execFileSync } from 'node:child_process'

const ROOT = new URL('../data/', import.meta.url).pathname
const RAW = ROOT + 'raw/'
const FREQ = RAW + 'nl_50k.txt'
const DICT = RAW + 'kaikki-nl.jsonl'
const SOURCES = {
  [FREQ]: 'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/nl/nl_50k.txt',
  [DICT]: 'https://kaikki.org/dictionary/Dutch/kaikki.org-dictionary-Dutch.jsonl',
}
const LIMIT = Number(process.argv[2] ?? 5000)

const POS = new Set(['noun', 'verb', 'adj', 'adv', 'pron', 'prep', 'conj', 'num', 'det', 'article', 'intj', 'particle', 'phrase'])
const SKIP_TAGS = new Set(['archaic', 'obsolete', 'rare', 'dialectal', 'dated', 'Belgium', 'Suriname', 'vulgar', 'misspelling', 'nonstandard'])
// Swearing and slurs are frequent in film subtitles but not lesson material.
const SKIP_WORDS = new Set(['fuck', 'shit', 'kut', 'klootzak', 'godverdomme', 'verdomme', 'lul', 'hoer', 'teef', 'kanker', 'tering', 'neuken'])

mkdirSync(RAW, { recursive: true })
for (const [file, url] of Object.entries(SOURCES)) {
  if (!existsSync(file)) {
    console.log(`Downloading ${url}`)
    execFileSync('curl', ['-sSLf', '-o', file, url], { stdio: 'inherit' })
  }
}

/** "word|pos" → lemma entry */
const lemmas = new Map()
/** inflected form → Set of "word|pos" keys */
const formOf = new Map()

const link = (form, key) => {
  if (!formOf.has(form)) formOf.set(form, new Set())
  formOf.get(form).add(key)
}

const article = (genders) => {
  const g = new Set(genders)
  if (g.size === 0) return undefined
  if (g.size === 1 && g.has('n')) return 'het'
  if (!g.has('n')) return 'de'
  return undefined // both genders possible
}

for await (const line of createInterface({ input: createReadStream(DICT) })) {
  const e = JSON.parse(line)
  if (!POS.has(e.pos) || !/^[\p{L}' -]+$/u.test(e.word)) continue
  const word = e.word
  const key = `${word}|${e.pos}`

  for (const s of e.senses ?? []) {
    for (const f of s.form_of ?? []) link(word, `${f.word}|${e.pos}`)
  }

  const senses = (e.senses ?? []).filter(
    (s) => !s.form_of && s.glosses?.length && !(s.tags ?? []).some((t) => SKIP_TAGS.has(t)),
  )
  if (!senses.length) continue

  const entry = lemmas.get(key) ?? { nl: word, pos: e.pos, en: [] }
  for (const s of senses) {
    const g = s.glosses[s.glosses.length - 1].replace(/\s+/g, ' ').trim()
    if (entry.en.length < 2 && !entry.en.includes(g)) entry.en.push(g)
  }

  const forms = (e.forms ?? []).filter((f) => f.form && f.form !== '-' && !(f.tags ?? []).includes('table-tags') && !(f.tags ?? []).includes('inflection-template'))
  const has = (f, ...tags) => tags.every((t) => (f.tags ?? []).includes(t))

  if (e.pos === 'noun') {
    const genders = (e.head_templates ?? [])
      .flatMap((h) => String(h.args?.['1'] ?? '').split(/[,/]/))
      .map((g) => g.trim()[0])
      .filter((g) => ['m', 'f', 'c', 'n'].includes(g))
    entry.article ??= article(genders)
    entry.plural ??= forms.find((f) => has(f, 'plural') && !has(f, 'diminutive'))?.form
  }
  if (e.pos === 'verb') {
    const pick = (...tags) => forms.find((f) => has(f, ...tags) && !has(f, 'subordinate-clause'))?.form
    const v = {
      ik: pick('first-person', 'present', 'singular'),
      hij: pick('third-person', 'present', 'singular'),
      past: pick('first-person', 'past', 'singular'),
      pastPl: pick('past', 'plural'),
      participle: pick('participle', 'past'),
    }
    if (Object.values(v).some(Boolean)) entry.verb ??= v
  }
  if (e.pos === 'adj') {
    entry.comparative ??= forms.find((f) => has(f, 'comparative'))?.form
  }

  lemmas.set(key, entry)
}

// Credit each subtitle word count to the lemma itself and to lemmas it inflects.
const freq = new Map()
const credit = (key, n) => lemmas.has(key) && freq.set(key, (freq.get(key) ?? 0) + n)
for (const line of readFileSync(FREQ, 'utf8').split('\n')) {
  const [w, count] = line.trim().split(' ')
  if (!w || SKIP_WORDS.has(w)) continue
  const n = Number(count)
  // A word that is a lemma itself (niet) mostly isn't the inflection (nieten → niet).
  const isLemma = [...POS].some((pos) => lemmas.has(`${w}|${pos}`))
  for (const pos of POS) credit(`${w}|${pos}`, n)
  for (const key of formOf.get(w) ?? []) if (!key.startsWith(`${w}|`)) credit(key, isLemma ? n / 10 : n)
}

const list = [...freq.entries()]
  .filter(([key]) => !SKIP_WORDS.has(key.split('|')[0]))
  .sort((a, b) => b[1] - a[1])
  .slice(0, LIMIT)
  .map(([key, count], i) => {
    const { nl, pos, en, article, plural, verb, comparative } = lemmas.get(key)
    return { rank: i + 1, nl, pos, en: en.join('; '), article, plural, verb, comparative, count }
  })

writeFileSync(
  ROOT + 'wordlist.json',
  JSON.stringify(
    {
      about:
        'Most frequent Dutch lemmas. Frequency: OpenSubtitles 2018 via github.com/hermitdave/FrequencyWords (CC BY-SA 4.0). ' +
        'Glosses, articles, forms: English Wiktionary via kaikki.org (CC BY-SA 4.0). Generated by scripts/build-wordlist.mjs.',
      words: list,
    },
    null,
    0,
  ).replace(/\},\{/g, '},\n{') + '\n',
)
console.log(`Wrote ${list.length} words to data/wordlist.json`)
