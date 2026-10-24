import { useSyncExternalStore } from 'react'
import type { Word } from '../types'
import { today } from './dates'
import { type Card, grade, newCard } from './srs'

/** All per-user state. Lives only in this browser's localStorage. */
export type State = {
  version: 1
  /** lesson day → date completed */
  completed: Record<number, string>
  cards: Record<string, Card>
  myWords: Word[]
  /** dates with any activity, for the streak */
  activity: string[]
}

const KEY = 'dailydutch:v1'

const empty = (): State => ({ version: 1, completed: {}, cards: {}, myWords: [], activity: [] })

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...empty(), ...JSON.parse(raw) }
  } catch {
    // unreadable storage → start fresh
  }
  return empty()
}

let state = load()
const listeners = new Set<() => void>()

function set(next: State) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // storage full or blocked; keep in-memory state
  }
  listeners.forEach((l) => l())
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export function useStore(): State {
  return useSyncExternalStore(subscribe, () => state)
}

function withActivity(s: State): string[] {
  const d = today()
  return s.activity.includes(d) ? s.activity : [...s.activity, d]
}

export function completeLesson(day: number, wordIds: string[]) {
  if (state.completed[day]) return
  const cards = { ...state.cards }
  for (const id of wordIds) cards[id] ??= newCard(today(), 1)
  set({
    ...state,
    completed: { ...state.completed, [day]: today() },
    cards,
    activity: withActivity(state),
  })
}

export function answerCard(id: string, correct: boolean) {
  const card = state.cards[id]
  if (!card) return
  set({
    ...state,
    cards: { ...state.cards, [id]: grade(card, correct, today()) },
    activity: withActivity(state),
  })
}

export function addMyWord(word: Omit<Word, 'id'>) {
  const id = `my-${Date.now()}`
  set({
    ...state,
    myWords: [...state.myWords, { ...word, id }],
    cards: { ...state.cards, [id]: newCard(today(), 0) },
  })
}

export function removeMyWord(id: string) {
  const { [id]: _removed, ...cards } = state.cards
  set({ ...state, myWords: state.myWords.filter((w) => w.id !== id), cards })
}
