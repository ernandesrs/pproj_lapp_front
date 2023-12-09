<template>
    <base-view page-title="Configurações"
        :breadcrumbs="[{ title: 'Configurações do sistema', to: { name: 'dashboard.settings.system' } }]"
        :loading="loading">
        <section-comp title="Lorem ipsum dolor" subtitle="Magnam laboriosam fugit">
            <template #content>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad nihil beatae voluptas provident laudantium
                    voluptate hic. Magnam laboriosam fugit explicabo!</p>
            </template>
        </section-comp>
    </base-view>
</template>

<script setup>

import BaseView from '@/layouts/default/BaseView.vue';
import { ref } from 'vue';
import SectionComp from '@/components/SectionComp.vue';

const loading = ref(true);

setTimeout(() => {
    loading.value = false;
}, 250);

</script>
