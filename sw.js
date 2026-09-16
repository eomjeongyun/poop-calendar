const CACHE = 'poop-calendar-v4';
const FILES = ['./','./index.html','./style.css','./app.js','./manifest.webmanifest','./fonts/Ownglyph_ParkDaHyun.woff2','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
// When the PC is off, ngrok answers with its own error page instead of a network error, so never cache or prefer it.
const usable = response => response && response.ok && !response.headers.get('ngrok-error-code');
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (event.request.mode === 'navigate') {
    event.respondWith(caches.match('./index.html').then(cached => cached || fetch(event.request)));
    return;
  }
  event.respondWith(caches.match(event.request, {ignoreSearch: true}).then(cached => cached || fetch(event.request).then(response => {
    if (usable(response)) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); }
    return response;
  }).catch(() => new Response('', {status: 503}))));
});
