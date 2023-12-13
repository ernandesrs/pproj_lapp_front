<template>
    <base-view page-title="Esqueci a senha">
        <template #form>
            <v-row>
                <v-col v-if="forgetForm.recoveryLinkHasSent">
                    <v-alert type="success" variant="outlined">
                        Um link de recuperação foi enviado para o e-mail fornecido.
                    </v-alert>
                </v-col>
                <v-col v-else cols="12">
                    <v-form @submit.prevent="method_submit">
                        <v-row class="py-2">
                            <v-col cols="12">
                                <v-text-field v-model="forgetForm.data.email" name="email" label="E-mail"
                                    :disabled="forgetForm.submitting" :error-messages="forgetForm.errors?.email" />
                            </v-col>

                            <v-col cols="12" class="py-5 d-flex justify-space-between items-center">
                                <v-btn flat :to="{ name: 'auth.login' }">Fazer login</v-btn>
                                <v-btn type="submit" color="primary" :loading="forgetForm.submitting">Recuperar
                                    senha</v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-col>
            </v-row>
        </template>
    </base-view>
</template>
  
<script setup>

import BaseView from '@/layouts/auth/BaseView.vue';
import { req } from '@/plugins/requester.js';
import { reactive } from 'vue';

const forgetForm = reactive({
    submitting: false,
    recoveryLinkHasSent: false,
    data: {
        email: null
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
    forgetForm.submitting = true;

    req({
        action: '/account/password/forget',
        method: 'post',
        data: {
            email: forgetForm.data.email
        },
        success: () => {
            forgetForm.recoveryLinkHasSent = true;
        },
        fail: (r) => {
            forgetForm.errors = r.response.data?.errors;
        },
        finally: () => {
            forgetForm.submitting = false;
        }
    });
}

</script>