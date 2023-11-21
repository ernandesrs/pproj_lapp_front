<template>
    <confirmation-comp v-model="deleteConfirmation.dialog.show" color="danger" :title="deleteConfirmation.dialog.title"
        :text="deleteConfirmation.dialog.text" :callback-cancel="method_actionDeleteCanceled"
        :callback-confirm="method_actionDeleteConfirmed" />

    <v-sheet v-if="props.showFilters" class="px-4 py-4 text-right">
        <v-text-field v-model="filtering.data.search" label="Pesquisar" name="search" density="compact" clearable
            append-icon="mdi-magnify" @click:append="method_actionFilter" :disabled="filtering.filtering" />
    </v-sheet>

    <v-sheet v-if="list.length == 0" class="text-h7 font-weight-medium text-dark-lighten-4 text-center rounded px-10 py-5">
        {{ filtering.isFilter ? 'Sem resultados' : 'A lista está vazia' }}
    </v-sheet>

    <template v-else>
        <v-sheet>
            <v-table hover>
                <thead>
                    <tr>
                        <th v-if="props.thumb">
                            {{ props.thumb?.label ?? 'Thumbnail' }}
                        </th>
                        <th v-for="col in props.columns" :key="col" class="text-left">
                            {{ col.label }}
                        </th>
                        <th v-if="computed_showActions" class="text-right">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="item, index in list" :key="item">
                        <tr>
                            <td v-if="props.thumb" class="py-3">
                                <thumb-comp :image-url="item[props.thumb.key]"
                                    :alternative-text="item[props.thumb.alternativeKey]"
                                    :circle="props.thumb?.circle ?? false" :max-width="props.thumb?.width ?? 50"
                                    :max-height="props.thumb?.height ?? 50" elevated border />
                            </td>
                            <td v-for="col in props.columns" :key="col" class="text-left">{{
                                col?.callback ? col.callback(item) : item[col.key] }}</td>
                            <td v-if="computed_showActions" class="text-right">
                                <v-btn-group density="compact">
                                    <slot name="listActionButtons" :item="item" />
                                    <v-btn v-if="computed_showShowAction" @click.stop="method_actionShow"
                                        icon="mdi-eye-outline" color="light-darken-4" variant="text" :ripple="false"
                                        :data-item-index="index" />
                                    <v-btn v-if="computed_showEditAction" @click.stop="method_actionEdit"
                                        icon="mdi-pencil-box-outline" color="info" variant="text" :ripple="false"
                                        :data-item-index="index" />
                                    <v-btn v-if="computed_showDeleteAction" @click.stop="method_actionDelete"
                                        icon="mdi-delete" color="danger" variant="text" :ripple="false"
                                        :data-item-index="index" />
                                </v-btn-group>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </v-table>
        </v-sheet>

        <v-sheet v-if="pagination.pages" class="px-4 py-8">
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

import { ref, watch, computed } from 'vue';
import ConfirmationComp from './ConfirmationComp.vue';
import { useRouter } from 'vue-router';
import { req } from '@/plugins/requester';
import { useAlertStore } from '@/store/alert';
import { useAppStore } from '@/store/app';
import ThumbComp from './ThumbComp.vue';
import setting from '@/utils/setting';

