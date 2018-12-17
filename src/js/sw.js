const CACHE_NAME = new Date().toISOString();

const { assets } = global.serviceWorkerOption;
console.log('ASSETS: ', assets);

let assetsToCache = [...assets, './'];
console.log('assetsToCache: ', assetsToCache);

assetsToCache = assetsToCache.map(path => {
	const res = new URL(path, global.location).toString();
	console.log('RES: ', res);
	return res;
});

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then((cache) => {
				return cache.addAll(assetsToCache);
			})
	);
});

self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(event.request).then((response) => {
			if (response) { // если страница нашлась в кеше
				return response;
			}

			return fetch(event.request).then((response) => { // если страницы нет в кеше и есть сеть то делаем запрос
				let shouldCache = response.ok;

				if (event.request.method === 'POST') { // проверка так как post unsupported
					shouldCache = false;
				}

				if (shouldCache) { // кладем копию ответа в кеш
					return caches.open(CACHE_NAME).then((cache) => {
						cache.put(event.request, response.clone());
						return response;
					});
				} else {
					return response;
				}
			}).catch((err) => {
				console.log('NET ERR', err);
			});
		})
	);
});
