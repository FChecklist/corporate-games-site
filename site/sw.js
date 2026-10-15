/* Corporate Games: service worker. Pages you have opened open again without internet; anything else shows the offline page.
   Never touches other websites (the games themselves are separate sites). */
const V = "idx-v2";
const CORE = ["/offline.html", "/site.css", "/site.js", "/favicon.svg", "/img/icon-192.png", "/fonts/Inter-normal-400.woff2", "/fonts/Fraunces-normal-500-700.woff2"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
const save = (req, res) => { if (res && res.ok && res.type === "basic") { const copy = res.clone(); caches.open(V).then((c) => c.put(req, copy)); } return res; };
self.addEventListener("fetch", (e) => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== self.location.origin) return;
  if (r.mode === "navigate") { e.respondWith(fetch(r).then((res) => save(r, res)).catch(() => caches.match(r).then((m) => m || caches.match("/offline.html")))); return; }
  e.respondWith(caches.match(r).then((m) => m || fetch(r).then((res) => save(r, res))));
});
