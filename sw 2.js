// Service Worker: App-Shell offline, Stale-While-Revalidate für eigene Dateien.
// Audio liegt in IndexedDB (blob:-URLs) und läuft nicht über den SW.
const V = 'music-pwa-v4';

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(V);
    await c.addAll(['./', './index.html', './manifest.json']);
    await c.add('./App_Music_Icon.png').catch(() => {});
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || r.headers.has('range') || new URL(r.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const c = await caches.open(V);
    const hit = await c.match(r, { ignoreSearch: true });
    const net = fetch(r).then(res => { if (res.ok) c.put(r, res.clone()); return res; }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    return (await net) || (r.mode === 'navigate' && await c.match('./index.html')) || new Response('', { status: 503 });
  })());
});
