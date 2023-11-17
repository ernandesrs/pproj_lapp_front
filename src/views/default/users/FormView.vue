<template>
    <base-view :page-title="computed_isCreating ? 'Criar usuário' : 'Editar usuário'"
        :breadcrumbs="[{ title: 'Usuários', to: { name: 'dashboard.users' } }, { title: computed_isCreating ? 'Novo usuário' : 'Editar usuário', to: computed_isCreating ? { name: 'dashboard.users.create' } : { name: 'dashboard.users.edit', params: { user_id: formUser.data.id } } }]"
        :loading="loading">

        <!-- start -->
        <v-sheet>
            <v-row justify="center">
                <v-col cols="12" sm="10" md="8" lg="6">
                    <v-form @submit.prevent="method_formSubmit">
                        <basic-user-fields v-model="formUser.basicData" :errors="formUser.basicDataErrors" />

                        <v-row v-if="computed_isCreating">
                            <v-col cols="12">
                                <v-text-field type="email" v-model="formUser.data.email" name="email" label="E-mail"
                                    id="email" :error-messages="formUser.dataErrors?.email" />
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field type="password" v-model="formUser.data.password" label="Senha" id="password"
                                    :error-messages="formUser.dataErrors?.password" />
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field type="password" v-model="formUser.data.password_confirmation"
                                    label="Confirmar senha" id="password_confirmation"
                                    :error-messages="formUser.dataErrors?.password_confirmation" />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" class="text-right">
                                <v-btn type="submit" :text="computed_isCreating ? 'Registrar' : 'Atualizar'" color="primary"
                                    prepend-icon="mdi-check" :loading="formUser.submitting" />
                            </v-col>
                        </v-row>
                    </v-form>
                </v-col>
            </v-row>
        </v-sheet>
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

const route = useRoute();

const router = useRouter();

const alertStore = useAlertStore();

const loading = ref(true);

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
}

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
