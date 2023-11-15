// Utilities
import authToken from '@/utils/auth-token';
import { defineStore } from 'pinia'
import { useAlertStore } from './alert';
import { req } from '@/plugins/axios';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null
    }),
    actions: {
        addUser(user) {
            this.user = user;
        },
        logout() {
            req({
                action: '/account/auth/logout',
                method: 'post',
                data: null,
                success: () => {
                    authToken.remove();
                    useAlertStore().addFlashMessage('Pronto! Sua sessão foi encerrada com sucesso.', 'Sessão encerrada!', 'warning');
                    router.push({ name: 'auth.login' });
                }
            });
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
