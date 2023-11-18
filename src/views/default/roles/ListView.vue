<template>
    <base-view page-title="Funções" :breadcrumbs="[{ title: 'Funções', to: { name: 'dashboard.roles' } }]"
        :action-create="{ show: true, text: 'Nova função', to: { name: 'dashboard.roles.create' } }">

        <table-comp data-field="roles"
            :columns="[{ key: 'name', label: 'Função' }, { key: 'is_super', label: 'Super admin' }, { key: 'protected', label: 'Protegido/Do sistema' }]"
            :action-get-list="method_getRoles" :action-delete="(item) => { return '/admin/roles/' + item.id; }" />

    </base-view>
</template>

<script setup>

import BaseView from '@/layouts/default/BaseView.vue';
import TableComp from '@/components/TableComp.vue';
import { request } from '@/plugins/requester';

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