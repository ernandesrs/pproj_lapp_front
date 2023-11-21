<template>
    <v-dialog v-model="adminManagerDialog.show" max-width="625px" persistent>
        <v-card :loading="adminManagerDialog.saving" :disabled="adminManagerDialog.saving">
            <v-card-text v-if="!adminManagerDialog.user">
                <v-text-field @click:append-inner="method_findUser" v-model="adminManagerDialog.email" label="E-mail"
                    hint="Encontre o usuário por e-mail" append-inner-icon="mdi-magnify"
                    :error-messages="adminManagerDialog.error" :loading="adminManagerDialog.finding" clearable />
            </v-card-text>

            <v-card-text v-else>
                <v-sheet border rounded class="px-6 py-6">
                    <h4 class="mb-5">Administrador</h4>
                    <p class="text-dark-lighten-2 mb-1">
                        <span class="mr-2 font-weight-medium">Nome:</span>
                        <span>
                            {{ adminManagerDialog.user?.first_name }} {{ adminManagerDialog.user?.last_name }}
                        </span>
                    </p>
                    <p class="text-dark-lighten-2">
                        <span class="mr-2 font-weight-medium">Email:</span>
                        <span>
                            {{ adminManagerDialog.user?.email }}
                        </span>
                    </p>
                    <v-spacer />
                    <v-divider class="my-6" />
                    <h4 class="mb-5">Funções atribuídas</h4>
                    <v-row align="center" justify="start">
                        <v-col v-if="!computed_selectedRoles.length" cols="auto" class="py-1 pe-0">
                            <v-chip disabled>
                                <v-icon icon="mdi-shield" start />
                                Nenhuma selecionada
                            </v-chip>
                        </v-col>
                        <v-col v-for="(selection, i) in computed_selectedRoles" :key="selection.name" cols="auto"
                            class="py-1 pe-0">
                            <v-chip closable @click:close="method_removeRole(i, selection)" color="primary">
                                <v-icon icon="mdi-shield" start />
                                {{ selection.name }}
                            </v-chip>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <h4 class="mb-3">Funções</h4>
                            <v-list>
                                <template v-for="item in computed_allRoles">
                                    <v-list-item v-if="!computed_selectedRoles.includes(item)" @click="method_addRole(item)"
                                        :key="item.name" :title="item.name" class="text-left">
                                        <template v-slot:prepend>
                                            <v-icon icon="mdi-shield"></v-icon>
                                        </template>
                                    </v-list-item>
                                </template>
                            </v-list>
                        </v-col>
                    </v-row>
                </v-sheet>
            </v-card-text>

            <v-card-actions>
                <div class="text-center w-100">
                    <v-btn @click="method_closeAdminManagerDialog" text="Fechar" class="px-8" color="danger" />
                </div>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <base-view page-title="Administradores"
        :breadcrumbs="[{ title: 'Administradores', to: { name: 'dashboard.users.admins' } }]">

        <template #actionButtons>
            <v-btn @click="method_newAdmin" text="Novo administrador" color="primary" prepend-icon="mdi-shield-lock" />
            <v-btn v-if="authStore.permissions('user').canList()" text="Usuários" color="primary"
                prepend-icon="mdi-account-group" variant="outlined" :to="{ name: 'dashboard.users' }" />
        </template>

        <table-comp data-field="users"
            :thumb="{ key: 'photo_url', alternativeKey: 'first_name', label: 'Foto', width: 35, height: 35, circle: true }"
            :show-filters="false" :action-get-list="method_getAdmins"
            :columns="[{ callback: (user) => { return user.first_name + ' ' + user.last_name }, label: 'Nome' }, { key: 'email', label: 'Email' }, { callback: (user) => { return user.roles.map((role) => { return role.name }).join(', ') }, label: 'Funções' }]"
            show-list-actions>

            <template #listActionButtons="{ item }">
                <v-btn @click="method_editAdmin(item)" title="Editar admin" icon="mdi-pencil" color="primary"
                    variant="text" />
            </template>

        </table-comp>

    </base-view>
</template>

<script setup>

import BaseView from '@/layouts/default/BaseView.vue';
import TableComp from '@/components/TableComp.vue';
import { req, request } from '@/plugins/requester';
import { useAuthStore } from '@/store/auth';
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAlertStore } from '@/store/alert';

const authStore = useAuthStore();
const router = useRouter();
const alertStore = useAlertStore();

/**
 * 
 * Flag to signal if changes have been made and the list needs to be reloaded
 * 
 */
