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
        },
        getPhoto() {
            return this.user?.photo_url ?? null;
        },
        getEmail() {
            return this.user.email;
        },
        getFullName() {
            return this.user.first_name + ' ' + this.user.last_name;
        },
        getUsername() {
            return this.user.username;
        }
    }
})
