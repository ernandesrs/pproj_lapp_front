<template>
	<v-layout>
		<navigation-drawer v-model="navigation.drawer" />

		<v-app-bar border="b" flat density="default">
			<v-app-bar-nav-icon variant="text" @click.stop="navigation.drawer = !navigation.drawer" />

			<template #append>
				<v-btn-group density="compact">
					<v-btn :icon="notifications.total ? 'mdi-bell-badge' : 'mdi-bell'"
						:color="notifications.total ? 'danger' : 'primary'" variant="plain"
						:class="[notifications.total ? 'has-notifications' : '']" :ripple="false"
						id="notifications-button" />
				</v-btn-group>


				<v-menu activator="#notifications-button">
					<v-card class="px-0" width="300px">
						<v-card-title class="text-body-1 text-dark-lighten-4 px-6">
							{{ notifications.total }} notificações
						</v-card-title>
						<v-card-item>
						</v-card-item>
					</v-card>
				</v-menu>
			</template>

			<v-progress-linear v-if="appStore.isLoadingContent" color="primary" indeterminate height="6" absolute />
		</v-app-bar>

		<v-main>
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

const notifications = reactive({
	total: 0
});

appStore.startApp();

</script>

<style>
.v-btn>* {
	pointer-events: none;
}

.has-notifications {
	animation: hasNotification 1.25s ease 0s infinite alternate-reverse both;
}

@keyframes hasNotification {
	0% {
		animation-timing-function: ease-out;
		transform: scale(1);
		transform-origin: center center;
	}

	10% {
		animation-timing-function: ease-in;
		transform: scale(0.91);
	}

	17% {
		animation-timing-function: ease-out;
		transform: scale(0.98);
	}

	33% {
		animation-timing-function: ease-in;
		transform: scale(0.87);
	}

	45% {
		animation-timing-function: ease-out;
		transform: scale(1);
	}
}
</style>