console.log("🌶️ Salt & Scoville PWA Icon Update v5");
if("serviceWorker" in navigator && "caches" in window) {
  console.log("Clearing PWA caches for new icons...");
  caches.keys().then(names => {
    console.log("Found caches:", names);
    return Promise.all(names.map(name => caches.delete(name)));
  }).then(() => {
    console.log("All caches cleared");
    return navigator.serviceWorker.getRegistrations();
  }).then(regs => {
    console.log("Unregistering service workers:", regs.length);
    return Promise.all(regs.map(reg => reg.unregister()));
  }).then(() => {
    console.log("Forcing reload with new Salt & Scoville icons");
    localStorage.setItem('pwa-icon-update', '5');
    window.location.href = window.location.href + '?icon-v5=' + Date.now();
  }).catch(err => {
    console.error("PWA update error:", err);
    window.location.reload(true);
  });
} else {
  window.location.reload(true);
}