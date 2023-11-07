// Utilities
import { defineStore } from 'pinia'
import cookie from '@/plugins/cookie';

export const useAlertStore = defineStore('alert', {
    state: () => ({
        alert: {
            title: null,
            message: null,
            duration: null,
            type: 'success',
        },
        id: null
    }),
    getters: {
    },
    actions: {
        addMessage(message, title, type = 'success', duration = null) {
            this.alert.title = title;
            this.alert.message = message;
            this.alert.type = type;
            this.alert.duration = duration;

            this.id = (new Date).getTime()
        },
        addFlashMessage(message, title, type = 'success', duration = null) {
            const alert = {
                title: title,
                message: message,
                type: type,
                duration: duration
            };

            cookie.set('flash_alert', JSON.stringify(alert));
        },
        getFlashAlert() {
            let alert = cookie.get('flash_alert');

            if (!alert) {
                return;
            }

            cookie.remove('flash_alert');

            alert = JSON.parse(alert);

            this.alert = alert;
            this.id = (new Date).getTime();

            console.log(this.alert);
        }
    }
})
