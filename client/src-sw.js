const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

const manifest = self.__WB_MANIFEST;

if(manifest) {
  precacheAndRoute(manifest);
  console.log('🚀 manifest: ', manifest);
}

console.log('🚀 Hello from service worker!');


const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/', '/manifest.json'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// : Implement asset caching
registerRoute(({url}) => url.pathname.startsWith('/assets/'),
  new CacheFirst({
    cacheName: "asset-cache",
  })
);

registerRoute(
  ({ url }) => url.pathname === '/manifest.json',
  new CacheFirst({
    cacheName: 'manifest-cache',
  })
);
