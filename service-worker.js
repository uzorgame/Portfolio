const CACHE_NAME = 'uzorgame-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/Currency Converter+.png',
  '/Sudoku.png',
  '/SolarIcon.jpg'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip caching for unsupported schemes (chrome-extension, data, blob, etc.)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return fetch(request);
  }
  
  // Only cache GET requests
  if (request.method !== 'GET') {
    return fetch(request);
  }
  
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(request).then(
          (response) => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // Double check before caching
                const requestUrl = new URL(request.url);
                if (requestUrl.protocol === 'http:' || requestUrl.protocol === 'https:') {
                  cache.put(request, responseToCache).catch((err) => {
                    console.log('Cache put failed:', err);
                  });
                }
              });

            return response;
          }
        );
      })
    );
});

// Activate event
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

