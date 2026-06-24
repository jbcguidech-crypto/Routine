/* Service worker — cache runtime pour usage hors-ligne */
const CACHE='app-pwa-v1';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const ks=await caches.keys();await Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();})());});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  e.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const cached=await cache.match(req);
    const net=fetch(req).then(res=>{
      if(res&&res.status===200&&(res.type==='basic'||res.type==='cors'))cache.put(req,res.clone());
      return res;
    }).catch(()=>null);
    return cached||(await net)||Response.error();
  })());
});
