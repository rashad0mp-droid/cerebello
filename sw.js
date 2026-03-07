const CACHE='cerebello-v4';

self.addEventListener('install',ev=>{
  self.skipWaiting();
});

self.addEventListener('activate',ev=>{
  ev.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch',ev=>{
  // Skip non-GET and API calls — always network
  if(ev.request.method!=='GET') return;
  if(ev.request.url.includes('firebase')||ev.request.url.includes('googleapis')||
     ev.request.url.includes('tavily')||ev.request.url.includes('groq')||
     ev.request.url.includes('cloudinary')||ev.request.url.includes('supadata')) return;

  // Network first — always try fresh, cache as fallback for offline
  ev.respondWith(
    fetch(ev.request)
      .then(res=>{
        const clone=res.clone();
        caches.open(CACHE).then(c=>c.put(ev.request,clone));
        return res;
      })
      .catch(()=>caches.match(ev.request))
  );
});
