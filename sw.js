/* Service worker sederhana: halaman selalu diambil dari jaringan lebih dulu (selalu versi terbaru),
   salinan tersimpan hanya dipakai bila offline. Permintaan ke server Apps Script tidak pernah disimpan. */
const CACHE = 'scs-wp-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(r).then(res => {
    if (res && res.ok) { const c = res.clone(); caches.open(CACHE).then(ca => ca.put(r, c)); }
    return res;
  }).catch(() => caches.match(r).then(m => m || caches.match('./'))));
});
