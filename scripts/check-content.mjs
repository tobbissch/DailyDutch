// Validates lesson files. Core rule: every Dutch sentence in a lesson may only use
// words taught in that lesson or earlier ones (plus allowed names).
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const DIR = new URL('../src/content/lessons/', import.meta.url).pathname

const tokens = (s) =>
  s
    .toLowerCase()
    .split(/[^\p{L}']+/u)
    .map((t) => t.replace(/^'+|'+$/g, ''))
    .map((t) => (t === 'eén' ? 'één' : t)) // sentence-initial één is written Eén
    .filter(Boolean)

const files = readdirSync(DIR).filter((f) => f.endsWith('.json')).sort()
const lessons = files.map((f) => ({ file: f, ...JSON.parse(readFileSync(join(DIR, f), 'utf8')) }))

const errors = []
const known = new Set()
const ids = new Set()

lessons.forEach((l, i) => {
  const at = (msg) => errors.push(`${l.file}: ${msg}`)

  if (l.day !== i + 1) at(`expected day ${i + 1}, got ${l.day}`)
  if (!l.title) at('missing title')
  if (!l.grammar.points.length || !l.grammar.examples.length || !l.grammar.exercises.length) at('grammar incomplete')
  if (!l.dialogue.title || !l.dialogue.lines.length) at('dialogue incomplete')

  // Learn this lesson's words and names first.
  for (const name of l.names ?? []) tokens(name).forEach((t) => known.add(t))
  for (const w of l.words) {
    if (!w.id || !w.nl || !w.en || w.en === 'TODO') at(`word missing id/nl/en: ${JSON.stringify(w)}`)
    if (!w.example) at(`word "${w.id}" has no example`)
    if (ids.has(w.id)) at(`duplicate word id "${w.id}"`)
    ids.add(w.id)
    if (w.article && !['de', 'het'].includes(w.article)) at(`bad article on "${w.id}"`)
    for (const s of [w.nl, w.plural ?? '', ...(w.forms ?? [])]) tokens(s).forEach((t) => known.add(t))
  }

  const sentences = [
    ...l.words.filter((w) => w.example).map((w) => [`example of "${w.id}"`, w.example.nl]),
    ...l.grammar.examples.map((e) => ['grammar example', e.nl]),
    ...l.grammar.exercises.map((e) => {
      if (!e.prompt.includes('___')) at(`exercise without ___: "${e.prompt}"`)
      return ['exercise', e.prompt.replace('___', e.answer)]
    }),
    ...l.dialogue.lines.map((line) => {
      if (line.gap && !line.nl.includes(line.gap)) at(`gap "${line.gap}" not in line "${line.nl}"`)
      return ['dialogue', line.nl]
    }),
  ]

  for (const [where, s] of sentences) {
    const unknown = tokens(s).filter((t) => !known.has(t))
    if (unknown.length) at(`${where}: unknown [${unknown.join(', ')}] in "${s}"`)
  }
})

if (errors.length) {
  console.error(errors.join('\n'))
  console.error(`\n${errors.length} problem(s) in content.`)
  process.exit(1)
}
console.log(`Content OK: ${lessons.length} lessons, ${ids.size} words.`)
