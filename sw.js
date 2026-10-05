const CACHE_NAME = 'impb-calc-v49';
const ASSETS = ['./', 'index.html', 'style.css', 'script.js', 'manifest.json', 'icon.png'];

self.addEventListener('install', (e) => {
  // Каждый файл кэшируется отдельно: отсутствие файла не ломает установку
  e.waitUntil(caches.open(CACHE_NAME).then((cache) =>
    Promise.all(ASSETS.map((a) => cache.add(a).catch(() => {})))
  ));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
  ));
  self.clients.claim();
});

// Сначала сеть (всегда свежая версия), без интернета - кэш
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then((res) => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request).then((r) => r || caches.match('index.html')))
  );
});
