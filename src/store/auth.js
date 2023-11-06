// Utilities
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null
    }),
    actions: {
        addUser(user) {
            this.user = user;
        }
    },
    getters: {
        isLogged() {
            return this.user?.id ? true : false;
        }
    }
})
