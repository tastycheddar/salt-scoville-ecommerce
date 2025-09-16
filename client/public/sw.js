/**
 * Enhanced Service Worker - Salt & Scoville PWA
 * Provides advanced caching, background sync, and offline capabilities
 */

const CACHE_NAME = 'salt-scoville-v7';
const RUNTIME_CACHE = 'salt-scoville-runtime-v7';
const IMAGE_CACHE = 'salt-scoville-images-v7';
const API_CACHE = 'salt-scoville-api-v7';
const OFFLINE_CACHE = 'salt-scoville-offline-v7';

const PRECACHE_URLS = [
  '/',
  '/products',
  '/recipes',
  '/store-locator',
  '/wholesale',
  '/flava-dave',
  '/manifest.json?v=6',
  '/offline.html',
  '/favicon.svg?v=6',
  '/apple-touch-icon.svg?v=6',
  '/logo.png?v=6',
  '/logo-white.png?v=6'
];

// Cache expiration times
const CACHE_EXPIRATION = {
  images: 7 * 24 * 60 * 60 * 1000, // 7 days
  api: 5 * 60 * 1000, // 5 minutes
  pages: 24 * 60 * 60 * 1000 // 24 hours
};

// Installation event with improved caching
self.addEventListener('install', (event) => {
  console.log('[SW] Installing enhanced service worker v7 with GCS bypass...');
  
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => {
        console.log('[SW] Precaching core URLs...');
        return cache.addAll(PRECACHE_URLS);
      }),
      caches.open(RUNTIME_CACHE),
      caches.open(IMAGE_CACHE),
      caches.open(API_CACHE)
    ]).then(() => {
      console.log('[SW] All caches initialized');
      self.skipWaiting();
    })
  );
});

// Activation event with cache cleanup
self.addEventListener('activate', (event) => {
  console.log('[SW] Service worker activated');
  
  const expectedCaches = [CACHE_NAME, RUNTIME_CACHE, IMAGE_CACHE, API_CACHE, OFFLINE_CACHE];
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!expectedCaches.includes(cacheName)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim clients
      self.clients.claim()
    ])
  );
});

// Enhanced fetch handler with multiple caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle offline fallback for navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/offline.html');
      })
    );
    return;
  }

  // Handle images with network-first for PWA compatibility
  if (request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/)) {
    // For PWA: Always try network first, then cache
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            // Cache successful responses
            const responseClone = response.clone();
            caches.open(IMAGE_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
            return response;
          }
          throw new Error('Network response not ok');
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request).then(cachedResponse => {
            return cachedResponse || new Response('Image not found', { status: 404 });
          });
        })
    );
    return;
  }

  // Handle API requests with network-first + cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleAPIRequest(request));
    return;
  }

  // Handle static assets with cache-first
  if (url.pathname.match(/\.(js|css|woff2|woff|ttf)$/)) {
    event.respondWith(handleStaticAssets(request));
    return;
  }

  // Handle PayPal requests - always use network
  if (url.hostname.includes('paypal.com') || url.hostname.includes('paypalobjects.com')) {
    event.respondWith(fetch(request));
    return;
  }
  
  // Handle Google Cloud Storage requests - always use network to prevent blocking
  if (url.hostname.includes('storage.googleapis.com') || url.hostname.includes('storage.cloud.google.com')) {
    event.respondWith(fetch(request));
    return;
  }

  // Handle navigation requests with cache-first + network fallback
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Default: network-first with cache fallback
  event.respondWith(
    fetch(request).catch(() => 
      caches.match(request).then(response => 
        response || new Response('Offline content not available', { status: 503 })
      )
    )
  );
});

// Image caching with expiration
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    const cachedDate = new Date(cachedResponse.headers.get('sw-cached-date'));
    const now = new Date();
    
    if (now - cachedDate < CACHE_EXPIRATION.images) {
      return cachedResponse;
    }
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      responseToCache.headers.set('sw-cached-date', new Date().toISOString());
      cache.put(request, responseToCache);
    }
    return networkResponse;
  } catch (error) {
    return cachedResponse || new Response('Image not available offline', { status: 503 });
  }
}

// API request handling with intelligent caching
async function handleAPIRequest(request) {
  const cache = await caches.open(API_CACHE);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful GET requests
      if (request.method === 'GET') {
        const responseToCache = networkResponse.clone();
        cache.put(request, responseToCache);
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache for:', request.url);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Add offline indicator header
      const response = cachedResponse.clone();
      response.headers.set('x-served-by', 'service-worker-cache');
      return response;
    }
    
    return new Response(JSON.stringify({ error: 'Offline - data not available' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Static assets with long-term caching
async function handleStaticAssets(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return cachedResponse || new Response('Asset not available offline', { status: 503 });
  }
}

// Navigation requests with offline fallback
async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(RUNTIME_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return cached home page as fallback for navigation requests
    const homeCache = await cache.match('/');
    return homeCache || new Response('Offline page not available', { 
      status: 503, 
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Background sync for form submissions and cart updates
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-cart-sync') {
    event.waitUntil(syncCartData());
  }
  
  if (event.tag === 'background-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncCartData() {
  try {
    // Get pending cart updates from IndexedDB or localStorage
    const pendingUpdates = await getPendingCartUpdates();
    
    for (const update of pendingUpdates) {
      await fetch('/api/cart/sync', {
        method: 'POST',
        body: JSON.stringify(update),
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    await clearPendingCartUpdates();
    console.log('[SW] Cart sync completed');
  } catch (error) {
    console.log('[SW] Cart sync failed:', error);
  }
}

async function syncAnalytics() {
  try {
    // Sync any pending analytics data
    const pendingEvents = await getPendingAnalytics();
    
    for (const event of pendingEvents) {
      await fetch('/api/analytics/events', {
        method: 'POST',
        body: JSON.stringify(event),
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    await clearPendingAnalytics();
    console.log('[SW] Analytics sync completed');
  } catch (error) {
    console.log('[SW] Analytics sync failed:', error);
  }
}

// Placeholder functions for data persistence (implement based on your needs)
async function getPendingCartUpdates() {
  // Implement based on your storage method (IndexedDB/localStorage)
  return [];
}

async function clearPendingCartUpdates() {
  // Clear pending updates after successful sync
}

async function getPendingAnalytics() {
  // Implement based on your analytics storage
  return [];
}

async function clearPendingAnalytics() {
  // Clear pending analytics after successful sync
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);
  
  const options = {
    body: 'New hot sauce deals available!',
    icon: '/logo.png',
    badge: '/favicon.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Deals',
        icon: '/logo.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/logo.png'
      }
    ]
  };
  
  if (event.data) {
    const pushData = event.data.json();
    options.body = pushData.body || options.body;
    options.data = { ...options.data, ...pushData.data };
  }
  
  event.waitUntil(
    self.registration.showNotification('Salt & Scoville', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click received:', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/products')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for communication with main app
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      })
    );
  }
  
  if (event.data && event.data.type === 'PRELOAD_IMAGES') {
    event.waitUntil(preloadImages(event.data.urls));
  }
});

// Preload critical images
async function preloadImages(urls) {
  const cache = await caches.open(IMAGE_CACHE);
  
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        cache.put(url, response);
      }
    } catch (error) {
      console.log('[SW] Failed to preload image:', url);
    }
  }
}