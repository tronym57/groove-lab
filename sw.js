const CACHE = 'groove-lab-v23';
const SAMPLES = ['conga', 'tumba', 'bongo_hi', 'bongo_lo', 'shaker_dn', 'shaker_up', 'clap1', 'clap2',
  'clave', 'wood', 'hat_closed', 'hat_open', 'tamb',
  'drum_snare_hard', 'drum_snare_soft', 'sn_dolf', 'sn_dub', 'sn_zome', 'elec_hi_snare', 'elec_mid_snare',
  'hat_tap', 'hat_snap', 'hat_zild', 'hat_raw', 'hat_cats', 'hat_gump', 'drum_cymbal_open', 'ride_via', 'perc_snap', 'elec_fuzz_tom'].map(n => `samples/${n}.wav`);
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon.svg', 'icon-180.png', 'icon-512.png', ...SAMPLES];

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
