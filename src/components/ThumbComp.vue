<template>
    <v-img v-if="props.imageUrl" :src="props.imageUrl" :width="(maxWidth + 'px')" :height="(maxHeight + 'px')" cover
        :class="[props.elevated ? 'elevation-4' : '', props.border ? 'border' : '', props.circle ? 'rounded-circle' : '']" />
    <div v-else class="d-flex align-center justify-center text-h6 font-weight-medium bg-light-lighten-4 text-light-darken-4"
        :class="[props.elevated ? 'elevation-4' : '', props.border ? 'border' : '', props.circle ? 'rounded-circle' : '']"
        :style="['width: ' + props.maxWidth + 'px', 'height: ' + props.maxHeight + 'px']">
        {{ props.alternativeText[0] }}
    </div>
</template>

<script setup>

const props = defineProps({
    imageUrl: {
        type: [String, null],
        default: null
    },
    alternativeText: {
        type: [String],
        default: 'Unk'
    },
    maxWidth: {
        type: [Number, String],
        default: 50
    },
    maxHeight: {
        type: [Number, String],
        default: 50
    },
    circle: {
        type: Boolean,
        default: false
    },
    border: {
        type: Boolean,
        default: false
    },
    elevated: {
        type: Boolean,
        default: false
    }
});

</script>