<template>
    <base-view no-container page-title="Configurações"
        :breadcrumbs="[{ title: 'Configurações local', to: { name: 'dashboard.settings.local' } }]" :loading="loading">
        <section-comp class="mb-5" elevation="1" title="Tema" subtitle="Tema escuro/claro">
            <template #content>
                <div class="py-2">
                    <v-select v-model="settingsData.theme"
                        :items="[{ title: 'Dark', value: 'dark' }, { title: 'Light', value: 'light' }]" label="Tema" />
                </div>
            </template>
        </section-comp>

        <section-comp class="mb-5" elevation="1" title="Listagens" subtitle="Quantidade de itens em uma lista">
            <template #content>
                <div class="py-2">
                    <v-text-field v-model="settingsData.items_per_page" label="Items por página" />
                </div>
            </template>
        </section-comp>

        <section-comp class="bg-transparent">
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
