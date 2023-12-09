<template>
    <base-view page-title="Configurações"
        :breadcrumbs="[{ title: 'Configurações local', to: { name: 'dashboard.settings.local' } }]" :loading="loading">
        <section-comp title="Tema" subtitle="Tema escuro/claro">
            <template #content>
                <v-select v-model="settingsData.theme"
                    :items="[{ title: 'Dark', value: 'dark' }, { title: 'Light', value: 'light' }]" label="Tema" />
            </template>
        </section-comp>

        <section-comp title="Listagens" subtitle="Quantidade de itens em uma lista">
            <template #content>
                <v-text-field v-model="settingsData.items_per_page" label="Items por página" />
            </template>
        </section-comp>

        <section-comp>
            <template #content>
                <v-btn @click="method_updateLocalSettings" text="Salvar configurações" color="primary"
                    prepend-icon="mdi-check" :loading="saving" />
            </template>
        </section-comp>
    </base-view>
</template>

<script setup>

import BaseView from '@/layouts/default/BaseView.vue';
import { reactive } from 'vue';
import { ref } from 'vue';
import setting from '@/utils/setting';
import { useAlertStore } from '@/store/alert';
import SectionComp from '@/components/SectionComp.vue';

const alertStore = useAlertStore();

const loading = ref(true);

const saving = ref(false);

let settingsData = reactive({
    theme: 'light',
    items_per_page: 10
});

const method_getLocalSettings = () => {
    settingsData = setting.getSettings();
};

const method_updateLocalSettings = () => {
    saving.value = true;

    setTimeout(() => {
        setting.addSetting(settingsData);
        alertStore.addFlashMessage('Configurações locais atualizadas!', 'Atualizada!', 'info');
        saving.value = false;

        window.location.reload();
    }, 250);
};

setTimeout(() => {
    method_getLocalSettings();
    loading.value = false;
}, 250);

</script>
