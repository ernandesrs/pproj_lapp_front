import cookie from 'js-cookie';

const prefix = import.meta.env.VITE_APP_NAME;
const getKey = (key) => {
    return prefix.toLowerCase() + '_' + key;
}

export default {
    set: (key, value) => {
        cookie.set(getKey(key), value);
    },
    get: (key) => {
        return cookie.get(getKey(key));
    },
    remove: (key) => {
        cookie.remove(getKey(key));
    }
};