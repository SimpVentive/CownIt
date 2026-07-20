const CACHE_NAME = 'cownit-v2';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => Promise.resolve())
  );

  self.skipWaiting();
});

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// Fetch
self.addEventListener('fetch', (event) => {

  const request = event.request;

  // Only GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Ignore browser extensions
  if (!request.url.startsWith('http')) {
    return;
  }

  const url = new URL(request.url);

  // Ignore Vite development files
  if (
    url.pathname.startsWith('/@vite') ||
    url.pathname.startsWith('/src/') ||
    url.pathname.includes('__vite') ||
    url.pathname.includes('hot-update')
  ) {
    return;
  }

  // ==========================
  // API - Network First
  // ==========================
  if (url.pathname.startsWith('/api/')) {

    event.respondWith(

      fetch(request)
        .then((response) => {

          if (
            response.ok &&
            response.type === 'basic'
          ) {

            const clone = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => cache.put(request, clone));

          }

          return response;

        })
        .catch(async () => {

          const cached = await caches.match(request);

          return cached || new Response(
            JSON.stringify({
              error: 'Offline'
            }),
            {
              status: 503,
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );

        })

    );

    return;

  }

  // ==========================
  // HTML - Network First
  // ==========================
  if (request.mode === 'navigate') {

    event.respondWith(

      fetch(request)
        .then((response) => {

          if (
            response.ok &&
            response.type === 'basic'
          ) {

            const clone = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => cache.put(request, clone));

          }

          return response;

        })
        .catch(async () => {

          return (
            await caches.match(request) ||
            await caches.match('/index.html')
          );

        })

    );

    return;

  }

  // ==========================
  // Static Assets - Cache First
  // ==========================
  event.respondWith(

    caches.match(request)
      .then((cached) => {

        if (cached) {
          return cached;
        }

        return fetch(request)
          .then((response) => {

            if (
              response.ok &&
              response.type === 'basic'
            ) {

              const clone = response.clone();

              caches.open(CACHE_NAME)
                .then((cache) => cache.put(request, clone));

            }

            return response;

          });

      })

  );

});