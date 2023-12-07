<template>
    <base-view page-title="Funções" :breadcrumbs="[{ title: 'Funções', to: { name: 'dashboard.roles' } }]"
        :action-create="{ show: authStore.permissions('role').canCreate(), text: 'Nova função', to: { name: 'dashboard.roles.create' } }">

        <table-comp data-field="roles"
            :columns="[{ key: 'name', label: 'Função' }]"
            :action-get-list="method_getRoles"
            :action-edit="authStore.permissions('role').canEdit() ? (item) => { return { name: 'dashboard.roles.edit', params: { role_id: item.id } }; } : null"
            :action-delete="authStore.permissions('role').canDelete() ? (item) => { return '/admin/roles/' + item.id; } : null" />

    </base-view>
</template>

<script setup>

import BaseView from '@/layouts/default/BaseView.vue';
import TableComp from '@/components/TableComp.vue';
import { request } from '@/plugins/requester';
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore();

const method_getRoles = (d) => {
    let action = '/admin/roles';

    if (d?.urlParams) {
        action += '?' + d.urlParams;
    }

    return request({
        action: action,
        method: 'get'
    });
};

</script>