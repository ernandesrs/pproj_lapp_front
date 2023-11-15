<template>
	<v-layout>
		<navigation-drawer v-model="navigation.drawer" />

		<v-app-bar border="b" scroll-behavior="hide" scroll-threshold="250" flat density="comfortable">
			<v-app-bar-nav-icon variant="text" @click.stop="navigation.drawer = !navigation.drawer" />

			<template #append>
				<v-btn-group density="compact">
					<v-btn @click="method_toggleTheme" icon="mdi-brightness-6" variant="text" :ripple="false" />
				</v-btn-group>
			</template>
		</v-app-bar>

		<v-main class="py-10 mt-10" style="min-height: 300px;">
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
import { useTheme } from 'vuetify';

const appStore = useAppStore();

const navigation = reactive({
	drawer: false
});

const theme = useTheme();

const method_toggleTheme = () => {
	theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

appStore.startMonitors();

</script>