const reload = ref(false);

/**
 * 
 * All roles and selected roles
 * 
 */
const roles = reactive({
    loading: false,
    list: [],
    selected: [],
});

/**
 * 
 * Dialog: (create/edit) admin
 * 
 */
const adminManagerDialog = reactive({
    finding: false,
    saving: false,
    show: false,
    isCreate: true,
    email: null,
    id: null,
    user: null,
    error: null,
    add: null,
    remove: null
});

/**
 * 
 * 
 * Methods
 * 
 * 
 */

/**
 * Get admins list
 */
const method_getAdmins = () => {
    let action = '/admin/admins';

    reload.value = false;

    return request({
        action: action,
        method: 'get'
    });
};

/**
 * Get roles list
 */
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

const method_dataFromQueryParams = () => {
    const action = router.currentRoute.value.query?.action;
    const userId = router.currentRoute.value.query?.user_id;

    if (!userId) {
        return;
    }

    adminManagerDialog.id = userId;

    method_findUser().finally(() => {
        if (!adminManagerDialog.user) {
            alertStore.addMessage('O usuário não foi encontrado.', '404', 'danger');
            router.push({ name: 'dashboard.users.admins' });
            return;
        }

        if (action == 'create') {
            method_newAdmin();
        } else {
            method_editAdmin(adminManagerDialog.user);
        }
    });
};

/**
 * Find user by email or id
 */
const method_findUser = () => {
    adminManagerDialog.error = null;
    adminManagerDialog.finding = true;

    const action = adminManagerDialog.id ? '/admin/users/' + adminManagerDialog.id : '/admin/users?equals:email=' + adminManagerDialog.email;

    return req({
        action: action,
        method: 'get',
        success: (resp) => {
            let user = (resp.data?.users?.list[0] ?? null) ?? resp.data?.user ?? null;

            if (!user) {
                adminManagerDialog.error = 'Usuário não encontrado';
            } else {
                adminManagerDialog.user = user;
                roles.selected = user.roles;
            }
        },
        finally: () => {
            adminManagerDialog.finding = false;
        }
    });
};

/**
 * Prepare Admin Manager 'create admin' dialog
 */
const method_newAdmin = () => {
    adminManagerDialog.isCreate = true;
    method_openAdminManagerDialog();
};

/**
 * Prepare Admin Manager 'edit admin' dialog
 */
const method_editAdmin = (admin) => {
    adminManagerDialog.isCreate = false;
    adminManagerDialog.user = admin;
    roles.selected = admin.roles;
    method_openAdminManagerDialog();
};

/**
 * Open admin manager dialog
 */
const method_openAdminManagerDialog = () => {
    adminManagerDialog.show = true;
};

/**
 * Close, reset admin manager dialog and reload list
 */
const method_closeAdminManagerDialog = () => {
    adminManagerDialog.email = null;
    adminManagerDialog.id = null;
    adminManagerDialog.user = null;
    adminManagerDialog.show = false;
    adminManagerDialog.error = null;

    router.push({ name: 'dashboard.users.admins' });

    if (reload.value) {
        window.location.reload();
    }
};

/**
 * 
 * Roles: ADD and REMOVE
 */

const method_addRole = (role) => {
    adminManagerDialog.saving = true;

    return req({
        action: '/admin/users/' + adminManagerDialog.user.id + '/role/' + role.id,
        method: 'patch',
        success: () => {
            roles.selected.push(role);

            // reload list after close admin manager dialog if has changes
            reload.value = true;
        },
        fail: () => {
            method_closeAdminManagerDialog();
        },
        finally: () => {
            adminManagerDialog.saving = false;
        }
    });
};

const method_removeRole = (index, role) => {
    adminManagerDialog.saving = true;

    return req({
        action: '/admin/users/' + adminManagerDialog.user.id + '/role/' + role.id,
        method: 'delete',
        success: () => {
            roles.selected.splice(index, 1);

            // reload list after close admin manager dialog if has changes
            reload.value = true;
        },
        fail: () => {
            method_closeAdminManagerDialog();
        },
        finally: () => {
            adminManagerDialog.saving = false;
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
const computed_selectedRoles = computed(() => {
    const selections = [];

    for (const selection of roles.selected) {
        selections.push(selection);
    }

    return selections;
});

const computed_allRoles = computed(() => {
    return roles.list;
});

/**
 * 
 * 
 * Created
 * 
 * 
 */
method_getRoles();
method_dataFromQueryParams();

</script>
