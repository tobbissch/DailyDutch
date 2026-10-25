import { useSyncExternalStore } from 'react'

/** Speaking speed: slower than normal so learners can follow. */
export const RATE = 0.8

const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

/**
 * Best Dutch voice on this device. Chrome's online "Google Nederlands" first: on macOS, Chrome also lists
 * system voices that aren't downloaded, and those silently fall back to the English default voice.
 * Then Netherlands Dutch, then any Dutch (e.g. Flemish).
 */
function findVoice(): SpeechSynthesisVoice | null {
  if (!supported) return null
  const dutch = speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith('nl'))
  const nlNL = dutch.filter((v) => /nl-nl/i.test(v.lang.replace('_', '-')))
  return nlNL.find((v) => /google/i.test(v.name)) ?? nlNL[0] ?? dutch[0] ?? null
}

// Voices load asynchronously in most browsers; re-check when the list changes.
let voice = findVoice()
const listeners = new Set<() => void>()
if (supported) {
  speechSynthesis.addEventListener('voiceschanged', () => {
    voice = findVoice()
    listeners.forEach((l) => l())
  })
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

/** Whether this device can speak Dutch. */
export function useCanSpeak(): boolean {
  return useSyncExternalStore(subscribe, () => voice !== null)
}

/** Name of the voice in use, e.g. "Google Nederlands", or null if none. */
export function useVoiceName(): string | null {
  return useSyncExternalStore(subscribe, () => voice?.name ?? null)
}

export function speak(text: string) {
  if (!voice) return
  speechSynthesis.cancel() // stop whatever is still playing
  const u = new SpeechSynthesisUtterance(text)
  u.voice = voice
  u.lang = voice.lang
  u.rate = RATE
  speechSynthesis.speak(u)
}
