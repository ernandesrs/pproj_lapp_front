import authToken from '@/utils/auth-token';
import { request } from '@/plugins/axios';

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
            console.log('Access fail, access your account.');
            next({ name: 'auth.login' });
        } else {
            await request({
                action: '/me',
                method: 'get'
            }).then((resp) => {
                console.log('Access allowed, this is your profile data: ', resp.data.user);

                next();
            }).catch((resp) => {
                console.log('A error has ocurred: ', resp.response?.data?.error);

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
            route = { name: 'home' };
        }

        next(route);
    }
};

export default {
    redirectIf: redirectors
};