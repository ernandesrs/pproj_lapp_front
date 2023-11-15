<template>
    <v-alert v-model="show" transition="scroll-x-transition" closable :color="alert.color + '-lighten-1'" border="start"
        :border-color="alert.color + '-darken-1'" elevation="3" :icon="alert.icon" :title="alert.title" :text="alert.text"
        class="fixed-alert" />
</template>

<script setup>

import { ref, reactive, watch } from 'vue';
import { useAlertStore } from '@/store/alert';
import { useRoute } from 'vue-router';

/**
 * 
 * 
 * Vars and constants
 * 
 * 
 */
const alertStore = useAlertStore();

const currentRoute = useRoute();

const icons = {
    'success': 'mdi-check-circle-outline',
    'info': 'mdi-information-outline',
    'danger': 'mdi-alert-circle-outline',
    'error': 'mdi-close-circle-outline',
    'warning': 'mdi-alert-circle-outline',
};

const show = ref(false);

const alert = reactive({
});

/**
 * 
 * 
 * Computed
 * 
 * 
 */
const computed_alertFromStore = () => {
    return alertStore;
};

/**
 * 
 * 
 * Watch
 * 
 * 
 */
watch(computed_alertFromStore, (n) => {
    if (n?.id) {
        const call = () => {
            alert.text = n.alert.message;
            alert.title = n.alert.title;
            alert.type = n.alert.type;
            alert.id = n.id;
        };

        if (alert?.id == n.id) {
            return;
        }

        if (alert?.text) {
            show.value = false;

            // time to execute the close animation
            setTimeout(() => {
                // fill alert var with new values
                call();
            }, 300);
        } else {
            // fill alert var with new values
            call();
        }
    }
}, { immediate: true, deep: true });

watch(alert, (n) => {
    if (!n?.id) {
        return;
    }

    alert.color = n?.type ?? 'info';
    alert.icon = icons[n?.type ?? 'info'];

    show.value = true;
}, { deep: true });

/**
 * On route change, check for flash alert
 */
watch(currentRoute, (n) => {
    if (!n) {
        return;
    }

    alertStore.getFlashAlert();
}, { deep: true, immediate: true });

/**
 * 
 * 
 * Methods
 * 
 * 
 */

</script>

<style scoped>
.fixed-alert {
    width: calc(100% - 40px);
    max-width: 475px;
    position: fixed;
    z-index: 1005;
    top: 20px;
    right: 20px;
    color: #fff !important;
}
</style>
