<template>
    <base-view page-title="Administradores"
        :breadcrumbs="[{ title: 'Administradores', to: { name: 'dashboard.users.admins' } }]"
        :action-create="{ show: true, text: 'Novo usuário', to: { name: 'dashboard.users.create' } }">

        <template #actionButtons>
            <v-btn text="Novo administrador" color="primary" prepend-icon="mdi-shield-lock" />
        </template>

        <table-comp data-field="users"
            :thumb="{ key: 'photo_url', alternativeKey: 'first_name', label: 'Foto', width: 35, height: 35, circle: true }"
            :show-filters="false" :action-get-list="method_getAdmins"
            :columns="[{ key: 'first_name', label: 'Nome' }, { key: 'last_name', label: 'Sobrenome' }, { key: 'email', label: 'Email' }]"
            :action-show="authStore.permissions('user').canShow() ? (info) => { return { name: 'dashboard.users.show', params: { user_id: info.id } } } : null"
            :action-edit="authStore.permissions('user').canEditAdmins() ? (info) => { return { name: 'dashboard.users.edit', params: { user_id: info.id } } } : null"
            :action-delete="authStore.permissions('user').canDeleteAdmins() ? (info) => { return '/admin/users/' + info.id; } : null" />

    </base-view>
</template>

<script setup>

import BaseView from '@/layouts/default/BaseView.vue';
import TableComp from '@/components/TableComp.vue';
import { request } from '@/plugins/requester';
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore();
const method_getAdmins = (urlData) => {
    let action = '/admin/admins';

    if (urlData?.urlParams) {
        action += '?' + urlData.urlParams;
    }

    return request({
        action: action,
        method: 'get'
    });
};

</script>
