/* CV Builder service worker — network-first for pages, cache-first for assets.
   PENTING: naikkan APP_VERSION setiap rilis agar pengguna selalu dapat versi baru. */
const APP_VERSION = '20261012j';
const CACHE_NAME = 'cv-builder-' + APP_VERSION;
const PRECACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-180.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  // Pemeriksa versi: selalu ke network, jangan pernah layani dari cache
  // (version.json adalah file kecil khusus versi — tidak ikut diprecache)
  if (url.searchParams.has('_vchk') || url.pathname.endsWith('/version.json')) {
    event.respondWith(fetch(event.request).catch(() => new Response('', { status: 504 })));
    return;
  }
  // Navigasi halaman: network-first agar HTML baru langsung didapat saat online,
  // tetap bisa dibuka dari cache saat offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => {
        // Offline fallback: serve the app shell for navigations
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        throw new Error('offline');
      });
    })
  );
});
