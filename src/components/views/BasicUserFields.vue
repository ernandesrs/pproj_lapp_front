<template>
    <v-row>
        <v-col cols="12" sm="6">
            <v-text-field v-model="data.first_name" name="first_name" label="Nome" id="first_name"
                :error-messages="props.errors?.first_name" />
        </v-col>
        <v-col cols="12" sm="6">
            <v-text-field v-model="data.last_name" name="last_name" label="Sobrenome" id="last_name"
                :error-messages="props.errors?.last_name" />
        </v-col>
        <v-col cols="12">
            <v-text-field v-model="data.username" name="username" label="Usuário" id="username"
                :error-messages="props.errors?.username" />
        </v-col>
    </v-row>
</template>

<script setup>

import { watch, reactive } from 'vue';

const props = defineProps({
    modelValue: null,
    errors: {}
});

const emit = defineEmits({
    'update:modelValue': null
});

let data = reactive({});

watch(() => props.modelValue, (n) => {
    data = n;
}, { immediate: true, deep: true });

watch(data, (newData) => {
    emit('update:modelValue', newData);
}, { deep: true });

</script>
