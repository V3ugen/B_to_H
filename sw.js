const CACHE_NAME = 'impb-calc-v53';
const ASSETS = ['./', 'index.html', 'style.css', 'script.js', 'manifest.json', 'icon.png'];

self.addEventListener('install', (e) => {
  // cache: 'reload' - берём файлы с сервера, а не из HTTP-кэша браузера
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(ASSETS.map((a) => new Request(a, { cache: 'reload' })))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Сначала кэш (мгновенно и без интернета), параллельно обновляем кэш из сети
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((cached) => {
      const network = fetch(e.request)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => cached || caches.match('index.html'));

      if (cached) {
        e.waitUntil(network.catch(() => {}));
        return cached;
      }
      return network;
    })
  );
});
