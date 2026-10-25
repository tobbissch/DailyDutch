// Shows which frequent Dutch words the lessons don't teach yet.
// Usage: npm run coverage [-- topN]   (default 1000)
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const DIR = new URL('../src/content/lessons/', import.meta.url).pathname
const TOP = Number(process.argv[2] ?? 1000)

const taught = new Set()
for (const f of readdirSync(DIR).filter((f) => f.endsWith('.json'))) {
  for (const w of JSON.parse(readFileSync(join(DIR, f), 'utf8')).words) {
    for (const s of [w.nl, w.plural ?? '', ...(w.forms ?? [])]) {
      for (const t of s.toLowerCase().split(/[^\p{L}']+/u)) if (t) taught.add(t)
    }
  }
}

const { words } = JSON.parse(readFileSync(new URL('../data/wordlist.json', import.meta.url), 'utf8'))
const seen = new Set()
const top = words.filter((w) => !seen.has(w.nl) && seen.add(w.nl)).slice(0, TOP)
const missing = top.filter((w) => !taught.has(w.nl.toLowerCase()))

console.log(`Top ${TOP} words: ${TOP - missing.length} taught, ${missing.length} not yet.\n`)
for (const w of missing) {
  const art = w.article ? `${w.article} ` : ''
  console.log(`${String(w.rank).padStart(5)}  ${art}${w.nl} (${w.pos}) — ${w.en.slice(0, 70)}`)
}
