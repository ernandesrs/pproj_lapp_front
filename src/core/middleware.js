import authToken from '@/utils/auth-token';
import { request } from '@/plugins/requester';
import { useAuthStore } from '@/store/auth';
import { useAlertStore } from '@/store/alert';

const redirectors = {
    /**
     * Redirect if user is not authenticated
     * 
     * @param {*} to 
     * @param {*} from 
     * @param {*} next 
     */
    unauthenticated: async (to, from, next) => {
        let theToken = authToken.get();

        if (!theToken) {
            useAlertStore().addFlashMessage('Você não está autenticado, faça login.', 'Necessário login', 'danger');

            next({ name: 'auth.login' });
        } else {
            await request({
                action: '/account/me',
                method: 'get'
            }).then((resp) => {
                useAuthStore().addUser(resp.data.user);

                next();
            }).catch((resp) => {
                useAlertStore().addMessage('A error has ocurred', 'Erro: ' + resp.response?.data?.error, 'danger');

                authToken.remove();
                next({ name: 'auth.login' });
            });
        }

    },

    /**
     * Redirect if has authenticated user
     * 
     * @param {*} to 
     * @param {*} from 
     * @param {*} next 
     */
    authenticated: (to, from, next) => {
        let theToken = authToken.get();
        let route = null;

        if (theToken) {
            route = { name: 'dashboard.home' };
        }

        next(route);
    }
};

export default {
    redirectIf: redirectors
};