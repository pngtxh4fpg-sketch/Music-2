// Service Worker – Music PWA
// Strategie: Cache First für App-Shell, Network First + Runtime-Cache für alles andere.
// Audio-Daten liegen in IndexedDB und brauchen keinen SW-Cache.

const CACHE_NAME = 'music-pwa-v1';

// App-Shell: alles was gebraucht wird, damit die App ohne Netz startet
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './App_Music_Icon.png',
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.2/babel.min.js',
];

// ── Install ──────────────────────────────────────────────────────────────────
// Beim ersten Laden alle Shell-Dateien cachen und SW sofort aktivieren.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
      .catch(err => console.warn('[SW] Install cache failed:', err))
  );
});

// ── Activate ─────────────────────────────────────────────────────────────────
// Alte Cache-Versionen löschen wenn CACHE_NAME sich ändert.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
// Cache First: wenn im Cache → sofort zurückgeben.
// Bei Cache-Miss: Netz, Response cachen, zurückgeben.
// Offline + kein Cache: für Navigation index.html zurückgeben.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith((async () => {
    // 1. Cache prüfen
    const cached = await caches.match(event.request);
    if (cached) return cached;

    // 2. Netz versuchen
    try {
      const response = await fetch(event.request);

      // Nur sinnvolle Antworten cachen (ok oder opaque/CDN ohne CORS)
      if (response && (response.status === 200 || response.type === 'opaque')) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, response.clone());
      }

      return response;
    } catch {
      // Offline-Fallback: Navigation → index.html (App lädt sich selbst)
      if (event.request.mode === 'navigate') {
        const fallback = await caches.match('./index.html');
        if (fallback) return fallback;
      }
      // Für andere Ressourcen: leere 503-Antwort
      return new Response('', { status: 503, statusText: 'Offline' });
    }
  })());
});
