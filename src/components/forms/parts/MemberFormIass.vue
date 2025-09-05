<template>
    <q-card bordered flat class="q-px-sm q-my-sm bg-transparent flex items-center">
        <div class="q-mr-md text-caption">Keanggotaan</div>
        <q-toggle
            v-model="inputs.alumni"
            color="orange"
            :true-value="1"
            :false-value="0"
            :label="inputs.alumni ? 'IASS' : 'Sidogirian'"
        />
    </q-card>
    <q-input
        dense
        hint=""
        class="q-my-sm"
        outlined
        label="Tahun Berhenti (Masehi)"
        v-model="inputs.th_berhenti"
        :disable="!inputs.alumni"
        :rules="[(val) => !val || (val?.length == 4 && !isNaN(val)) || '4 digit angka!']"
        error-color="negative"
    />
    <q-input
        dense
        hint=""
        class="q-my-sm"
        outlined
        label="Wilayah *"
        v-model="inputs.wilayah"
        disable
    />
    <InputSelectArray
        v-model="inputs.komisariat"
        url="komisariat"
        label="Komisariat *"
        class="q-my-sm"
    />
    <q-input
        dense
        class="q-my-sm"
        outlined
        label="Kelompok *"
        v-model="inputs.kelompok"
        hint="Kelompok koordinasi desa"
    />
</template>

<script setup>
import { watch } from 'vue';
import InputSelectArray from '../inputs/InputSelectArray.vue';

const inputs = defineModel();
watch(
    () => inputs.value.alumni,
    (n, _o) => {
        if (!n) {
            inputs.value.th_berhenti = '';
        }
    },
);
</script>
