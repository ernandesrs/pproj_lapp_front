<template>
    <v-dialog v-model="formEmailSenders.showDialog" max-width="675" persistent>
        <v-form @submit.prevent="method_emailSenderFormSubmit">
            <v-card :title="formEmailSenders.data?.id ? 'Editar servidor' : 'Novo servidor'"
                :loading="formEmailSenders.submitting">
                <v-card-item>
                    <v-row class="py-2">
                        <v-col cols="12">
                            <v-text-field v-model="formEmailSenders.data.display_name" label="Nome"
                                :error-messages="formEmailSenders.errors?.display_name" />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="formEmailSenders.data.host" label="Servidor"
                                :error-messages="formEmailSenders.errors?.host"
                                :disabled="formEmailSenders.data?.id ? true : false" />
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field v-model="formEmailSenders.data.port" type="number" label="Porta"
                                :error-messages="formEmailSenders.errors?.port"
                                :disabled="formEmailSenders.data?.id ? true : false" />
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-select v-model="formEmailSenders.data.encrypt" label="Criptografia"
                                :items="[{ title: 'SSL', value: 'ssl' }, { title: 'TLS', value: 'tls' }]"
                                :error-messages="formEmailSenders.errors?.encrypt"
                                :disabled="formEmailSenders.data?.id ? true : false" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="formEmailSenders.data.username" label="Usuário"
                                :error-messages="formEmailSenders.errors?.username" hint="Isso não será exibido novamente"
                                :disabled="formEmailSenders.data?.id ? true : false" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="formEmailSenders.data.password" label="Senha" type="password"
                                hint="Isso não será exibido novamente" :error-messages="formEmailSenders.errors?.password"
                                :disabled="formEmailSenders.data?.id ? true : false" />
                        </v-col>
                        <v-col cols="12">
                            <v-text-field v-model="formEmailSenders.data.from_mail" label="Email remetente" type="email"
                                :error-messages="formEmailSenders.errors?.from_mail"
                                :disabled="formEmailSenders.data?.id ? true : false" />
                        </v-col>
                    </v-row>
                </v-card-item>

                <v-card-actions class="d-flex justify-center">
                    <v-btn @click="method_hiddenEmailSenderDialog" class="px-5" color="danger" variant="text"
                        text="Fechar" />

                    <v-btn type="submit" class="px-5" color="success" prepend-icon="mdi-check"
                        :text="formEmailSenders.data?.id ? 'Atualizar servidor' : 'Cadastrar servidor'" variant="elevated"
                        :loading="formEmailSenders.submitting" />
                </v-card-actions>
            </v-card>
        </v-form>
    </v-dialog>

    <confirmation-comp v-model="formEmailSenders.showDeleteConfirm" :callback-confirm="method_deleteEmailSenderConfirmed"
        color="danger" title="Excluindo servidor"
        text="Você está excluir um servidor de envio de e-mails, isso não pode ser desfeito." />

    <base-view page-title="Configurações"
        :breadcrumbs="[{ title: 'Configurações do sistema', to: { name: 'dashboard.settings.system' } }]"
        :loading="loading">
        <section-comp title="Servidores SMTP"
            unbreaked-subtitle="Seus servidores SMTP cadastrados para envio de e-mail. Sem ao menos um destes dados cadastrados não será possível enviar e-mails de recuperação de conta, por exemplo.">
            <template #content>

                <v-row>
                    <v-col cols="12">
                        <v-table hover density="compact">
                            <tbody>
                                <tr v-if="formEmailSenders.list?.length == 0">
                                    <td colspan="2" class="text-center font-weight-medium text-body text-disabled py-3">
                                        Nenhum servidor cadastrado
                                    </td>
                                </tr>
                                <template v-else>
                                    <tr v-for="emailSender in formEmailSenders.list" :key="emailSender.id">
                                        <td>
                                            <v-row class="py-3 my-0">
                                                <v-col cols="12" sm="6">
                                                    <p>
                                                        <span class="font-weight-medium text-medium-emphasis">Nome: </span>
                                                        <span class="text-disabled">{{ emailSender.display_name
                                                        }}</span>
                                                    </p>

                                                    <p>
                                                        <span class="font-weight-medium text-medium-emphasis">Remetente:
                                                        </span>
                                                        <span class="text-disabled">{{ emailSender.from_mail
                                                        }}</span>
                                                    </p>
                                                </v-col>

                                                <v-col cols="12" sm="6">
                                                    <p>
                                                        <span class="font-weight-medium text-medium-emphasis">Servidor:
                                                        </span>
                                                        <span class="text-disabled">{{ emailSender.host
                                                        }}</span>
                                                    </p>

                                                    <p>
                                                        <span class="font-weight-medium text-medium-emphasis">Porta: </span>
                                                        <span class="text-disabled">{{ emailSender.port
                                                        }}</span>
                                                    </p>
                                                </v-col>
                                            </v-row>
                                        </td>

                                        <td class="text-right">
                                            <v-btn @click.prevent="method_editEmailSender(emailSender.id)" size="small"
                                                text="Editar" color="primary" variant="outlined" class="mr-1" />

                                            <v-btn @click.prevent="method_deleteEmailSender(emailSender.id)" size="small"
                                                text="Excluir" color="danger" variant="outlined" class="ml-1" />
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </v-table>
                    </v-col>

                    <v-col cols="12">
                        <v-btn @click="method_newEmailSender" color="success" prepend-icon="mdi-check"
                            text="Novo servidor" />
                    </v-col>
                </v-row>

            </template>

            <template #actions>
                <v-btn class="px-5" color="primary" prepend-icon="mdi-check" text="Salvar" variant="elevated" />
            </template>
        </section-comp>
    </base-view>
