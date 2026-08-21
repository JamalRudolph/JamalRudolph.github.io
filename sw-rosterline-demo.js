// Rudolph CX LLC — Tendline Demo Service Worker
// Caches the guide for offline use — works without internet after first load
// Generated from canonical-page-template.html's PWA pattern, Session 210 Phase 1.
const CACHE_NAME = 'rosterline-demo-v1';
const ASSETS = [
  '/rosterline-demo.html',
  '/manifest-rosterline-demo.json',
  'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&family=Epilogue:wght@400;500;700&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS.filter(url => !url.startsWith('http')));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => {
        return caches.match('/rosterline-demo.html');
      });
    })
  );
});
