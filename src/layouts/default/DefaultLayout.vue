<template>
  <v-layout>
    <v-navigation-drawer v-model="navigation.drawer" elevation="12" color="dark-3" location="start">
      <v-list>
        <v-list-item :prepend-icon="authStore.getPhoto == null ? 'mdi-account' : null"
          :prepend-avatar="authStore.getPhoto" :title="authStore.getFullName" :subtitle="authStore.getEmail" />
      </v-list>
      <v-divider></v-divider>
    </v-navigation-drawer>

    <v-app-bar border="b" scroll-behavior="hide" scroll-threshold="250" flat density="comfortable" color="white">
      <v-app-bar-nav-icon variant="text" @click.stop="navigation.drawer = !navigation.drawer"></v-app-bar-nav-icon>
      <v-app-bar-title class="d-none d-md-inline-block">
        <v-btn color="primary" :to="{ name: 'dashboard.home' }" :title="appStore.getName" :text="appStore.getName"
          variant="plain"></v-btn>
      </v-app-bar-title>
    </v-app-bar>

    <v-main class="py-6 mt-12" style="min-height: 300px;">
      <alert-comp />
      <router-view />
    </v-main>
  </v-layout>
</template>

<script setup>

import AlertComp from '@/components/AlertComp.vue';
import { useAuthStore } from '@/store/auth';
import { useAppStore } from '@/store/app';
import { reactive } from 'vue';

const authStore = useAuthStore();

const appStore = useAppStore();

const navigation = reactive({
  drawer: false
});

appStore.startMonitors();

navigation.drawer = appStore.inMobile ? false : true;

</script>