</template>

<script setup>

import BaseView from '@/layouts/default/BaseView.vue';
import { ref } from 'vue';
import SectionComp from '@/components/SectionComp.vue';
import { reactive } from 'vue';
import { req } from '@/plugins/requester';
import { useAlertStore } from '@/store/alert';
import ConfirmationComp from '@/components/ConfirmationComp.vue';

const alertStore = useAlertStore();

const loading = ref(true);

const formEmailSenders = reactive({
    submitting: false,
    showDialog: false,
    showDeleteConfirm: false,
    deleteId: null,
    data: {},
    list: [],
    errors: {}
});

const method_getEmailSenders = () => {
    loading.value = true;
    return req({
        action: '/admin/settings/email-senders',
        method: 'get',
        success: (r) => {
            formEmailSenders.list = r.data.email_senders?.list;
        },
        finally: () => {
            loading.value = false;
        }
    });
};

const method_newEmailSender = () => {
    method_getEmptyEmailSenderData();
    method_showEmailSenderDialog();
};

const method_editEmailSender = (id) => {
    const emailSender = formEmailSenders.list.find((i) => {
        return i.id == id;
    });

    if (!emailSender) {
        return;
    }

    formEmailSenders.data = emailSender;

    method_showEmailSenderDialog();
};

const method_deleteEmailSender = (id) => {
    formEmailSenders.deleteId = id;
    formEmailSenders.showDeleteConfirm = true;
};

const method_deleteEmailSenderConfirmed = () => {
    let deleteIndex = formEmailSenders.list.findIndex((i) => {
        return i.id == formEmailSenders.deleteId;
    });

    return req({
        action: '/admin/settings/email-senders/' + formEmailSenders.deleteId,
        method: 'delete',
        success: () => {
            formEmailSenders.list.splice(deleteIndex, 1);
            alertStore.addMessage('Servidor SMTP excluído com sucesso.', null, 'warning');
        },
        finally: () => {
            formEmailSenders.deleteId = null;
        }
    });
};

const method_showEmailSenderDialog = () => {
    formEmailSenders.showDialog = true;
};

const method_hiddenEmailSenderDialog = () => {
    formEmailSenders.showDialog = false;
    method_getEmptyEmailSenderData();
};

const method_getEmptyEmailSenderData = () => {
    formEmailSenders.data = {
        id: null,
        display_name: null,
        host: null,
        port: null,
        username: null,
        password: null,
        encrypt: null,
        from_mail: null
    };

    formEmailSenders.errors = {};
};

const method_emailSenderFormSubmit = () => {
    formEmailSenders.errors = {};
    formEmailSenders.submitting = true;

    const action = formEmailSenders.data?.id ? '/admin/settings/email-senders/' + formEmailSenders.data?.id : '/admin/settings/email-senders';
    const method = formEmailSenders.data?.id ? 'put' : 'post';

    return req({
        action: action,
        method: method,
        data: formEmailSenders.data,
        success: (r) => {
            method_hiddenEmailSenderDialog();
            alertStore.addMessage('Novo servidor SMTP cadastrado com sucesso.', null, 'success');
            formEmailSenders.list.push(r.data.email_sender);
        },
        fail: (r) => {
            formEmailSenders.errors = r.response.data?.errors;
        },
        finally: () => {
            formEmailSenders.submitting = false;
        }
    });
};

method_getEmptyEmailSenderData();
method_getEmailSenders();

</script>
