const CACHE='cerebello-v1';
const ASSETS=['/','index.html'];

self.addEventListener('install',ev=>{
  ev.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate',ev=>{
  ev.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch',ev=>{
  // Network first for Firebase/API calls, cache first for app shell
  if(ev.request.url.includes('firebase')||ev.request.url.includes('googleapis')||ev.request.url.includes('tavily')||ev.request.url.includes('groq')){
    return; // Always network for API calls
  }
  ev.respondWith(
    caches.match(ev.request).then(cached=>cached||fetch(ev.request).catch(()=>caches.match('index.html')))
  );
});
