// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    name: import.meta.env.VITE_APP_NAME,
    currentWindowSize: null
  }),

  getters: {
    getName() {
      return this.name;
    },
    inMobile() {
      return this.currentWindowSize >= 1280 ? false : true;
    }
  },

  actions: {
    startMonitors() {
      this.currentWindowSize = window.innerWidth;

      window.addEventListener('resize', () => {
        this.currentWindowSize = window.innerWidth;
      });
    }
  }
})
