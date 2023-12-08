<template>
    <base-view :page-title="computed_isCreating ? 'Criar usuário' : 'Editar usuário'"
        :breadcrumbs="[{ title: 'Usuários', to: { name: 'dashboard.users' } }, { title: computed_isCreating ? 'Novo usuário' : 'Editar usuário', to: computed_isCreating ? { name: 'dashboard.users.create' } : { name: 'dashboard.users.edit', params: { user_id: formUser.data.id } } }]"
        :loading="loading">

        <!-- start -->
        <v-row justify="center">
            <v-col v-if="!computed_isCreating" cols="12" lg="4">

                <section-comp title="Foto do usuário" class="mb-4">
                    <template #content>
                        <div class="w-full d-flex flex-column align-center justify-center">
                            <thumb-comp :alternative-text="formUser.basicData.first_name"
                                :image-url="formUser.basicData.photo_url" max-width="175" max-height="175" elevated circle
                                border />
                        </div>
                    </template>
                </section-comp>

                <section-comp title="Funções atribuídas" subtitle="Funções atualmente atribuídas a este usuário.">
                    <template #content>
                        <v-row class="w-100">
                            <v-col cols="auto" v-if="formUser.data?.roles.length == 0">
                                <v-chip prepend-icon="mdi-shield-lock" text="Nenhuma função atribuída" density="compact"
                                    variant="text" color="light-darken-2" disabeld />
                            </v-col>
                            <v-col cols="auto" v-else v-for="role in formUser.data?.roles" :key="role" class="px-0">
                                <v-chip prepend-icon="mdi-shield-lock" :text="role.name" density="compact" variant="text"
                                    color="primary" :to="{ name: 'dashboard.roles.edit', params: { role_id: role.id } }" />
                            </v-col>
                            <v-col cols="12" class="text-right">
                                <v-btn variant="outlined"
                                    :text="formUser.data?.roles?.length ? 'Editar funções' : 'Atribuir funções'"
                                    :prepend-icon="formUser.data?.roles?.length ? 'mdi-pencil' : 'mdi-plus'" color="primary"
                                    :ripple="false"
                                    :to="{ name: 'dashboard.users.admins', query: { action: formUser.data?.roles?.length ? 'edit' : 'create', user_id: formUser.data.id } }"
                                    size="small" />
                            </v-col>
                        </v-row>
                    </template>
                </section-comp>
            </v-col>
            <v-col cols="12" :lg="!computed_isCreating ? 8 : 12">
                <v-form @submit.prevent="method_formSubmit">
                    <section-comp title="Dados básicos do usuário">
                        <template #content>
                            <basic-user-fields v-model="formUser.basicData" :errors="formUser.basicDataErrors" />

                            <v-row v-if="computed_isCreating">
                                <v-col cols="12">
                                    <v-text-field type="email" v-model="formUser.data.email" name="email" label="E-mail"
                                        id="email" :error-messages="formUser.dataErrors?.email" />
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field type="password" v-model="formUser.data.password" label="Senha"
                                        id="password" :error-messages="formUser.dataErrors?.password" />
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field type="password" v-model="formUser.data.password_confirmation"
                                        label="Confirmar senha" id="password_confirmation"
                                        :error-messages="formUser.dataErrors?.password_confirmation" />
                                </v-col>
                            </v-row>
                        </template>
                    </section-comp>

                    <v-row>
                        <v-col cols="12" class="text-right">
                            <v-btn type="submit" :text="computed_isCreating ? 'Registrar' : 'Atualizar'" color="primary"
                                prepend-icon="mdi-check" :loading="formUser.submitting" />
                        </v-col>
                    </v-row>
                </v-form>
            </v-col>
        </v-row>
        <!-- end -->

    </base-view>
</template>

<script setup>

import BaseView from '@/layouts/default/BaseView.vue';
import BasicUserFields from '@/components/views/BasicUserFields.vue';
import { req } from '@/plugins/requester';
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAlertStore } from '@/store/alert';
import ThumbComp from '@/components/ThumbComp.vue';
import SectionComp from '@/components/SectionComp.vue';

const loading = ref(true);
const route = useRoute();
const router = useRouter();
const alertStore = useAlertStore();

const formUser = reactive({
    creating: false,
    submitting: false,
    valid: false,
    basicData: {},
    basicDataErrors: {},
    data: {},
    dataErrors: {}
});

/**
 * 
 * 
 * Methods
 * 
 * 
 */
const method_getUser = () => {
    loading.value = true;

    const userId = route.params?.user_id;

    if (!userId) {
        formUser.creating = true;
        loading.value = false;
        return;
    }

    formUser.creating = false;
    formUser.data.id = userId;

    return req({
        action: '/admin/users/' + userId,
        method: 'get',
        success: (resp) => {
            formUser.data = resp.data.user;

            // basic
            formUser.basicData = resp.data.user;
        },
        finally: () => {
            loading.value = false;
        }
    });
};

const method_formSubmit = () => {
    formUser.submitting = true;

    let data = {
        first_name: formUser.basicData.first_name,
        last_name: formUser.basicData.last_name,
        username: formUser.basicData.username
    };

    if (computed_isCreating.value) {
        data = {
            ...data,
            email: formUser.data.email,
            password: formUser.data.password,
            password_confirmation: formUser.data.password_confirmation,
        };
    }

    return req({
        action: computed_isCreating.value ? '/admin/users' : '/admin/users/' + formUser.data.id,
        method: computed_isCreating.value ? 'post' : 'put',
        data: data,
        success: (resp) => {
            alertStore.addMessage(
                computed_isCreating.value ? 'Usuário foi registrado. Um link de verificação será enviado ao e-mail cadastrado.' : 'Os dados do usuário foram atualizados com sucesso.',
                computed_isCreating.value ? 'Usuário registrado!' : 'Usuário atualizado!',
                computed_isCreating.value ? 'success' : 'info'
            );

            if (computed_isCreating.value) {
                router.push({ name: 'dashboard.users', params: { user_id: resp.data.user.id } });
            }
        },
        fail: (resp) => {
            console.log(resp);
            formUser.dataErrors = resp.response.data.errors;

            // basic errors
            formUser.basicDataErrors = resp.response.data.errors;
        },
        finally: () => {
            loading.value = false;
            formUser.submitting = false;
        }
    });
};

/**
 * 
 * 
 * Computeds
 * 
 * 
 */
const computed_isCreating = computed(() => {
    return formUser.creating;
});

/**
 * 
 * 
 * Created
 * 
 * 
 */
method_getUser();

</script>
