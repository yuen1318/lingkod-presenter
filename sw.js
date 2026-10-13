const VERSION = '2.11.15'; // ← bump this on each deploy
const CACHE_NAME = `lingkod-presenter-v${VERSION}`;
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './songs.js',
  './bg.webp',
  './manifest.webmanifest',
  './icon.png',
  './Raleway/static/Raleway-Regular.woff2',
  './Raleway/static/Raleway-Medium.woff2',
  './Raleway/static/Raleway-SemiBold.woff2',
  './Raleway/static/Raleway-Bold.woff2'
];

// Pre-cache all listed assets on install; bypass the HTTP cache so a new version never caches stale files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE.map(url => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

// Remove old caches on activate and notify clients of update
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
    .then(() => self.clients.matchAll().then(clients =>
      clients.forEach(client =>
        client.postMessage({ type: 'UPDATE_AVAILABLE' })
      )
    ))
  );
});

// Serve from cache first, fall back to network (and update cache)
self.addEventListener('fetch', event => {
  // Only same-origin GETs are cacheable
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
