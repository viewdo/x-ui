// @ts-ignore

importScripts('workbox-v4.3.1/workbox-sw.js')

self.addEventListener('message', ({ data }) => {
  if (data === 'skipWaiting') {
    // @ts-ignore
    self.skipWaiting()
  }
})
// @ts-ignore
self.workbox.precaching.precacheAndRoute([])
