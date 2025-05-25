import { registerSW as registerVitePWA } from 'virtual:pwa-register';

export function registerSW() {
  if ('serviceWorker' in navigator) {
    // This code will only be executed if service workers are supported
    const updateSW = registerVitePWA({
      onNeedRefresh() {
        if (confirm('New content available. Reload?')) {
          updateSW(true);
        }
      },
      onOfflineReady() {
        console.log('App ready to work offline');
      },
    });
  }
}