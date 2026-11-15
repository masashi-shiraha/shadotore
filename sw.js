/* シャドトレ Service Worker
 * - アプリ本体は事前キャッシュ → オフラインでも起動
 * - OCRエンジン（vendor/）は初回使用時にキャッシュ
 * - 外部API（OpenAI / Gemini / ElevenLabs）は一切キャッシュしない
 * 更新時は VERSION を上げる */
const VERSION = 'v2.0.3';
const SHELL_CACHE = `shadotore-shell-${VERSION}`;
const VENDOR_CACHE = 'shadotore-vendor-v5';

const SHELL_FILES = [
  './',
  './index.html',
  './css/app.css',
  './js/app.js',
  './js/materials.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './favicon-32.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_FILES.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k.startsWith('shadotore-') && k !== SHELL_CACHE && k !== VENDOR_CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // 外部APIは素通し

  // ページ表示: キャッシュ優先（オフラインでも起動）+ 裏で最新版を取得
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then((cached) => {
        const net = fetch(req)
          .then((res) => {
            if (res.ok) caches.open(SHELL_CACHE).then((c) => c.put('./index.html', res.clone()));
            return res;
          })
          .catch(() => cached);
        return cached || net;
      })
    );
    return;
  }

  // OCRエンジン等: 初回取得時に保存し、以後はキャッシュから
  if (url.pathname.includes('/vendor/')) {
    event.respondWith(
      caches.open(VENDOR_CACHE).then((cache) =>
        cache.match(req).then((hit) => hit || fetch(req).then((res) => {
          if (res.ok) cache.put(req, res.clone());
          return res;
        }))
      )
    );
    return;
  }

  // アプリ本体: キャッシュ優先、なければネット（取得できたら保存）
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok && res.type === 'basic') {
        const copy = res.clone();
        caches.open(SHELL_CACHE).then((c) => c.put(req, copy));
      }
      return res;
    }))
  );
});
