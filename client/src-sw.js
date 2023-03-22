const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

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
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

const PageCacheCallBack = ({ request }) => {
  console.log('🚀 PageCacheCallBack: ', request)

  return request.mode === 'navigate'}

registerRoute(PageCacheCallBack, pageCache);

// TODO: Implement asset caching
registerRoute(/\.(?:png|jpg|jpeg|svg)$/, new workbox.CacheFirst({
    "cacheName": "images",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 2
    })]
  }), 'GET');
