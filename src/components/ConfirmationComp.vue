<template>
    <v-dialog v-model="show" persistent width="100%" max-width="375px" transition="dialog-transition">
        <v-card class="pa-4">
            <v-card-title class="px-2" :class="['text-' + props.color]">
                {{ props.title ? props.title : 'Confirme esta ação' }}
            </v-card-title>
            <v-card-text class="mb-3 px-2" :class="['text-' + props.color]">
                {{ props.text ?? 'Esta ação precisa de uma confirmação. Confirme para continuar.' }}
            </v-card-text>
            <v-card-actions>
                <v-btn @click="method_cancel" class="px-5" prepend-icon="mdi-close" text="Cancelar" variant="outlined"
                    :color="props.color" :disabled="waitConfirmationCallbackResponse"
                    :loading="waitCancelCallbackResponse" />
                <v-btn @click="method_confirm" class="ml-auto px-5" prepend-icon="mdi-check" variant="text" text="Confirmar"
                    :color="props.color" :disabled="waitCancelCallbackResponse"
                    :loading="waitConfirmationCallbackResponse" />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>

import { watch, ref } from 'vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: null
    },
    text: {
        type: String,
        default: null
    },
    color: {
        type: String,
        default: 'info'
    },
    callbackConfirm: {
        type: Function,
        default: null
    },
    callbackCancel: {
        type: Function,
        default: null
    },
    id: {
        type: [Number, String],
        default: null
    },
    index: {
        type: [Number, String],
        default: null
    }
});

const emit = defineEmits({
    'update:modelValue': null,
    'canceled': null,
    'confirmed': null
});

const show = ref(false);

const waitConfirmationCallbackResponse = ref(false);

const waitCancelCallbackResponse = ref(false);

const method_cancel = () => {
    const data = {
        id: props.id,
        index: props.index
    };

    if (props.callbackCancel) {
        waitCancelCallbackResponse.value = true;

        try {
            props.callbackCancel(data).finally(() => {
                waitCancelCallbackResponse.value = false;
                method_actionFinalizer('canceled', data);
            });
        } catch {
            props.callbackCancel(data);
            waitCancelCallbackResponse.value = false;
            method_actionFinalizer('canceled', data);
        }
    } else {
        method_actionFinalizer('canceled', data);
    }

};

const method_confirm = () => {
    const data = {
        id: props.id,
        index: props.index
    };

    if (props.callbackConfirm) {
        waitConfirmationCallbackResponse.value = true;

        try {
            props.callbackConfirm(data).finally(() => {
                method_actionFinalizer('confirmed', data);
                waitConfirmationCallbackResponse.value = false;
            });
        } catch {
            props.callbackConfirm(data);
            waitConfirmationCallbackResponse.value = false;
            method_actionFinalizer('confirmed', data);
        }
    } else {
        method_actionFinalizer('confirmed', data);
    }
};

const method_actionFinalizer = (event, data) => {
    show.value = false;
    emit('update:modelValue', show.value);
    emit(event, data);
};

watch(() => props.modelValue, (n) => {
    show.value = n;
}, { immediate: true });

</script>
