<template>
    <v-navigation-drawer v-model="drawer" elevation="12" color="sidebar-darken-1" location="start">

        <v-list>
            <v-list-item :prepend-icon="authStore.getPhoto == null ? 'mdi-account' : null"
                :prepend-avatar="authStore.getPhoto" :title="authStore.getFullName" :subtitle="authStore.getEmail">
                <template v-slot:append>
                    <v-btn size="small" variant="text" icon="mdi-menu-down" id="profile-menu" />
                </template>
            </v-list-item>
        </v-list>

        <v-menu location="bottom right" activator="#profile-menu">
            <v-card min-width="225px">
                <v-card-item>
                    <div class="d-flex justify-space-between">
                        <v-btn :to="{ name: 'dashboard.profile' }" prepend-icon="mdi-account" text="Perfil" color="primary"
                            variant="text" size="small" />
                        <v-btn @click.stop="method_logout" prepend-icon="mdi-logout" text="Sair" color="danger"
                            variant="text" size="small" :loading="logouting" />
                    </div>
                </v-card-item>
            </v-card>
        </v-menu>

        <v-divider></v-divider>

        <v-list>
            <template v-for="item in items" :key="item">
                <v-list-item v-if="item?.items == undefined" :title="item.text" :to="item.to" :prepend-icon="item.icon"
                    :active="(item.activeIn ?? []).includes(route.name)" :ripple="false" />

                <template v-else>
                    <v-list-group>

                        <template v-slot:activator="{ props }">
                            <v-list-item v-bind="props" :title="item.text" :prepend-icon="item.icon" :ripple="false" />
                        </template>

                        <template v-for="subItem in item.items" :key="subItem">
                            <v-list-item :title="subItem.text" :to="subItem.to" :prepend-icon="subItem.icon"
                                :active="(subItem.activeIn ?? []).includes(route.name)" :ripple="false" />
                        </template>

                    </v-list-group>
                </template>

            </template>
        </v-list>
    </v-navigation-drawer>
</template>

<script setup>

import { useAuthStore } from '@/store/auth';
import { useAppStore } from '@/store/app';
import { useRoute } from 'vue-router';
import config from './../../../lappf.config';
import { ref, watch } from 'vue';

const props = defineProps({
    modelValue: {}
});

const emit = defineEmits({
    'update:modelValue': null
});

const appStore = useAppStore();

const authStore = useAuthStore();

const route = useRoute();

const drawer = ref(false);

const items = ref([]);

const logouting = ref(false);

const method_logout = () => {
    logouting.value = true;
    authStore.logout()
}

watch(() => props.modelValue, (n) => {
    drawer.value = n;
}, { immediate: true })

watch(drawer, (n) => {
    emit('update:modelValue', n);
}, { immediate: true });

drawer.value = appStore.inMobile ? false : true;
items.value = config.navigation;

</script>

<style>
.v-list-item .v-list-item__prepend .v-list-item__spacer {
    width: 20px !important;
}

.v-list-group .v-list-group__items .v-list-item {
    padding-inline-start: calc(0px + var(--indent-padding)) !important;
}
</style>