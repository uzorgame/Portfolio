// Version - UPDATE THIS WHEN YOU UPDATE THE SITE
const CACHE_VERSION = 'v2.3.9';
const CACHE_NAME = `uzor-${CACHE_VERSION}`;

// Static assets to cache (images, fonts, etc.)
// УВАГА: addAll відхиляється ЦІЛКОМ, якщо хоч один URL віддає 404 —
// тримати список лише з реально наявних файлів
const STATIC_CACHE_URLS = [
  '/favicon.svg',
  '/CurrencyConverter.png',
  '/Sudoku.png'
];

// Install event - skip waiting to activate immediately
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...', CACHE_NAME);
  // Skip waiting means the new service worker will activate immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        // Only cache static assets, not HTML
        return cache.addAll(STATIC_CACHE_URLS.map(url => new Request(url, {cache: 'reload'})));
      })
      .catch((err) => {
        console.error('[SW] Cache install failed:', err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...', CACHE_NAME);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete all caches that don't match current version
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - Network First strategy for HTML, Cache First for static assets
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip caching for unsupported schemes
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }
  
  // Only cache GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Network First strategy for HTML files (always get fresh content)
  if (request.destination === 'document' || 
      url.pathname === '/' || 
      url.pathname.endsWith('.html') ||
      url.pathname.endsWith('/')) {
    
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If network request succeeds, return it and don't cache HTML
          if (response && response.status === 200) {
            return response;
          }
          // If network fails, try cache as fallback
          return caches.match(request);
        })
        .catch(() => {
          // Network failed, try cache
          return caches.match(request);
        })
    );
    return;
  }

  if (request.destination === 'script' ||
      request.destination === 'style' ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.css')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache).catch(() => {});
          });
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }
  
  // Cache First strategy for static assets (images, fonts, etc.)
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version immediately
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        return fetch(request).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone response for caching
          const responseToCache = response.clone();
          
          // Cache the response for future use
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache).catch((err) => {
              console.log('[SW] Cache put failed:', err);
            });
          });
          
          return response;
        });
      })
  );
});

