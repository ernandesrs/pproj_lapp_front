<template>
    <base-view page-title="Atualizar senha">
        <template #form>
            <v-row class="py-2">
                <v-col cols="12">
                    <v-form @submit.prevent="method_submit">
                        <v-text-field :type="showPassword ? 'text' : 'password'" v-model="updatePasswordForm.data.password"
                            name="password" label="Senha" :disabled="!updatePasswordForm.hasToken"
                            :error-messages="updatePasswordForm.errors?.password"
                            :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye'"
                            @click:append-inner="showPassword = !showPassword" />

                        <v-text-field :type="showPassword ? 'text' : 'password'"
                            v-model="updatePasswordForm.data.password_confirmation" name="password_confirmation"
                            label="Senha" :disabled="!updatePasswordForm.hasToken"
                            :error-messages="updatePasswordForm.errors?.password_confirmation" />

                        <div class="py-5 d-flex justify-center items-center">
                            <v-btn type="submit" color="primary" :loading="updatePasswordForm.submitting"
                                :disabled="!updatePasswordForm.hasToken">Atualizar
                                senha</v-btn>
                        </div>
                    </v-form>
                </v-col>
            </v-row>
        </template>
    </base-view>
</template>
  
<script setup>

import BaseView from '@/layouts/auth/BaseView.vue';
import { req } from '@/plugins/requester.js';
import { useAlertStore } from '@/store/alert';
import { ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();

const router = useRouter();

const alertStore = useAlertStore();

const showPassword = ref(false);

const updatePasswordForm = reactive({
    submitting: false,
    hasToken: true,
    data: {
        token: null,
        password: null,
        password_confirmation: null
    },
    errors: {}
});

/**
 * 
 * 
 * Methods
 * 
 * 
 */

/**
 * Submit login form
 */
const method_submit = () => {
    updatePasswordForm.submitting = true;

    req({
        action: '/account/password/update/' + updatePasswordForm.data?.token,
        method: 'post',
        data: {
            password: updatePasswordForm.data.password,
            password_confirmation: updatePasswordForm.data.password_confirmation
        },
        success: () => {
            alertStore.addFlashMessage('Senha atualizada com sucesso, faça login com sua nova senha!', null, 'success');
            router.push({ name: 'auth.login' });
        },
        fail: (r) => {
            updatePasswordForm.errors = r.response.data?.errors;
        },
        finally: () => {
            updatePasswordForm.submitting = false;
        }
    });
};

const method_getToken = () => {
    const token = route.query?.token;

    if (!token) {
        alertStore.addMessage('Token de atualização de senha não encontrado, solicite um novo link de atualização de senha.', null, 'danger');
        updatePasswordForm.hasToken = false;
    } else {
        updatePasswordForm.data.token = token;
    }
};

method_getToken();

</script>