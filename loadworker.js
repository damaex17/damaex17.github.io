if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceworker.js', { scope: '/' })
      .then(() => console.log('service worker registered'))
      .catch(() => console.error('service worker registration failed'));
  });
}

