<template>
    <base-view :page-title="computed_isCreating ? 'Criar usuário' : 'Editar usuário'"
        :breadcrumbs="[{ title: 'Usuários', to: { name: 'dashboard.users' } }, { title: computed_isCreating ? 'Novo usuário' : 'Editar usuário', to: computed_isCreating ? { name: 'dashboard.users.create' } : { name: 'dashboard.users.edit', params: { user_id: formUser.data.id } } }]"
        :loading="loading">

        <!-- start -->
        <v-sheet>
            <v-row justify="center">
                <v-col v-if="!computed_isCreating" cols="12" sm="10" md="4" lg="3"
                    class="d-flex flex-column align-center justify-center mb-6">
                    <div class="w-full mb-8">
                        <thumb-comp :alternative-text="formUser.basicData.first_name"
                            :image-url="formUser.basicData.photo_url" max-width="175" max-height="175" elevated circle
                            border />
                    </div>

                    <div class="w-100">
                        <v-select @update:model-value="method_roleChanges" v-model="userRoles.change" label="Funções"
                            :items="computed_rolesAsSelectItems" multiple :loading="roles.loading || userRoles.updating"
                            :readonly="roles.loading || userRoles.updating" />

                        <v-alert v-if="userRoles.original?.length" type="info" border="start" density="comfortable"
                            variant="text" :icon="false"
                            text="Este usuário possui acesso ao administrativo e suas permissões são definidas nas funções atribuídas a ele." />
                    </div>
                </v-col>
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
import ThumbComp from '@/components/ThumbComp.vue';

const loading = ref(true);
const route = useRoute();
const router = useRouter();
const alertStore = useAlertStore();

let roles = reactive({
    loading: true,
    list: []
});

let userRoles = reactive({
    updating: false,
    original: [],
    change: []
});

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

            // roles
            const theUserRoles = Object.values(resp.data.user.roles).map((role) => {
                return role.id;
            });

            userRoles.original = theUserRoles;
            userRoles.change = theUserRoles;
        },
        finally: () => {
            loading.value = false;
        }
    });
};

const method_getRoles = () => {
    roles.loading = true;

    return req({
        action: '/admin/roles',
        method: 'get',
        success: (resp) => {
            roles.list = resp.data.roles.list;
        },
        finally: () => {
            roles.loading = false;
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

const method_roleChanges = (roles) => {
    userRoles.updating = true;

    let add = roles.filter(roleId => !userRoles.original.includes(roleId));
    let remove = userRoles.original.filter(roleId => !roles.includes(roleId));
    if (add.length == 0 && remove.length == 0) {
        return;
    }

    let isAddRole = add.length ? true : false;

    return req({
        action: isAddRole ? '/admin/users/' + formUser.data.id + '/role/' + add[0] : '/admin/users/' + formUser.data.id + '/role/' + remove[0],
        method: isAddRole ? 'patch' : 'delete',
        success: () => {
            alertStore.addMessage(
                isAddRole ? 'Nova função atribuída ao usuário.' : 'Função removida do usuário.',
                isAddRole ? 'Atribuída!' : 'Removido!',
                isAddRole ? 'success' : 'info'
            );

            if (isAddRole) {
                userRoles.original.push(add[0]);
            } else {
                userRoles.original.splice(userRoles.original.findIndex(v => v == remove[0]), 1);
            }
        },
        finally: () => {
            userRoles.updating = false;
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

const computed_rolesAsSelectItems = computed(() => {
    return Object.entries(roles.list).map((role) => {
        return {
            title: role[1].name,
            value: role[1].id
        };
    })
});

/**
 * 
 * 
 * Created
 * 
 * 
 */
method_getUser();
method_getRoles();

</script>
