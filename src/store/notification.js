import { req } from "@/plugins/requester";
import { defineStore } from "pinia";

/**
 * 
 * Mais tipos na documentação da API:
 * https://documenter.getpostman.com/view/15369452/2s9YR57vX9
 * 
 * na seção: \Administrative\Notification
 * 
 */
const notificationTypes = {
    'App_Notifications_UserRegisteredNotification': {
        title: 'Registro de usuário',
        subtitle: ':id: se registrou no site',
        icon: 'mdi-account-plus'
    }
};

let autoloadNotificationHandler = null;

const useNotificationStore = defineStore('notification', {
    state: () => ({
        unread: [],
        all: [],
        total: 0,
        total_unread: 0
    }),
    getters: {
    },
    actions: {
        start() {
            get();
            autoload();
        },
        getTitle(type) {
            return notificationTypes[type]?.title ?? 'Unknown notification'
        },
        getSubtitle(type, id) {
            return notificationTypes[type]?.subtitle ? (notificationTypes[type]?.subtitle.replace(':id:', id)) : 'Unknown notification subtitle'
        },
        getIcon(type) {
            return notificationTypes[type]?.icon ?? '';
        },


        markAsRead(id) {
            let find = this.all.find((n) => { return n.id == id });
            let action = find?.read_at ? '/admin/notifications/' + id + '/mark-as-unread' : '/admin/notifications/' + id + '/mark-as-read';

            find.loading = true;
            return req({
                action: action,
                method: 'patch',
                success: () => {
                    if (find?.read_at) {
                        find.read_at = null;

                        this.total_unread++;
                    } else {
                        find.read_at = (new Date()).getTime();

                        if (this.total_unread > 0) {
                            this.total_unread--;
                        }
                    }
                },
                finally: () => {
                    find.loading = false;
                }
            });
        },
    },
});

const get = () => {
    return req({
        action: '/admin/notifications',
        method: 'get',
        success: (r) => {
            useNotificationStore().all = r.data.notifications?.list ?? [];
            useNotificationStore().total = useNotificationStore().all?.length;
            useNotificationStore().unread = r.data.unread_notifications?.list ?? [];
            useNotificationStore().total_unread = useNotificationStore().unread?.length;
        }
    });
};

const autoload = () => {
    if (autoloadNotificationHandler) {
        return;
    }

    autoloadNotificationHandler = setInterval(() => {
        get();
    }, 30000);
};

export { useNotificationStore };