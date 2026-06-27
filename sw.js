// Service worker for the Java course PWA — generated, do not edit by hand.
const VERSION = "jfc-20260627060328";
const CORE = ["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./icons/apple-touch-icon.png"];
const MODULES = ["./modules/module-01-jvm-machine.html","./modules/module-02-memory-model.html","./modules/module-03-bytecode.html","./modules/module-04-types-and-vars.html","./modules/module-05-objects-classes.html","./modules/module-06-inheritance.html","./modules/module-07-interfaces.html","./modules/module-08-encapsulation.html","./modules/module-09-polymorphism.html","./modules/module-10-composition.html","./modules/module-11-static-members.html","./modules/module-12-solid-principles.html","./modules/module-13-enums.html","./modules/module-14-packages-access.html","./modules/module-15-strings.html","./modules/module-16-equals-hashcode.html","./modules/module-17-generics.html","./modules/module-18-collections.html","./modules/module-19-exceptions.html","./modules/module-20-nested-classes.html","./modules/module-21-lambdas-streams.html","./modules/module-22-optional-null.html","./modules/module-23-records-sealed.html","./modules/module-24-datetime.html","./modules/module-25-annotations-reflection.html","./modules/module-26-concurrency.html","./modules/module-27-build-tools.html","./modules/module-28-testing.html","./modules/module-29-spring-di.html","./modules/module-30-persistence-jdbc.html","./modules/module-31-json-jackson.html","./modules/module-32-http-client.html","./modules/module-33-logging.html","./modules/module-34-singleton.html","./modules/module-35-factory-method.html","./modules/module-36-builder.html","./modules/module-37-adapter.html","./modules/module-38-decorator.html","./modules/module-39-facade.html","./modules/module-40-proxy.html","./modules/module-41-strategy.html","./modules/module-42-observer.html","./modules/module-43-command.html","./modules/module-44-template-method.html","./modules/module-45-state.html"];

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
