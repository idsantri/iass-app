<template>
    <q-input
        dense
        class="q-my-sm"
        outlined
        label="ID IASS *"
        v-model="inputs.id"
        :rules="[(val) => !isNaN(val) || 'Hanya angka!']"
        error-color="negative"
        type="number"
    />
    <q-input
        dense
        hint="tanpa gelar kehormatan"
        class="q-my-sm"
        outlined
        label="Nama *"
        v-model="inputs.nama"
        :rules="[
            (val) => !!val || 'Harus diisi!',
            (val) => val?.length >= 4 || 'Setidaknya 4 huruf!',
        ]"
        error-color="negative"
        autocapitalize="words"
    />
    <q-input
        dense
        hint=""
        class="q-my-sm"
        outlined
        label="Nomor Induk Kependudukan"
        v-model="inputs.nik"
        :rules="[(val) => !val || (val?.length == 16 && !isNaN(val)) || '16 digit angka!']"
    />
    <InputSelectKotaLahir v-model="inputs" />
    <q-input
        dense
        class="q-my-sm"
        outlined
        label="Tanggal Lahir"
        v-model="inputs.tgl_lahir"
        type="date"
        hint=""
    />
    <q-input
        dense
        class="q-my-sm"
        outlined
        label="Nomor Telepon"
        v-model="inputs.no_hp"
        type="number"
        hint="08123456789"
        :rules="[(val) => !val || !isNaN(val) || 'hanya angka!']"
    />
    <q-input
        dense
        class="q-my-sm"
        outlined
        label="Email"
        v-model="inputs.email"
        type="email"
        hint=""
    />
</template>
<script setup>
import InputSelectKotaLahir from '../inputs/InputSelectKotaLahir.vue';

const inputs = defineModel();
</script>
