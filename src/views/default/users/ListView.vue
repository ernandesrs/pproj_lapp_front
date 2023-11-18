<template>
    <base-view page-title="Usuários" :breadcrumbs="[{ title: 'Usuários', to: { name: 'dashboard.users' } }]"
        :action-create="{ show: true, text: 'Novo usuário', to: { name: 'dashboard.users.create' } }">

        <table-comp data-field="users"
            :thumb="{ key: 'photo_url', alternativeKey: 'first_name', label: 'Foto', width: 35, height: 35, circle: true }"
            :action-get-list="method_getUsers"
            :columns="[{ key: 'first_name', label: 'Nome' }, { key: 'last_name', label: 'Sobrenome' }, { key: 'email', label: 'Email' }]"
            :action-show="(info) => { return { name: 'dashboard.users.show', params: { user_id: info.id } } }"
            :action-edit="(info) => { return { name: 'dashboard.users.edit', params: { user_id: info.id } } }"
            :action-delete="(info) => { return '/admin/users/' + info.id; }" />

    </base-view>
</template>

<script setup>

import BaseView from '@/layouts/default/BaseView.vue';
import TableComp from '@/components/TableComp.vue';
import { request } from '@/plugins/requester';

const method_getUsers = (urlData) => {
    let action = '/admin/users';

    if (urlData?.urlParams) {
        action += '?' + urlData.urlParams;
    }

    return request({
        action: action,
        method: 'get'
    });
};

</script>