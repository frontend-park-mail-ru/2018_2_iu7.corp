const CACHE_NAME = new Date().toISOString();

const { assets } = global.serviceWorkerOption;
console.log('ASSETS: ',assets);

assetsToCache = [...assets, './'];
console.log('assetsToCache: ', assetsToCache);

assetsToCache = assetsToCache.map(path => {
    const res = new URL(path, global.location).toString();
    console.log('RES: ',res);
    return res;
})

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then( (cache) => {
                return cache.addAll(assetsToCache);
            })
   ); 
});
  

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then( (response) => {
          if (response) {
              return response;
          }
  
          return fetch(event.request).then( (response) =>{
            let shouldCache = response.ok;

  
            if (event.request.method == 'POST') {
              shouldCache = false;
            }
  
            if (shouldCache) {
              return caches.open(CACHE_NAME).then( (cache) => {
                cache.put(event.request, response.clone());
                return response;
              });
            } else {
              return response;
            }
          });
        })
    );
  });