const props = defineProps({
    /**
     * 
     * Chave na resposta em que se encontra a lista de itens
     * 
     */
    dataField: {
        type: String,
        default: null
    },

    /**
     * 
     * Thumb config
     * Example: 
     *     {
     *          label: 'Foto',
     *          key: 'photo_url',
     *          alternativeKey: 'first_name',
     *          width: 40,
     *          height: 40,
     *          circle: true
     *     }
     * 
     */
    thumb: {
        type: [Object, null],
        default: null
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

    showFilters: {
        type: Boolean,
        default: true
    },

    showListActions: {
        type: Boolean,
        default: false
    },

    /**
     * 
     * Obter lista
     * actionGetList deve ser uma função que obtem a lista de items do backend. A função deve:
     * - capturar dados de:
     *   - paginação ou
     *   - filtragem
     * e atribuir a url
     * - retornar uma Promise, para então executar, internamente, o processos: .then().catch().then()
     * 
     */
    actionGetList: {
        type: Function,
        default: null,
    },

    /**
     * 
     * actionShow precisa ser uma função que:
     * - receba os dados do item em formato de objeto, exemplo:
     *     {
     *        id: 1,
     *        index: 0
     *     }
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
     * - receba os dados do item em formato de objeto, exemplo:
     *     {
     *        id: 1,
     *        index: 0
     *     }
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
     * - receba os dados do item em formato de objeto, exemplo:
     *     {
     *        id: 1,
     *        index: 0
     *     }
     * 
     * - retorne uma string contendo o endpoint da API para exclusão do item em caso de confirmação
     *
     */
    actionDelete: {
        type: Function,
        default: null
    }
});

const router = useRouter();

const appStore = useAppStore();

const list = ref([]);

const pagination = ref({
    limit: setting.getSetting('items_per_page'),
    page: 1,
    pages: props.pages
});

const filtering = ref({
    isFilter: false,
    filtering: false,
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
const method_actionFilter = () => {
    const urlParams = method_getUrlParams(filtering.value.data);

    // reset page offset
    pagination.value.page = 1;

    if (!urlParams.hasFilterFields && filtering.value.isFilter) {
        // reload list
        method_actionGetList().finally(() => {
            filtering.value.filtering = false;
            filtering.value.isFilter = false;
        });
        return;
    }

    method_actionGetList().finally(() => {
        filtering.value.filtering = false
        filtering.value.isFilter = true;
    });
};

const method_getUrlParams = (filter = false) => {
    let defaults = method_getObjectAsArray({
        limit: pagination.value.limit,
        page: pagination.value.page
    });
    let filterFields = [];

    if (filter) {
        filterFields = method_getObjectAsArray(filtering.value.data);
    }

    return {
        hasFilterFields: filterFields.length > 0,
        data: [
            ...defaults,
            ...filterFields
        ]
    };
};

const method_getObjectAsArray = (obj) => {
    let filterFields = (Object.entries(obj).map((d) => {
        if (!d[1]) {
            return null;
        }

        return d[0] + '=' + d[1];
    })).filter((ff) => { return ff !== null });

    if (!filterFields.length) {
        filterFields = [];
    }

    return filterFields;
};

/**
 * 
 * 
 * ACTIONS METHODS
 * List items
 * 
 *  
 */
const method_actionGetList = () => {
    if (!props.actionGetList) {
        return;
    }

    return method_callGetList(props.actionGetList({
        data: method_getUrlParams(true).data,
        urlParams: method_getUrlParams(true).data.join('&')
    }));
};

const method_callGetList = (promise) => {
    appStore.setLoadingContent(true);

    return promise
        .then((resp) => {
            list.value = resp.data[props.dataField].list;
            pagination.value.pages = (resp.data[props.dataField]?.meta?.links?.length ?? 2) - 2;
        })
        .catch((resp) => {
            useAlertStore().addError(resp.response?.data?.error, false);
        })
        .then(() => {
            appStore.setLoadingContent(false);
        });
};

/**
 * 
 * 
 * ACTIONS METHODS
 * Show, Edit, Delete
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
 * Computeds
 * 
 * 
 */
const computed_showActions = computed(() => {
    return props.showListActions ? true : (props.actionShow || props.actionEdit || props.actionDelete) ? true : false;
});

const computed_showShowAction = computed(() => {
    return props.actionShow ? true : false;
});

const computed_showEditAction = computed(() => {
    return props.actionEdit ? true : false;
});

const computed_showDeleteAction = computed(() => {
    return props.actionDelete ? true : false;
});

/**
 * 
 * 
 * Watchers
 * 
 * 
 */
watch(() => pagination.value.page, () => {
    method_actionGetList();
});

method_actionGetList();

</script>
