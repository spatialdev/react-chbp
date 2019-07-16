if ('function' === typeof importScripts) {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js'
  );
  
  // global workbox
  if (workbox) {
    
    // injection point for manifest files.
    workbox.precaching.precacheAndRoute([]);
    
    // custom cache rules
    workbox.routing.registerNavigationRoute('/index.html', {
      blacklist: [/^\/_/, /\/[^\/]+\.[^\/]+$/],
    });
    
    /* 
      Custom cache rules - app images 
      Cache all image types.
      Get images from the cache first.  
      Fetch new images every 30 days so they are not stale - image update are NOT frequent. 
    */
    workbox.routing.registerRoute(
      /\.(?:png|gif|jpg|jpeg|svg)$/,
      workbox.strategies.cacheFirst({
        cacheName: 'chbp-images',
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
          })
        ],
      })
    );

    /* 
      Custom cache rules - json 
      Cache .json files.
      Fetch .json from the network first if possible (as they are updated frequently).
      Fallback to the cached .json if disconnected from the internet.
    */
    workbox.routing.registerRoute(
      new RegExp('.*\.json'),
      new workbox.strategies.NetworkFirst({
        cacheName: 'chbp-json'
      })
    );

    /* 
      Custom cache rules - map tiles 
      Cache map tiles from the external mapbox root url - for only successfull responses.
    */ 
    workbox.routing.registerRoute(
      new RegExp('^https://api.mapbox.com/v4/spatialdev.9w9i8weo,mapbox.mapbox-streets-v8,mapbox.mapbox-terrain-v2/'),
      new workbox.strategies.CacheFirst({
        cacheName: 'chbp-map-tile-cache',
        plugins: [
          new workbox.cacheableResponse.Plugin({
            statuses: [0, 200],
          })
        ]
      })
    );
    
    // Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
    workbox.routing.registerRoute(
      /^https:\/\/fonts\.googleapis\.com/,
      new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets'
      })
    );

    // Cache the underlying font files with a cache-first strategy for 1 year.
    workbox.routing.registerRoute(
      /^https:\/\/fonts\.gstatic\.com/,
      new workbox.strategies.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
          new workbox.cacheableResponse.Plugin({
            statuses: [0, 200]
          }),
          new workbox.expiration.Plugin({
            maxAgeSeconds: 60 * 60 * 24 * 365,
            maxEntries: 30
          }),
        ],
      })
    );
  } else {
    console.log('Workbox could not be loaded. No Offline support');
  }
}
  