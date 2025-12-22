// Import Workbox from Google's CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

if (workbox) {
  console.log(`Workbox is loaded`);

  const CACHE_VERSION = 'v16'; // Version bump to force update
  const OFFLINE_FALLBACK_PAGE = 'offline.html';

  // Define versioned cache names
  const FALLBACK_CACHE_NAME = `abfit-fallback-${CACHE_VERSION}`;
  const HTML_CACHE_NAME = `abfit-html-${CACHE_VERSION}`;
  const ASSET_CACHE_NAME = `abfit-assets-${CACHE_VERSION}`;
  const IMAGE_CACHE_NAME = `abfit-images-${CACHE_VERSION}`;
  const WEATHER_CACHE_NAME = `abfit-weather-${CACHE_VERSION}`;
  const LIB_CACHE_NAME = `abfit-libs-${CACHE_VERSION}`; // New cache for libraries

  // --- Installation: Take control immediately ---
  self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
      caches.open(FALLBACK_CACHE_NAME).then((cache) => {
        console.log('[Service Worker] Caching offline fallback page');
        return cache.add(OFFLINE_FALLBACK_PAGE);
      })
    );
  });

  // --- Activation: Clean up old caches ---
  self.addEventListener('activate', event => {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName.startsWith('abfit-') && !cacheName.endsWith(CACHE_VERSION)) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }).then(() => self.clients.claim())
    );
  });

  // Enable navigation preload
  if (workbox.navigationPreload.isSupported()) {
    workbox.navigationPreload.enable();
  }

  // --- Precache App Shell ---
  workbox.precaching.precacheAndRoute([
    { url: '/manifest.json', revision: CACHE_VERSION },
    { url: 'https://placehold.co/192x192/991b1b/FFFFFF/png?text=AB', revision: null },
    { url: 'https://placehold.co/512x512/991b1b/FFFFFF/png?text=AB', revision: null },
  ]);

  // --- Caching Strategies ---

  // 1. External Libraries (esm.sh, tailwind, etc.) - StaleWhileRevalidate
  // Critical for startup speed. Serve from cache if available, update in background.
  workbox.routing.registerRoute(
    ({ url }) => 
      url.origin === 'https://esm.sh' || 
      url.origin === 'https://cdn.tailwindcss.com' ||
      url.origin === 'https://fonts.googleapis.com' ||
      url.origin === 'https://fonts.gstatic.com' ||
      url.origin === 'https://unpkg.com',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: LIB_CACHE_NAME,
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.Plugin({
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 Year
        }),
      ],
    })
  );

  // 2. Navigation (HTML) - Network First
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    async (args) => {
        try {
            const preloadResponse = await args.event.preloadResponse;
            if (preloadResponse) return preloadResponse;
            
            const networkFirst = new workbox.strategies.NetworkFirst({
                cacheName: HTML_CACHE_NAME,
                plugins: [new workbox.cacheableResponse.Plugin({ statuses: [0, 200] })],
            });
            return await networkFirst.handle(args);
        } catch (error) {
            console.log('[Service Worker] Navigation fetch failed, returning offline page.');
            const cache = await caches.open(FALLBACK_CACHE_NAME);
            return cache.match(OFFLINE_FALLBACK_PAGE);
        }
    }
  );

  // 3. App Code (.tsx, .ts, .js, .json) - Network First
  // Ensures we always get the latest code updates, but works offline.
  workbox.routing.registerRoute(
    ({ url, request }) => 
      url.origin === self.location.origin && (
        url.pathname.endsWith('.tsx') || 
        url.pathname.endsWith('.ts') || 
        url.pathname.endsWith('.js') || 
        url.pathname.endsWith('.json') ||
        request.destination === 'script' ||
        request.destination === 'worker'
      ),
    new workbox.strategies.NetworkFirst({
      cacheName: ASSET_CACHE_NAME,
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // 4. Styles - Network First
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'style',
    new workbox.strategies.NetworkFirst({
      cacheName: ASSET_CACHE_NAME,
    })
  );

  // 5. Images - Cache First
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: IMAGE_CACHE_NAME,
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

  // 6. Weather API
  workbox.routing.registerRoute(
      ({url}) => url.hostname === 'api.open-meteo.com',
      new workbox.strategies.StaleWhileRevalidate({
          cacheName: WEATHER_CACHE_NAME,
          plugins: [
              new workbox.cacheableResponse.Plugin({ statuses: [0, 200] }),
              new workbox.expiration.Plugin({ maxEntries: 1, maxAgeSeconds: 3600 }),
          ]
      })
  );

} else {
  console.log(`Workbox didn't load`);
}

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});