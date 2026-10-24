export type Sentence = { nl: string; en: string }

export type Word = {
  id: string
  nl: string
  en: string
  article?: 'de' | 'het'
  plural?: string
  /** Other forms used in sentences (conjugations etc.), e.g. zijn → ben, bent, is */
  forms?: string[]
  example?: Sentence
}

/** `prompt` contains "___" where `answer` goes. */
export type Exercise = { prompt: string; answer: string; hint?: string }

export type Grammar = {
  title: string
  points: string[]
  examples: Sentence[]
  exercises: Exercise[]
}

/** `gap`, if set, is a word in `nl` the learner fills in. */
export type DialogueLine = { speaker: string; nl: string; en: string; gap?: string }

export type Lesson = {
  day: number
  title: string
  /** Proper names (people, places) allowed in sentences without being vocabulary. */
  names?: string[]
  words: Word[]
  grammar: Grammar
  dialogue: { title: string; scene: string; lines: DialogueLine[] }
}
