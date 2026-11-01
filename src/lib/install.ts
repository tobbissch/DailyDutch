import { useSyncExternalStore } from 'react'

/** Chrome/Edge/Android event that lets us show the native install dialog from our own button. */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const isBrowser = typeof window !== 'undefined'

/** Already running as an installed app (home screen icon). */
export const isInstalled =
  isBrowser &&
  (window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true)

/** iPhone/iPad. iPadOS reports itself as a Mac, so also check for touch. */
export const isIOS =
  isBrowser &&
  (/iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.userAgent.includes('Macintosh') && navigator.maxTouchPoints > 1))

// The event can fire before React mounts, so catch it at module load (imported from main.tsx).
let deferred: BeforeInstallPromptEvent | null = null
let installed = isInstalled
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())

if (isBrowser) {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault() // keep Chrome's own mini-infobar away; we show our banner instead
    deferred = e as BeforeInstallPromptEvent
    notify()
  })
  window.addEventListener('appinstalled', () => {
    deferred = null
    installed = true
    notify()
  })
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

/** Browser can show the native install dialog right now. */
export function useCanPromptInstall(): boolean {
  return useSyncExternalStore(subscribe, () => deferred !== null && !installed)
}

/** Show the native install dialog. */
export async function promptInstall() {
  if (!deferred) return
  const e = deferred
  deferred = null // the event can be used only once
  notify()
  await e.prompt()
  await e.userChoice
}
