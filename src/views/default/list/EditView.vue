<template>
	<base-view page-title="Listagem" :breadcrumbs="[
		{ title: 'Listagem', to: { name: 'dashboard.list' } },
		{ title: 'Editar', to: { name: 'dashboard.list.edit', params: { user_id: itemId } } }
	]" :loading="loadingContent">

		<h1>EDITANDO ITEM: {{ itemId }}</h1>

	</base-view>
</template>

<script setup>

import BaseView from '@/layouts/default/BaseView.vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const itemId = ref(null);

const loadingContent = ref(true);

const route = useRoute();

itemId.value = route.params.user_id;

setTimeout(() => {
	loadingContent.value = false;
}, 1500);

</script>
