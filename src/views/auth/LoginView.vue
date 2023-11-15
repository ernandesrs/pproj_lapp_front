<template>
    <base-view page-title="Login">
        <template #form>
            <v-form @submit.prevent="method_submit">
                <v-text-field v-model="userForm.data.email" name="email" label="E-mail" :disabled="userForm.submitting" />
                <v-text-field :type="showPassword ? 'text' : 'password'" v-model="userForm.data.password" name="password"
                    label="Senha" :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                    @click:append-inner="showPassword = !showPassword" :disabled="userForm.submitting" />

                <div class="py-5 d-flex justify-space-between items-center">
                    <v-btn flat>Esquecia a senha</v-btn>
                    <v-btn type="submit" color="primary-1" :loading="userForm.submitting">Fazer login</v-btn>
                </div>
            </v-form>
        </template>
    </base-view>
</template>
  
<script setup>

import BaseView from '@/layouts/auth/BaseView.vue';
import { req } from '@/plugins/axios';
import authToken from '@/utils/auth-token';
import { ref, reactive } from 'vue';
import router from '@/router';
import { useAlertStore } from '@/store/alert';

const alertStore = useAlertStore();

const showPassword = ref(false);

const userForm = reactive({
    submitting: false,
    data: {
        email: null,
        password: null
    }
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
    userForm.submitting = true;

    req({
        action: '/account/auth/login',
        method: 'post',
        data: {
            email: userForm.data.email,
            password: userForm.data.password
        },
        success: (r) => {
            authToken.set(r.data.token);

            alertStore.addFlashMessage('Pronto! Agora você já está logado(a).', 'Login efetuado!', 'success');

            router.push({ name: 'dashboard.home' });
        },
        fail: (r) => {
            alertStore.addMessage('Falha ao fazer login.', 'Erro: ' + r.response?.data?.error, 'danger');
        },
        finally: () => {
            userForm.submitting = false;
        }
    });
}

</script>
  