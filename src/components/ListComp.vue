<template>
    <confirmation-comp v-model="deleteConfirmation.dialog.show" color="danger" :title="deleteConfirmation.dialog.title"
        :text="deleteConfirmation.dialog.text" :callback-cancel="method_actionDeleteCanceled"
        :callback-confirm="method_actionDeleteConfirmed" />

    <v-sheet class="px-4 py-4 text-right">
        <v-text-field v-model="filtering.data.search" label="Pesquisar" name="search" density="compact" clearable
            append-icon="mdi-magnify" @click:append="method_filter" :disabled="filtering.filtering" />
    </v-sheet>


    <v-sheet v-if="(filtering.isFilter ? filtering.list : list).length == 0"
        class="text-h7 font-weight-medium text-dark-lighten-4 text-center rounded px-10 py-5">
        {{ filtering.isFilter ? 'Sem resultados' : 'A lista está vazia' }}
    </v-sheet>

    <template v-else>
        <v-sheet>
            <v-progress-linear indeterminate v-if="filtering.filtering" color="primary" height="6" />
            <v-table>
                <thead>
                    <tr>
                        <th v-for="col in props.columns" :key="col" class="text-left">
                            {{ col.label }}
                        </th>
                        <th class="text-right">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item, index in (filtering.isFilter ? filtering.list : list)" :key="item">
                        <td v-for="col in props.columns" :key="col" class="text-left">{{ item[col.key] }}</td>
                        <td class="text-right">
                            <v-btn @click.stop="method_actionShow" icon="mdi-eye-outline" color="info-lighten-1"
                                variant="text" :ripple="false" :data-item-index="index" />
                            <v-btn @click.stop="method_actionEdit" icon="mdi-pencil-box-outline" color="info" variant="text"
                                :ripple="false" :data-item-index="index" />
                            <v-btn @click.stop="method_actionDelete" icon="mdi-delete" color="danger" variant="text"
                                :ripple="false" :data-item-index="index" />
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-sheet>

        <v-sheet v-if="pagination.pages" class="py-8">
            <v-pagination v-model="pagination.page" :length="pagination.pages" :total-visible="5" />
        </v-sheet>
    </template>
</template>

<script setup>

/**
 * 
 * LIST COMP: List Component
 * 
 */

import { ref, watch } from 'vue';
import ConfirmationComp from './ConfirmationComp.vue';
import { useRouter } from 'vue-router';
import { req } from '@/plugins/requester';
import { useAlertStore } from '@/store/alert';

const props = defineProps({
    /**
     * 
     * Número total de páginas
     * 
     */
    pages: {
        type: [Number, String],
        default: 0
    },

    /**
     * 
     * p.pages para a lista
     * items precisa ser um array:
     * - contendo objetos de item a ser listado
     * 
     */
    items: {
        type: Array,
        default: Array
    },

    /**
     * 
     * Colunas a serem mostradas
     * columns precisa ser um array:
     * - contendo objetos com as seguintes chaves:
     *   - key: nome do campo nos objetos contidos em items
     *   - label: Label para o campo
     * 
     * isso será utilizado para criar células na tabela de listagem e para acessar os valores nos objetos de items
     * 
     */
    columns: {
        type: Array,
        default: Array
    },

    /**
     * 
     * Filtragem da lista
     * 
     * actionFilter precisa ser uma função que recebe os dados de filtragem e formato de objeto, exemplo:
     *     {
     *         search: 'termo de busca',
     *         orderbyname: 'asc',
     *         urlParams: search=termo de busca&orderbyname=asc
     *     }
     * 
     * Com os dados de filtragem em mãos, a função deve fazer uma requisição ao backend solicitando a filtragem
     * atualizando a lista de itens
     * 
     */
    actionFilter: {
        type: Function,
        default: null
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

const emit = defineEmits({
    'changePage': null
});

const router = useRouter();

const list = ref([]);

const pagination = ref({
    page: 1,
    pages: props.pages
});

const filtering = ref({
    isFilter: false,
    filtering: false,
    list: [],
    data: {
        search: null
    }
});

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

/**
 * 
 * 
 * Filter methods
 * 
 * 
 */
const method_filter = () => {
    if (!props.actionFilter) {
        // method_localFilter();
        return;
    }

    filtering.value.filtering = true;

    let promise = props.actionFilter({
        data: filtering.value.data,
        urlParams: (Object.entries(filtering.value.data).map((d) => {
            return d[0] + '=' + d[1];
        })).join('&')
    });

    try {
        promise.finally(() => {
            filtering.value.filtering = false;
        });
    } catch {
        filtering.value.filtering = false;
    }
};

// const method_localFilter = () => {
//     if ((filtering.value.data.search ?? '').length == 0) {
//         filtering.value.isFilter = false;
//     } else {
//         filtering.value.isFilter = true;
//     }

//     // search
//     filtering.value.list = list.value.filter((item) => {
//         return props.columns.find((cv) => {
//             return item[cv.key].toLowerCase().includes((filtering.value.data.search ?? '').toLowerCase());
//         });
//     });
// };

/**
 * 
 * 
 * Actions methods
 * 
 *  
 */

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

/**
 * 
 * 
 * Watchers
 * 
 * 
 */
watch(() => props.items, (n) => {
    list.value = n;
}, { immediate: true, deep: true });

watch(() => props.pages, (n) => {
    pagination.value.pages = n;
}, { immediate: true, deep: true });

watch(() => pagination.value.page, (n) => {
    emit('changePage', n);
});

</script>
