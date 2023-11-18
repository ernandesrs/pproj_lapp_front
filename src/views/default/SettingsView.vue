<template>
    <base-view page-title="Configurações" :breadcrumbs="[{ title: 'Configurações', to: { name: 'dashboard.settings' } }]"
        :loading="loading">

        <v-sheet>
            <v-tabs v-model="settingsTab" color="primary" :align-tabs="'start'">
                <v-tab text="Configurações locais" prepend-icon="mdi-account-settings-outline" />
            </v-tabs>
            <v-window class="mt-8" v-model="settingsTab">

                <v-window-item>
                    <v-card>
                        <v-card-item>
                            <h3 class="mb-2">Configurações locais</h3>
                            <p class="text-dark-lighten-4">Aqui você realiza configurações relacionados ao seu ambiente
                                local.</p>
                        </v-card-item>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Tema
                        </v-card-title>
                        <v-card-text>
                            <v-select v-model="settingsData.theme"
                                :items="[{ title: 'Dark', value: 'dark' }, { title: 'Light', value: 'light' }]"
                                label="Tema" />
                        </v-card-text>
                    </v-card>

                    <v-card>
                        <v-card-title>
                            Listagem
                        </v-card-title>
                        <v-card-text>
                            <v-text-field v-model="settingsData.items_per_page" label="Items por página" />
                        </v-card-text>
                    </v-card>

                    <v-card>
                        <v-card-item>
                            <v-btn @click="method_updateLocalSettings" text="Savar configurações" color="primary"
                                prepend-icon="mdi-check" :loading="saving" />
                        </v-card-item>
                    </v-card>
                </v-window-item>
            </v-window>
        </v-sheet>

    </base-view>
</template>

<script setup>

import BaseView from '@/layouts/default/BaseView.vue';
import { reactive } from 'vue';
import { ref } from 'vue';
import setting from '@/utils/setting';
import { useAlertStore } from '@/store/alert';

const alertStore = useAlertStore();

const loading = ref(true);

const settingsTab = ref(0);

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
