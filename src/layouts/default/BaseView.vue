<template>
    <div class="bg-light py-4">
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
            <div>

            </div>
        </v-container>
    </div>

    <v-container class="py-6">
        <template v-if="props.loading">
            <v-row class="fill-height" align-content="center" justify="center">
                <v-col class="text-subtitle-1 text-center" cols="12">
                    Carregando
                </v-col>
                <v-col cols="10">
                    <v-progress-linear color="primary" indeterminate rounded height="8" />
                </v-col>
            </v-row>
        </template>
        <template v-else>
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
}

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

</script>