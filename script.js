const CACHE_NAME = "my-pwa-cache-v2";
const urlsToCache = [
    "/",
    "/index.html",
    "/style/style.css",
    "/script/script2.js",
    "/script/sws.js",
    "/favicon.ico/android-icon-192x192.png",
    "/favicon.ico/favicon-192x192.png",
    "/favicon.ico/favicon-512x512.png",
    "/products.json",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Opened cache");
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener("activate", (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
