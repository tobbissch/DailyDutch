// Offline support. Pages: network first, fall back to cache. Hashed assets: cache first.
// Bump VERSION to drop old caches.
const VERSION = 'v2'
const CACHE = `dailydutch-${VERSION}`
const SHELL = [
  './',
  'manifest.webmanifest',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png',
  'apple-touch-icon.png',
  'favicon.ico',
  'favicon-16x16.png',
  'favicon-32x32.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

async function networkFirst(request) {
  const cache = await caches.open(CACHE)
  try {
    const res = await fetch(request)
    if (res.ok) cache.put(request, res.clone())
    return res
  } catch {
    return (await cache.match(request)) ?? (await cache.match('./'))
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE)
  const hit = await cache.match(request)
  if (hit) return hit
  const res = await fetch(request)
  if (res.ok) cache.put(request, res.clone())
  return res
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET' || new URL(request.url).origin !== location.origin) return
  if (request.mode === 'navigate') event.respondWith(networkFirst(request))
  else if (new URL(request.url).pathname.includes('/assets/')) event.respondWith(cacheFirst(request))
  else event.respondWith(networkFirst(request))
})
