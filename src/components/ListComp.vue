<template>
    <confirmation-comp v-model="deleteConfirmation.dialog.show" color="danger" :title="deleteConfirmation.dialog.title"
        :text="deleteConfirmation.dialog.text" :callback-cancel="method_actionDeleteCanceled"
        :callback-confirm="method_actionDeleteConfirmed" />

    <v-sheet v-if="list.length == 0" class="text-h7 font-weight-medium text-dark-lighten-4 text-center rounded px-10 py-5">
        A lista está vazia
    </v-sheet>
    <v-table v-else>
        <thead>
            <tr>
                <th v-for="col in props.columns" :key="col" class="text-left">
                    {{ col.label }}
                </th>
                <th class="text-right">Ações</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item, index in list" :key="item">
                <td v-for="col in props.columns" :key="col" class="text-left">{{ item[col.key] }}</td>
                <td class="text-right">
                    <v-btn @click.stop="method_actionShow" icon="mdi-eye-outline" color="info-lighten-1" variant="text"
                        :ripple="false" :data-item-index="index" />
                    <v-btn @click.stop="method_actionEdit" icon="mdi-pencil-box-outline" color="info" variant="text"
                        :ripple="false" :data-item-index="index" />
                    <v-btn @click.stop="method_actionDelete" icon="mdi-delete" color="danger" variant="text" :ripple="false"
                        :data-item-index="index" />
                </td>
            </tr>
        </tbody>
    </v-table>
</template>

<script setup>

import { ref } from 'vue';
import ConfirmationComp from './ConfirmationComp.vue';
import { useRouter } from 'vue-router';
import { req } from '@/plugins/requester';
import { useAlertStore } from '@/store/alert';

const router = useRouter();

const props = defineProps({
    items: {
        type: Array,
        default: Array
    },
    columns: {
        type: Array,
        default: Array
    },
    /**
     * 
     * actionShow precisa ser uma função que:
     * - retorne um objeto contendo o nome da rota, parâmetros, etc, para onde o usuário será direcionado
     *   para Ver o item clicado ou;
     *
     */
    actionShow: {
        type: Function,
        default: null
    },

    /**
     * 
     * actionEdit precisa ser uma função que:
     * - retorne um objeto contendo o nome da rota, parâmetros, etc, para onde o usuário será direcionado
     *   para Editar o item clicado ou;
     *
     */
    actionEdit: {
        type: Function,
        default: null
    },

    /**
     * 
     * actionDelete precisa ser uma função que:
     * - retorne uma string contendo o endpoint da API para exclusão do item em caso de confirmação
     *
     */
    actionDelete: {
        type: Function,
        default: null
    }
});

const list = ref(props.items);

const deleteConfirmation = ref({
    item: null,
    endpoint: null,
    waiting: false,
    dialog: {
        show: false,
        title: 'Tem certeza?',
        text: 'Após confirmar, a exclusão não poderá ser desfeita.'
    }
});

const method_actionShow = (e) => {
    let item = method_getItem(e);
    if (!item) {
        return;
    }

    let itemData = {
        id: item?.id,
        index: item.the_item_index
    };

    let route = props.actionShow(itemData);

    router.push(route);
};

const method_actionEdit = (e) => {
    let item = method_getItem(e);
    if (!item) {
        return;
    }

    let itemData = {
        id: item?.id,
        index: item.the_item_index
    };

    let route = props.actionEdit(itemData);

    router.push(route);
};

const method_actionDelete = (e) => {
    let item = method_getItem(e);
    if (!item) {
        return;
    }

    let itemData = {
        id: item?.id,
        index: item.the_item_index
    };

    deleteConfirmation.value.item = item;
    deleteConfirmation.value.dialog.show = true;
    deleteConfirmation.value.endpoint = props?.actionDelete ? props.actionDelete(itemData) : null;
};

const method_actionDeleteCanceled = () => {
    method_deleteConfirmationClear();
}

const method_actionDeleteConfirmed = () => {
    if (!deleteConfirmation.value.endpoint) {
        if (!deleteConfirmation.value.item) {
            return;
        }

        method_deleteItemFromList();
        return;
    }

    deleteConfirmation.value.waiting = true;

    return req({
        action: deleteConfirmation.value.endpoint,
        method: 'delete',
        success: () => {
            method_deleteItemFromList();
        },
        finally: () => {
            deleteConfirmation.value.waiting = false;
        }
    });
};

const method_deleteItemFromList = () => {
    let deleteIndex = deleteConfirmation.value.item.the_item_index;

    list.value.splice(deleteIndex, 1);

    useAlertStore().addMessage('Item excluído definitivamente com sucesso!', 'Excluído!', 'danger');

    method_deleteConfirmationClear();
};

const method_deleteConfirmationClear = () => {
    deleteConfirmation.value.item = null;
    deleteConfirmation.value.endpoint = null;
};

const method_getItem = (event) => {
    let index = parseInt(event.target.getAttribute('data-item-index'));
    let item = list.value.find((v, i) => {
        return index == i;
    });

    return item ? {
        ...item,
        the_item_index: index
    } : null;
};

</script>
