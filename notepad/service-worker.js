const CACHE_NAME = 'notepad-cache-v2';
const urlsToCache = [
  '/',
  '/notepad/',
  '/notepad/index.html',
  '/notepad/css/notecss.css',
  '/notepad/css/notelist-sidebyside.css',
  '/notepad/js/index.js',
  '/notepad/js/sidepanel.js',
];

const STATIC_PATHS = new Set(urlsToCache);

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;

  // Let the browser handle cross-origin requests (CDN fonts/scripts/styles).
  if (!isSameOrigin) {
    return;
  }

  // Never cache non-GET requests.
  if (request.method !== 'GET') {
    event.respondWith(fetch(request).catch(() => Response.error()));
    return;
  }

  const isStaticAsset = isSameOrigin && STATIC_PATHS.has(url.pathname);

  // Only serve from cache for explicitly allowlisted local static assets.
  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).catch(() => Response.error());
      })
    );
    return;
  }

  // Everything else (API calls, dynamic pages, CDN files) is network-only.
  event.respondWith(fetch(request).catch(() => Response.error()));
});