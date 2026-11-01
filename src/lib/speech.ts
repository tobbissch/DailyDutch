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
// Whether the voice list has loaded, so "no Dutch voice" is a real answer and not "not loaded yet".
// Some browsers (iOS Safari) never fire voiceschanged, so give up waiting after a few seconds.
let ready = !supported || speechSynthesis.getVoices().length > 0
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())
if (supported) {
  speechSynthesis.addEventListener('voiceschanged', () => {
    voice = findVoice()
    ready = true
    notify()
  })
  if (!ready) {
    setTimeout(() => {
      voice = findVoice()
      ready = true
      notify()
    }, 3000)
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

/** Whether this device can speak Dutch. */
export function useCanSpeak(): boolean {
  return useSyncExternalStore(subscribe, () => voice !== null)
}

/** True once we know for sure the device has no Dutch voice (voice list loaded, none Dutch). */
export function useNoDutchVoice(): boolean {
  return useSyncExternalStore(subscribe, () => ready && voice === null)
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
