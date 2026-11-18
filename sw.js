const CACHE = 'groove-lab-v6';
const SAMPLES = ['conga', 'tumba', 'bongo_hi', 'bongo_lo', 'shaker_dn', 'shaker_up', 'clap1', 'clap2',
  'clave', 'wood', 'hat_closed', 'hat_open', 'tamb'].map(n => `samples/${n}.wav`);
const FILES = ['./', 'index.html', 'genres.js', 'kits.js', 'cycles.js', 'manifest.webmanifest', 'icon.svg', 'icon-180.png', 'icon-512.png', ...SAMPLES];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Network first so updates show up; cache as offline fallback.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res; })
      .catch(() => caches.match(e.request))
  );
});
