<template>
	<v-layout>
		<navigation-drawer v-model="navigation.drawer" />

		<v-app-bar border="b" flat density="comfortable">
			<v-app-bar-nav-icon variant="text" @click.stop="navigation.drawer = !navigation.drawer" />

			<template #append>
				<v-btn-group density="compact">
				</v-btn-group>
			</template>

			<v-progress-linear v-if="appStore.isLoadingContent" color="primary" indeterminate height="6" absolute />
		</v-app-bar>

		<v-main style="min-height: 300px;">
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

appStore.startApp();

</script>

<style>
.v-btn>* {
	pointer-events: none;
}
</style>