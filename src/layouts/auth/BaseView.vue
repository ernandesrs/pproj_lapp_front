<template>
    <v-card width="100%" max-width="525px">
        <v-card-item class="d-flex flex-col justify-center">
            <v-icon icon="$vuetify" :size="75" class="mb-2"></v-icon>
            <h1>{{ pageTitle }}</h1>
        </v-card-item>
        <v-card-item>
            <slot name="form" />
        </v-card-item>
    </v-card>
</template>

<script setup>

import { onUpdated } from 'vue';

const props = defineProps({
    pageTitle: {}
});

/**
 * Methods
 */
const method_setTitlebar = () => {
    document.title = props.pageTitle;
}

method_setTitlebar();

onUpdated(() => {

    method_setTitlebar();

})

</script>
