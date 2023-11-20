<template>
    <base-view page-title="Administradores"
        :breadcrumbs="[{ title: 'Administradores', to: { name: 'dashboard.users.admins' } }]">

        <template #actionButtons>
            <v-btn text="Novo administrador" color="primary" prepend-icon="mdi-shield-lock" />
            <v-btn v-if="authStore.permissions('user').canList()" text="Usuários" color="primary"
                prepend-icon="mdi-account-group" variant="outlined" :to="{ name: 'dashboard.users' }" />
        </template>

        <table-comp data-field="users"
            :thumb="{ key: 'photo_url', alternativeKey: 'first_name', label: 'Foto', width: 35, height: 35, circle: true }"
            :show-filters="false" :action-get-list="method_getAdmins"
            :columns="[{ key: 'first_name', label: 'Nome' }, { key: 'last_name', label: 'Sobrenome' }, { key: 'email', label: 'Email' }]"
            show-list-actions>

            <template #listActionButtons>
                <v-btn title="Editar admin" icon="mdi-pencil" color="primary" variant="text" />
            </template>

        </table-comp>

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
