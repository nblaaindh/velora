/* VELORA service worker: aplikasi tetap bisa dibuka saat sinyal lemah/offline.
   Naikkan angka VERSI jika ingin memaksa cache lama dibuang. */
const VERSI = "velora-v4";
const INTI = ["./", "index.html", "style.css", "script.js", "manifest.json", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSI).then((c) => Promise.all(INTI.map((u) => c.add(new Request(u, { cache: "reload" })).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSI).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

const simpan = (req, res) => { if (res && (res.ok || res.type === "opaque")) { const cp = res.clone(); caches.open(VERSI).then((c) => c.put(req, cp)); } return res; };

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const u = new URL(req.url);
  const sama = u.origin === location.origin;
  const font = /(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if (!sama && !font) return;

  /* Gambar dan font: pakai cache dulu, perbarui di belakang layar */
  if (font || req.destination === "image") {
    e.respondWith(caches.match(req, { ignoreSearch: sama }).then((hit) => {
      const net = fetch(req).then((r) => simpan(req, r)).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  /* Halaman, CSS, JS: ambil yang terbaru dulu, cadangan dari cache jika offline */
  e.respondWith(fetch(req, { cache: "no-cache" }).then((r) => simpan(req, r)).catch(() =>
    caches.match(req, { ignoreSearch: true }).then((hit) => hit || (req.mode === "navigate" ? caches.match("index.html") : Response.error()))));
});
