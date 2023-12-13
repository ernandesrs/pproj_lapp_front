<template>
    <v-card :elevation="props.elevation" :border="props.border" :loading="props.loading">
        <v-card-title v-if="props.title">{{ props.title }}</v-card-title>
        <v-card-subtitle v-if="props.subtitle">{{ props.subtitle }}</v-card-subtitle>
        <v-card-text v-if="props.unbreakedSubtitle" class="text-disabled py-0">{{ props.unbreakedSubtitle }}</v-card-text>
        <v-card-item v-if="computed_hasContent">
            <slot name="content" />
        </v-card-item>
        <v-card-actions v-if="computed_hasActions" class="d-flex justify-end">
            <slot name="actions" />
        </v-card-actions>
    </v-card>
</template>

<script setup>

import { useSlots, computed } from 'vue';

const props = defineProps({
    hasActions: {
        type: Boolean,
        default: false
    },
    elevation: {
        type: [Number, String],
        default: 0
    },
    border: {
        type: [Boolean, Number, String],
        default: false
    },

    title: {
        type: [String],
        default: null
    },
    subtitle: {
        type: [String],
        default: null
    },
    unbreakedSubtitle: {
        type: [String],
        default: null
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const computed_hasContent = computed(() => {
    return useSlots()?.content ? true : false;
});

const computed_hasActions = computed(() => {
    return useSlots()?.actions ? true : false;
});

</script>
