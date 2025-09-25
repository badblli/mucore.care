// Mucore Care Service Worker
const CACHE_NAME = "mucore-care-v1";
const urlsToCache = [
  "/",
  "/dashboard",
  "/login",
  "/static/js/bundle.js",
  "/static/css/main.css",
  "/manifest.json",
];

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    })
  );
});

// Activate event - cleanup old caches
self.addEventListener("activate", (event) => {
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
});

// Push notification event
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "İlaç zamanı!",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: "2",
    },
    actions: [
      {
        action: "confirm",
        title: "İlaç Verildi",
        icon: "/icons/check-icon.png",
      },
      {
        action: "snooze",
        title: "10 Dakika Ertele",
        icon: "/icons/snooze-icon.png",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("Mucore Care", options));
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("Notification click received.");

  event.notification.close();

  if (event.action === "confirm") {
    // Handle medication confirmation
    event.waitUntil(clients.openWindow("/medications?action=confirm"));
  } else if (event.action === "snooze") {
    // Handle snooze action
    console.log("Snooze action triggered");
  } else {
    // Default action - open app
    event.waitUntil(clients.openWindow("/"));
  }
});
