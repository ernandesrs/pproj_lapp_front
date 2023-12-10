<template>
	<v-layout>
		<navigation-drawer v-model="navigation.drawer" />

		<v-app-bar border="b" flat density="default">
			<v-app-bar-nav-icon variant="text" @click.stop="navigation.drawer = !navigation.drawer" />

			<template #append>
				<v-btn :prepend-icon="notificationStore.total_unread ? 'mdi-bell-badge' : 'mdi-bell'"
					:text="'' + notificationStore.total_unread"
					:color="notificationStore.total_unread ? 'danger' : 'primary'" variant="text"
					:class="[notificationStore.total_unread ? 'has-notifications' : '']" :ripple="false"
					id="notifications-button" />

				<v-menu activator="#notifications-button" :close-on-content-click="false">
					<v-card class="px-0" width="100%" max-width="375px" max-height="475px">
						<v-card-title class="text-body-1 text-dark-lighten-4 px-6">
							{{ notificationStore.total_unread }} notificações não lidas
						</v-card-title>
						<v-card-item>
							<v-list>
								<v-list-item v-for="notification in notificationStore.all" :key="notification.id"
									:title="notificationStore.getTitle(notification.type)"
									:subtitle="notificationStore.getSubtitle(notification.type, notification?.data?.user?.first_name + ' ' + notification?.data?.user?.last_name)"
									:prepend-icon="notificationStore.getIcon(notification.type)"
									:class="[(notification?.read_at ? 'text-light-darken-2' : ''), 'mb-2']">

									<template #append>
										<v-btn-group density="compact">
											<v-btn @click="notificationStore.markAsRead(notification.id)" icon="mdi-check"
												:color="notification.read_at ? 'light-darken-1' : 'success'" variant="plain"
												:loading="notification?.loading" />
										</v-btn-group>
									</template>
								</v-list-item>
							</v-list>
						</v-card-item>
					</v-card>
				</v-menu>
			</template>

			<v-progress-linear v-if="appStore.isLoadingContent" color="primary" indeterminate height="6" absolute />
		</v-app-bar>

		<v-main class="bg-base-background">
			<alert-comp />
			<router-view />
		</v-main>
	</v-layout>
</template>

<script setup>

import AlertComp from '@/components/AlertComp.vue';
import NavigationDrawer from './NavigationDrawer.vue';
import { useAppStore } from '@/store/app';
import { useNotificationStore } from '@/store/notification';
import { reactive } from 'vue';

const appStore = useAppStore();

const notificationStore = useNotificationStore();

const navigation = reactive({
	drawer: false
});

appStore.startApp();
notificationStore.start();

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