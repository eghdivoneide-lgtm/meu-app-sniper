const CACHE_NAME = 'monitor-wej-dual-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  '../icons/wej/icon-wej-192.svg',
  '../icons/wej/icon-wej-512.svg',
  '../icons/eds-symbols/eds-brand-horizontal.svg',
  '../icons/eds-symbols/eds-brand-app-icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || event.request.url.startsWith('https://generativelanguage.googleapis.com/')) {
            return networkResponse;
          }

          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return networkResponse;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
