const CACHE_NAME = 'airbag-rescate-pili-v5';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './stage1_bg.jpg',
  './stage2_bg.jpg',
  './pato_face.png',
  './guido_face.png',
  './guido_face_smile.png',
  './gaston_face.png',
  './pili_face.png',
  './pili_face_rock.png',
  './airbag.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
