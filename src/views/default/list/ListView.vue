<template>
	<base-view page-title="Listagem" :breadcrumbs="[
		{ title: 'Listagem', to: { name: 'dashboard.list' } }
	]">

		<list-comp :items="items" :columns="[
			{
				key: 'first_name',
				label: 'Nome'
			},
			{
				key: 'last_name',
				label: 'Sobrenome'
			},
			{
				key: 'email',
				label: 'E-mail'
			}
		]" :action-show="(data) => {
	return {
		name: 'dashboard.list.show',
		params: {
			user_id: data.id
		}
	};
}" :action-edit="(data) => {
	return {
		name: 'dashboard.list.edit',
		params: {
			user_id: data.id
		}
	};
}" :action-delete="(data) => {
	// return the delete item endpoint in backend
	// like: /admin/users/10
	return null;
}" />

	</base-view>
</template>

<script setup>

import BaseView from '@/layouts/default/BaseView.vue';
import ListComp from '@/components/ListComp.vue';

let items = [
	{
		id: 1,
		first_name: 'John',
		last_name: 'Dear',
		email: 'john@mail.com'
	},
	{
		id: 1,
		first_name: 'Johnny',
		last_name: 'Dear',
		email: 'johmdn@mail.com'
	},
	{
		id: 2,
		first_name: 'Mary',
		last_name: 'Mrie',
		email: 'mry@mail.com'
	},
	{
		id: 3,
		first_name: 'Kabe',
		last_name: 'Donty',
		email: 'kdonty@mail.com'
	},
	{
		id: 4,
		first_name: 'Judity',
		last_name: 'Depto',
		email: 'judity@mail.com'
	},
	{
		id: 5,
		first_name: 'Alany',
		last_name: 'Dups',
		email: 'alany@mail.com'
	},
	{
		id: 6,
		first_name: 'Karol',
		last_name: 'Dumvers',
		email: 'kdum@mail.com'
	},
	{
		id: 7,
		first_name: 'Tony',
		last_name: 'Dark',
		email: 'tdark@mail.com'
	},
	{
		id: 8,
		first_name: 'Nat',
		last_name: 'Romuf',
		email: 'natrom@mail.com'
	}
];

// items = [];

</script>
