<template>
    <base-view page-title="Usuários" :breadcrumbs="[{ title: 'Usuários', to: { name: 'dashboard.users' } }]"
        :action-create="{ show: true, to: { name: 'dashboard.users.create' } }">

        <list-comp :action-get-list="method_getUsers" :action-change-page="method_changePage"
            :action-filter="method_filterList"
            :columns="[{ key: 'first_name', label: 'Nome' }, { key: 'last_name', label: 'Sobrenome' }, { key: 'username', label: 'Usuário' }, { key: 'email', label: 'Email' }]" />

    </base-view>
</template>

<script setup>

import BaseView from '@/layouts/default/BaseView.vue';
import ListComp from '@/components/ListComp.vue';
import { request } from '@/plugins/requester';

const method_getUsers = (d) => {
    let action = '/admin/users?limit=5';

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
