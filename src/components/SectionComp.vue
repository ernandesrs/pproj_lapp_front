<template>
    <v-card :elevation="props.elevation" :border="props.border" :loading="props.loading">
        <v-card-title v-if="props.title">{{ props.title }}</v-card-title>
        <v-card-subtitle v-if="props.subtitle">{{ props.subtitle }}</v-card-subtitle>
        <v-card-text>
            <slot name="content" />
        </v-card-text>
        <v-card-actions v-if="props.hasActions" class="d-flex justify-end">
            <slot name="actions" />
        </v-card-actions>
    </v-card>
</template>

<script setup>

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
    loading: {
        type: Boolean,
        default: false
    }
});

</script>
