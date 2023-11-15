<template>
	<v-layout>
		<navigation-drawer v-model="navigation.drawer" />

		<v-app-bar border="b" scroll-behavior="hide" scroll-threshold="250" flat density="comfortable" color="white">
			<v-app-bar-nav-icon variant="text" @click.stop="navigation.drawer = !navigation.drawer" />
		</v-app-bar>

		<v-main class="py-6 mt-12" style="min-height: 300px;">
			<alert-comp />
			<router-view />
		</v-main>
	</v-layout>
</template>

<script setup>

import AlertComp from '@/components/AlertComp.vue';
import NavigationDrawer from './NavigationDrawer.vue';
import { useAppStore } from '@/store/app';
import { reactive } from 'vue';

const appStore = useAppStore();

const navigation = reactive({
	drawer: false
});

appStore.startMonitors();

</script>
