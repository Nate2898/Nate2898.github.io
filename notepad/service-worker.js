const CACHE_NAME = 'notepad-cache-v1';
const urlsToCache = [
  '/',
  '/notepad/',
  '/notepad/index.html',
  '/notepad/css/notecss.css',
  '/notepad/css/notelist-sidebyside.css',
  '/notepad/js/index.js',
  '/notepad/js/sidepanel.js',
  // Add all other files you want available offline
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});