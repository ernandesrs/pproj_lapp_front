<template>
    <base-view page-title="Detalhes"
        :breadcrumbs="[{ title: 'Usuários', to: { name: 'dashboard.users' } }, { title: 'Ver usuário' }]"
        :loading="data.getting">

        <!-- start -->
        {{ data.user }}
        <!-- end -->

    </base-view>
</template>

<script setup>

import BaseView from '@/layouts/default/BaseView.vue';
import { req } from '@/plugins/requester';
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();

const router = useRouter();

const data = reactive({
    getting: true,
    user: null
});

const method_getUser = () => {
    let userId = route.params.user_id;

    let action = '/admin/users/' + userId;

    return req({
        action: action,
        method: 'get',
        success: (resp) => {
            data.user = resp.data.user;
        },
        fail: () => {
            router.push({ name: 'dashboard.users' });
        },
        finally: () => {
            data.getting = false;
        }
    });
};

method_getUser();

</script>
