import type { Lesson, Word } from '../types'

const modules = import.meta.glob<Lesson>('../content/lessons/*.json', {
  eager: true,
  import: 'default',
})

export const lessons: Lesson[] = Object.values(modules).sort((a, b) => a.day - b.day)

export const lessonWords = new Map<string, Word>(
  lessons.flatMap((l) => l.words.map((w) => [w.id, w] as const)),
)

export function getLesson(day: number): Lesson | undefined {
  return lessons.find((l) => l.day === day)
}

/** The Dutch form a learner should produce, article included for nouns. */
export function displayNl(w: Word): string {
  return w.article ? `${w.article} ${w.nl}` : w.nl
}
