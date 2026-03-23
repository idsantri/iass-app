<template>
    <q-input ref="inputRef" v-model="formattedValue" />
</template>

<script setup>
import { useCurrencyInput } from 'vue-currency-input';
import { watch } from 'vue';

const props = defineProps({
    modelValue: {
        required: true,
    },
});

const { inputRef, formattedValue, setValue } = useCurrencyInput({
    currency: 'IDR',
    // currencyDisplay: 'hidden',
    locale: 'id-ID',
});

watch(
    () => props.modelValue,
    (value) => {
        setValue(value);
    },
);
</script>
