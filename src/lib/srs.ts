import { addDays } from './dates'

/** Leitner-style card: higher box = longer gap before next review. */
export type Card = { box: number; due: string }

/** Days until next review, per box. */
export const INTERVALS = [0, 1, 2, 4, 7, 15, 30, 60]

/** Box from which a word counts as "known". */
export const KNOWN_BOX = 4

export function newCard(day: string, delayDays: number): Card {
  return { box: 0, due: addDays(day, delayDays) }
}

export function grade(card: Card, correct: boolean, day: string): Card {
  const box = correct ? Math.min(card.box + 1, INTERVALS.length - 1) : 1
  return { box, due: addDays(day, INTERVALS[box]) }
}

export function isDue(card: Card, day: string): boolean {
  return card.due <= day
}
