// Utilities
import { defineStore } from 'pinia'
import setting from '@/utils/setting';
import vuetify from '@/plugins/vuetify';

const defineTheme = () => {
  vuetify.theme.global.name.value = setting.getSetting('theme');
};

export const useAppStore = defineStore('app', {
  state: () => ({
    name: import.meta.env.VITE_APP_NAME,
    currentWindowSize: null,
    loadingContent: false
  }),

  getters: {
    getName() {
      return this.name;
    },
    inMobile() {
      return this.currentWindowSize >= 1280 ? false : true;
    },
    isLoadingContent() {
      return this.loadingContent;
    }
  },

  actions: {
    startApp() {
      this.currentWindowSize = window.innerWidth;

      window.addEventListener('resize', () => {
        this.currentWindowSize = window.innerWidth;
      });

      defineTheme();
    },
    setLoadingContent(s) {
      this.loadingContent = s;
    }
  }
})
