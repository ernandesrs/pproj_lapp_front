<template>
	<v-layout>
		<v-navigation-drawer v-model="navigation.drawer" elevation="12" color="dark-3" location="start">

			<v-list>
				<v-list-item :prepend-icon="authStore.getPhoto == null ? 'mdi-account' : null"
					:prepend-avatar="authStore.getPhoto" :title="authStore.getFullName" :subtitle="authStore.getEmail" />
			</v-list>

			<v-divider></v-divider>

			<v-list>
				<template v-for="item in navigation.items" :key="item">
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
import { useAuthStore } from '@/store/auth';
import { useAppStore } from '@/store/app';
import { reactive } from 'vue';
import config from './../../../lappf.config';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();

const appStore = useAppStore();

const route = useRoute();

const navigation = reactive({
	drawer: false,
	items: []
});

appStore.startMonitors();

navigation.drawer = appStore.inMobile ? false : true;
navigation.items = config.navigation;

</script>
