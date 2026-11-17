const CACHE_NAME = 'language-lab-v2';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Estratégia: Tenta a rede primeiro. Se der certo, salva no cache.
  // Se a rede falhar (offline), usa o cache.
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Se a resposta for válida, guarda uma cópia no cache
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Se a rede falhar, tenta buscar no cache
        return caches.match(e.request);
      })
  );
});
