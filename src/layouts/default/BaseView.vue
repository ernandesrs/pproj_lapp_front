<template>
    <div class="pt-6">
        <v-container class="w-100 d-flex justify-space-between">
            <!-- left side(title, breadcrumbs) -->
            <div class="flex flex-column">
                <h1 class="text-h5 mb-3">{{ pageTitle }}</h1>
                <v-breadcrumbs v-if="!['dashboard.home'].includes(route.name)" :items="breads" density="compact"
                    class="px-0 pl-1 text-body-2 text-dark">
                    <template v-slot:title="{ item }">
                        {{ item.title.toUpperCase() }}
                    </template>
                </v-breadcrumbs>
            </div>

            <!-- right side -->
            <v-btn-group density="compact">
                <v-btn v-if="props.actionCreate.show" @click="method_actionCreate"
                    :text="props.actionCreate.text ?? 'Novo item'" color="success" prepend-icon="mdi-plus"
                    :to="props.actionCreate?.to" />
                <slot name="actionButtons" />
            </v-btn-group>
        </v-container>
    </div>

    <v-container class="py-6 my-6 bg-light-lighten-1 rounded-lg elevation-1">
        <template v-if="!props.loading">
            <slot />
        </template>
    </v-container>
</template>

<script setup>

import { useAppStore } from '@/store/app';
import { reactive, onUpdated, watch } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
    pageTitle: {},
    breadcrumbs: {
        type: Array,
        default: null
    },
    loading: {
        type: Boolean,
        default: false
    },

    actionCreate: {
        type: [Object],
        default: Object.create({
            show: false,
            text: 'Novo item',
            to: null
        })
    }
});

const appStore = useAppStore();

let breads = reactive([]);

const route = useRoute();

/**
 * 
 * Methods
 * 
 */
const method_setTitlebar = () => {
    let titleContent = props.pageTitle ?? '';

    if (breads?.length) {
        titleContent = (breads.map((v) => {
            return v.title;
        })).join(' » ');
    }

    document.title = appStore.getName + ' - ' + titleContent;
};

const method_actionCreate = () => {
    if (props.actionCreate?.to) {
        return;
    }

    try {
        props.actionCreate?.callback();
    } catch {
        // 
    }
};

onUpdated(() => {

    method_setTitlebar();

})

/**
 * 
 * Whatch
 * 
 */
watch(() => props.breadcrumbs, (n) => {
    breads = [
        {
            title: 'Dashboard',
            to: {
                name: 'dashboard.home'
            },
            disabled: false
        }
    ];

    n.map((v) => {
        if (typeof v == 'string') {
            breads.push({
                title: v,
                disabled: true,
                href: null,
            });
        } else {
            breads.push({
                title: v.title ?? v.text,
                disabled: v?.disabled !== undefined ? v.disabled : route.name == v?.to?.name,
                to: v?.to ?? null,
                href: (v?.href ?? (v?.url ?? null))
            });
        }
    });
}, { immediate: true, deep: true });

watch(() => breads, () => {
    method_setTitlebar();
}, { deep: true, immediate: true });

watch(() => props.loading, (n) => {
    appStore.setLoadingContent(n);
}, { immediate: true });

</script>
