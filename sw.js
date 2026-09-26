const CACHE_NAME = 'impb-calc-v1';
const ASSETS = [
  'index.html',
  'manifest.json',
  'icon.png'
];

// Установка и кэширование файлов
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Работа в режиме офлайн
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
