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
import Address from '@/models/Address';
import { ref } from 'vue';

const inputs = defineModel();
const options = ref([]);
const loading = ref(false);

async function filterFunction(val, update) {
    if (!val) {
        update(() => {
            options.value = [];
        });
        return;
    }
    try {
        loading.value = true;
        const data = await Address.searchKabKota({ q: val });
        update(
            () => (options.value = data.kabupaten_kota),
            (menuRef) => {
                if (val !== '' && menuRef.options.length) {
                    menuRef.setOptionIndex(-1);
                    menuRef.moveOptionSelection(1, true);
                }
            },
        );
    } catch (error) {
        console.log('error get kota lahir ', error);
    } finally {
        loading.value = false;
    }
}
</script>
<style lang=""></style>
