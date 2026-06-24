const fs = require('fs');
const path = require('path');
const { renderModule } = require('./chassis');
const { NAV, CONTENT } = require('./content');

const outDir = process.argv[2];
if (!outDir) { console.error('usage: node build.js <modulesDir>'); process.exit(1); }

const byNum = Object.fromEntries(NAV.map((m, i) => [m.num, i]));

let written = 0;
for (const num of Object.keys(CONTENT)) {
  const mod = CONTENT[num];
  const idx = byNum[num];
  const prev = idx > 0 ? NAV[idx - 1] : null;
  const next = idx < NAV.length - 1 ? NAV[idx + 1] : null;
  const html = renderModule(mod, prev, next);
  const file = path.join(outDir, `module-${mod.num}-${mod.slug}.html`);
  fs.writeFileSync(file, html, 'utf8');
  console.log(`wrote ${path.basename(file)} (${Math.round(html.length / 1024)}KB)`);
  written++;
}
console.log(`\n${written} modules generated.`);

// ── PWA assets: manifest + service worker (written to course root) ──
const rootDir = path.dirname(outDir);

const manifest = {
  name: "Java for Developers",
  short_name: "Java Course",
  description: "An animated, offline course teaching Java to developers who already code.",
  start_url: "./index.html",
  scope: "./",
  display: "standalone",
  orientation: "portrait-primary",
  background_color: "#0f0f1a",
  theme_color: "#0f0f1a",
  categories: ["education", "developer"],
  icons: [
    { src: "icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
  ]
};
fs.writeFileSync(path.join(rootDir, "manifest.webmanifest"), JSON.stringify(manifest, null, 2), "utf8");

const moduleUrls = NAV.map(n => `./modules/module-${n.num}-${n.slug}.html`);
const VERSION = "jfc-" + new Date().toISOString().replace(/[^0-9]/g,"").slice(0,14); // YYYYMMDDHHMMSS — bumps each build so the SW updates
const sw = `// Service worker for the Java course PWA — generated, do not edit by hand.
const VERSION = ${JSON.stringify(VERSION)};
const CORE = ${JSON.stringify(["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./icons/apple-touch-icon.png"])};
const MODULES = ${JSON.stringify(moduleUrls)};

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    try { await c.addAll(CORE); } catch (err) {}
    await Promise.allSettled(MODULES.map(u => c.add(u)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

function isHtml(req) {
  return req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    if (isHtml(req)) {
      // network-first for HTML: always fresh online, cache as offline fallback
      e.respondWith((async () => {
        try {
          const res = await fetch(req);
          if (res && res.ok) { const c = await caches.open(VERSION); c.put(req, res.clone()); }
          return res;
        } catch (err) {
          const cached = await caches.match(req, { ignoreSearch: true });
          return cached || (await caches.match('./index.html')) || Response.error();
        }
      })());
    } else {
      // cache-first for static assets (icons, etc.)
      e.respondWith((async () => {
        const cached = await caches.match(req, { ignoreSearch: true });
        if (cached) return cached;
        try {
          const res = await fetch(req);
          if (res && res.ok) { const c = await caches.open(VERSION); c.put(req, res.clone()); }
          return res;
        } catch (err) { return Response.error(); }
      })());
    }
  } else {
    // cross-origin (web fonts): stale-while-revalidate
    e.respondWith((async () => {
      const cached = await caches.match(req);
      const network = fetch(req).then(res => {
        if (res && (res.ok || res.type === 'opaque')) caches.open(VERSION).then(c => c.put(req, res.clone()));
        return res;
      }).catch(() => cached);
      return cached || network;
    })());
  }
});
`;
fs.writeFileSync(path.join(rootDir, "sw.js"), sw, "utf8");
console.log(`PWA assets written: manifest.webmanifest, sw.js (cache ${VERSION}).`);
