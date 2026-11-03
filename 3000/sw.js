const V = 'ktn3000-ad2423b4', VO = ['./', 'index.html', 'manifest.json', 'icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(VO))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('ktn3000-') && k !== V && k !== 'ktn3000-media').map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url); if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  if (/\/(a|h)\/[0-9a-f]+\.(mp3|webp)$/.test(u.pathname)) {
    e.respondWith(caches.open('ktn3000-media').then(c => c.match(e.request).then(r => r || fetch(e.request).then(n => { if (n.ok) c.put(e.request, n.clone()); return n; }))));
  } else {
    e.respondWith(fetch(e.request).then(n => { if (n.ok) caches.open(V).then(c => c.put(e.request, n.clone())); return n; }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
  }
});
