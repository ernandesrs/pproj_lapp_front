<template>
    <base-view page-title="Usuários" :breadcrumbs="[{ title: 'Usuários', to: { name: 'dashboard.users' } }]"
        :action-create="{ show: true, text: 'Novo usuário', to: { name: 'dashboard.users.create' } }">

        <table-comp
            :thumb="{ key: 'photo_url', alternativeKey: 'first_name', label: 'Foto', width: 35, height: 35, circle: true }"
            :action-get-list="method_getUsers" :action-change-page="method_changePage" :action-filter="method_filterList"
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
import setting from '@/utils/setting';

const method_getUsers = (d) => {
    let action = '/admin/users?limit=' + setting.getSetting('items_per_page');

    if (d?.urlParams) {
        action += '&' + d.urlParams;
    }

    return request({
        action: action,
        method: 'get'
    });
};

const method_changePage = (page) => {
    return method_getUsers({
        urlParams: 'page=' + page
    });
};

const method_filterList = (filterData) => {
    return method_getUsers(filterData);
};

</script>
