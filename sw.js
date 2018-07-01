const cacheVersion = 1.0;
const CACHE = `currency-converter-static-v${cacheVersion}`;
const urlsToCache = [
    'index.html',
    'countries.html',
    'css/bootstrap.min.css',
    'js/bootstrap/jquery.min.js',
    'js/bootstrap/popper.min.js',
    'js/bootstrap/bootstrap.min.js',
    'js/idb.js',
    'js/api.js',
    'js/main.js',
    'https://free.currencyconverterapi.com/api/v5/currencies'
];

function preCache() {
    return caches.open(CACHE).then(cache => {
        return cache.addAll(urlsToCache);
    });
}

function fromCache(request) {
    return caches.open(CACHE).then(cache => {
            return cache.match(request).then(matching => {
                return matching || Promise.reject('no-match');
            });
    })
}

function update(request) {
    return caches.open(CACHE).then(cache => {
        return fetch(request).then(response => {
            return cache.put(request, response);
        });
    });
}

self.addEventListener('install', event => {
    event.waitUntil(preCache());
});

self.addEventListener('fetch', event => {
    // Workaround for chrome bug ! xD
    if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin')
        return;

    event.waitUntil(update(event.request));
    event.respondWith(fromCache(event.request));
});