<template lang="">
    <q-select
        class="q-my-sm"
        dense
        hint="Kota kelahiran"
        outlined
        label="Tempat Lahir"
        v-model="inputs.tmp_lahir"
        :options="options"
        emit-value
        map-options
        error-color="negative"
        :loading="loading"
        input-debounce="100"
        use-input
        clearable=""
        new-value-mode="add"
        @filter="filterFunction"
        behavior="menu"
    />
    <!-- <pre>{{ input }}</pre> -->
</template>
<script setup>
/**
 * @example
	<input-select-kota-lahir
		@emit-input="(val) => (input.tmp_lahir = val.tmp_lahir)"
		:data="input" />
 */

import Address from '@/models/Address';
import { onMounted, ref } from 'vue';
const inputs = defineModel();
// const props = defineProps({
//     data: { type: Object, required: true },
// });
// const emit = defineEmits(['emitInput']);

// const input = ref(props.data);
const options = ref([]);
const loading = ref(false);

// function onInput() {
//     emit('emitInput', input.value);
// }

onMounted(async () => {
    /**
     * tak pakai Object.assign
     * karena telat baca pada input aparatur
     */
    // console.log('props', props.tmp_lahir);
    // Object.assign(input.value, props.data);
    // console.log('input', input.value);
});

async function filterFunction(val, update) {
    if (!val) {
        update(() => {
            options.value = [];
        });
        return;
    }
    const data = await Address.searchKabKota({ q: val });
    // console.log(data);
    update(
        () => (options.value = data.kabupaten_kota),
        (menuRef) => {
            if (val !== '' && menuRef.options.length) {
                menuRef.setOptionIndex(-1);
                menuRef.moveOptionSelection(1, true);
            }
        },
    );
}
</script>
<style lang=""></style>
