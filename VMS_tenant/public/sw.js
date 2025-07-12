const CACHE_NAME = "vms-tenant-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/vite.svg",
  "/browserconfig.xml",
];

// Install event
self.addEventListener("install", (event) => {
  console.log("Service Worker installing");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log("Cache addAll failed:", error);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Fetch event
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      if (response) {
        return response;
      }
      return fetch(event.request).catch(() => {
        // If both cache and network fail, return offline page
        if (event.request.destination === "document") {
          return caches.match("/");
        }
      });
    })
  );
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Claim all clients immediately
  return self.clients.claim();
});
