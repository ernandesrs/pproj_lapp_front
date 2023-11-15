<template>
    <v-navigation-drawer v-model="drawer" elevation="12" color="dark-3" location="start">

        <v-list>
            <v-list-item :prepend-icon="authStore.getPhoto == null ? 'mdi-account' : null"
                :prepend-avatar="authStore.getPhoto" :title="authStore.getFullName" :subtitle="authStore.getEmail" />
        </v-list>

        <v-divider></v-divider>

        <v-list>
            <template v-for="item in items" :key="item">
                <v-list-item v-if="item?.items == undefined" :title="item.text" :to="item.to" :prepend-icon="item.icon"
                    :active="(item.activeIn ?? []).includes(route.name)" />

                <template v-else>
                    <v-list-group>

                        <template v-slot:activator="{ props }">
                            <v-list-item v-bind="props" :title="item.text" :prepend-icon="item.icon" />
                        </template>

                        <template v-for="subItem in item.items" :key="subItem">
                            <v-list-item :title="subItem.text" :to="subItem.to" :prepend-icon="subItem.icon"
                                :active="(subItem.activeIn ?? []).includes(route.name)" />
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

watch(() => props.modelValue, (n) => {
    drawer.value = n;
}, { immediate: true })

watch(drawer, (n) => {
    emit('update:modelValue', n);
}, { immediate: true });

drawer.value = appStore.inMobile ? false : true;
items.value = config.navigation;

</script>
