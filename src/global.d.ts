import type { AppStore } from './store/store.ts';

declare global {
  interface Window {
    Alpine: Alpine.Alpine;
  }
}

declare module 'alpinejs' {
  interface Stores {
    // Add your store name and its type here
    app: AppStore;
  }
}