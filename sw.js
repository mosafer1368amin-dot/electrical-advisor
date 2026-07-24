const CACHE_NAME = "voltage-elec-v3";
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/manifest.webmanifest",
  "/offline.html",
  "/icon.svg",
  "/icon-192.png",
  "/icon-512.png"
];

// Install Event - Pre-cache core files and offline fallback page
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching core assets");
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Dynamic caching and offline fallback handling
self.addEventListener("fetch", (e) => {
  const requestUrl = new URL(e.request.url);

  // Exclude API requests from service worker caching
  if (requestUrl.pathname.startsWith("/api/")) {
    return;
  }

  // Only handle GET requests for caching
  if (e.request.method !== "GET") {
    return;
  }

  // Only handle HTTP/HTTPS requests
  if (!e.request.url.startsWith(self.location.origin) && !e.request.url.startsWith("http")) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Stale-While-Revalidate: Serve cached response, but update cache in the background
        fetch(e.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(e.request, networkResponse));
            }
          })
          .catch(() => { /* Ignore background network fetch errors when offline */ });
          
        return cachedResponse;
      }

      // If not in cache, fetch from network and dynamically cache the asset
      return fetch(e.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === "opaque") {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // If network fails completely and request is for page navigation, show offline fallback
          if (e.request.mode === "navigate") {
            return caches.match("/offline.html");
          }
          
          // Return default offline image placeholder for broken image requests
          if (e.request.destination === "image") {
            return caches.match("/icon.svg");
          }
        });
    })
  );
});
