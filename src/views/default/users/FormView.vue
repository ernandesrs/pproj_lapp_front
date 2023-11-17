<template>
    <base-view page-title="Editar/criar"
        :breadcrumbs="[{ title: 'Usuários', to: { name: 'dashboard.users' } }, { title: 'Novo usuário', to: { name: 'dashboard.users.create' } }]">
    </base-view>
</template>

<script setup>

import BaseView from '@/layouts/default/BaseView.vue';

</script>
