import cookie from "@/plugins/cookie";

const API_TOKEN_KEY = "api_token";

export default {
    set: (token, expiration_in_minutes = 60) => {
        cookie.set(API_TOKEN_KEY, token, {
            expires: (expiration_in_minutes / 60) / 24
        });
    },

    get: () => {
        return cookie.get(API_TOKEN_KEY);
    },

    remove: () => {
        cookie.remove(API_TOKEN_KEY);
    }
}