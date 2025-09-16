// Force cache clear for PWA updates - Enhanced version
if ('serviceWorker' in navigator && 'caches' in window) {
  console.log('Starting PWA cache clear...');
  
  // Unregister all service workers first
  navigator.serviceWorker.getRegistrations().then(registrations => {
    const unregisterPromises = registrations.map(registration => {
      console.log('Unregistering service worker');
      return registration.unregister();
    });
    
    return Promise.all(unregisterPromises);
  }).then(() => {
    // Clear all caches
    return caches.keys();
  }).then(cacheNames => {
    const deletePromises = cacheNames.map(cacheName => {
      console.log('Clearing cache:', cacheName);
      return caches.delete(cacheName);
    });
    
    return Promise.all(deletePromises);
  }).then(() => {
    console.log('All caches and service workers cleared');
    // Clear localStorage as well
    localStorage.clear();
    sessionStorage.clear();
    // Force reload without cache
    window.location.reload(true);
  }).catch(error => {
    console.error('Cache clear error:', error);
    window.location.reload(true);
  });
}