<template>
    <base-view :page-title="computed_isCreating ? 'Nova função' : 'Editar função'"
        :breadcrumbs="[{ title: 'Funções', to: { name: 'dashboard.roles' } }, { title: computed_isCreating ? 'Criar' : 'Editar', to: computed_isCreating ? { name: 'dashboard.roles.create' } : { name: 'dashboard.roles.edit', params: { role_id: roleForm?.id } } }]"
        :loading="loading">

        <v-sheet>
            <v-form @submit.prevent="method_submitForm">
                <v-row justify="center" class="mb-5">
                    <v-col cols="12" :lg="computed_isCreating ? '12' : '4'">
                        <v-text-field v-model="roleForm.data.name" label="Nome da função"
                            :error-messages="roleForm.errors?.name" />
                        <div class="text-center">
                            <v-btn type="submit" :text="computed_isCreating ? 'Salvar função' : 'Atualizar função'"
                                prepend-icon="mdi-check" color="primary" :loading="roleForm.submitting" />
                        </div>
                    </v-col>
                    <v-col v-if="!computed_isCreating" cols="12" lg="8">
                        <v-expansion-panels :disabled="roleForm.data.protected ? true : false">
                            <v-expansion-panel v-for="manageable, manageableIndex in roleForm.data.manageables"
                                :key="manageable" :title="'Permissões sobre ' + getTerms.roles.manageables(manageableIndex)"
                                :ripple="false">
                                <v-expansion-panel-text>
                                    <div class="d-flex flex-wrap">
                                        <div cols="6" sm="4" md="3" v-for="action, actionIndex in manageable" :key="action">
                                            <v-switch v-model="manageable[actionIndex]"
                                                :label="getTerms.roles.actions(actionIndex)" class="mr-6" />
                                        </div>
                                    </div>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-col>
                </v-row>
            </v-form>
        </v-sheet>

    </base-view>
</template>

<script setup>

import BaseView from '@/layouts/default/BaseView.vue';
import { ref } from 'vue';
import { req } from '@/plugins/requester';
import { useRoute, useRouter } from 'vue-router';
import { reactive, computed } from 'vue';
import { useAlertStore } from '@/store/alert';
import { getTerms } from '@/utils/helpers';

const loading = ref(true);
const route = useRoute();
const router = useRouter();
const alertStore = useAlertStore();
const roleForm = reactive({
    submitting: false,
    data: {},
    errors: {}
});

const method_getRole = () => {
    const roleId = route.params?.role_id;
    if (!roleId) {
        loading.value = false;
        return;
    }

    return req({
        action: '/admin/roles/' + roleId,
        method: 'get',
        success: (resp) => {
            roleForm.data = resp.data.role;
        },
        finally: () => {
            loading.value = false;
        }
    });
};

const method_submitForm = () => {
    roleForm.submitting = true;

    return req({
        action: computed_isCreating.value ? '/admin/roles' : '/admin/roles/' + roleForm.data.id,
        method: computed_isCreating.value ? 'post' : 'put',
        data: roleForm.data,
        success: (resp) => {
            alertStore.addMessage(
                computed_isCreating.value ? 'Nova função criada! Edite a função e determine as suas regras.' : 'Os dados da função foram atualizados com sucesso.',
                computed_isCreating.value ? 'Função registrada!' : 'Função atualizada!',
                computed_isCreating.value ? 'success' : 'info'
            );

            if (computed_isCreating.value) {
                router.push({ name: 'dashboard.roles.edit', params: { role_id: resp.data.role.id } });
            }
        },
        fail: (resp) => {
            roleForm.errors = resp.response?.data?.errors;
        },
        finally: () => {
            roleForm.submitting = false;
        }
    });
};

const computed_isCreating = computed(() => {
    return route.params?.role_id ? false : true;
});

/**
 * 
 * 
 * Created
 * 
 * 
 */

method_getRole();

</script>

