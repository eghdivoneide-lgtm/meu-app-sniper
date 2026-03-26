// EDS LicitaEdge Pro — Service Worker v5
// Corrigido: cache robusto, fallback offline, ícones PNG

const CACHE_NAME = 'eds-licitaedge-v5';

const APP_SHELL = [
    './eds-licitaedge-pro.html',
    './manifest-licitaedge.webmanifest',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/icon-maskable-192.png',
    './icons/icon-maskable-512.png',
    'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
    'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap'
  ];

// Instala e pré-cacheia o app shell
self.addEventListener('install', (event) => {
    event.waitUntil(
          caches.open(CACHE_NAME).then((cache) => {
                  // addAll falha se qualquer recurso falhar; usamos add individual para ser tolerante
                                             return Promise.allSettled(
                                                       APP_SHELL.map(url => cache.add(url).catch(err => console.warn('SW cache miss:', url, err)))
                                                     );
          })
        );
    self.skipWaiting();
});

// Ativa e limpa caches antigos
self.addEventListener('activate', (event) => {
    event.waitUntil(
          caches.keys().then((keys) =>
                  Promise.all(
                            keys
                              .filter((key) => key !== CACHE_NAME)
                              .map((key) => caches.delete(key))
                          )
                                 )
        );
    self.clients.claim();
});

// Estratégia: Cache First para assets do shell, Network First para o HTML principal
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

                        const url = new URL(event.request.url);

                        // Nunca interceptar chamadas de API
                        if (
                              url.hostname.includes('generativelanguage.googleapis.com') ||
                              url.hostname.includes('api.anthropic.com') ||
                              url.hostname.includes('fonts.gstatic.com')
                            ) {
                              return;
                        }

                        // Para o HTML principal: Network First com fallback de cache
                        if (url.pathname.endsWith('eds-licitaedge-pro.html') || url.pathname === '/' || url.pathname.endsWith('/')) {
                              event.respondWith(
                                      fetch(event.request)
                                        .then((networkResponse) => {
                                                    const clone = networkResponse.clone();
                                                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                                                    return networkResponse;
                                        })
                                        .catch(() => caches.match('./eds-licitaedge-pro.html'))
                                    );
                              return;
                        }

                        // Para todo o resto: Cache First com fallback de rede
                        event.respondWith(
                              caches.match(event.request).then((cachedResponse) => {
                                      if (cachedResponse) return cachedResponse;

                                                                     return fetch(event.request).then((networkResponse) => {
                                                                               if (
                                                                                           !networkResponse ||
                                                                                           networkResponse.status !== 200 ||
                                                                                           networkResponse.type === 'opaque'
                                                                                         ) {
                                                                                           return networkResponse;
                                                                               }
                                                                               const clone = networkResponse.clone();
                                                                               caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                                                                               return networkResponse;
                                                                     }).catch(() => caches.match('./eds-licitaedge-pro.html'));
                              })
                            );
});
