<template>
  <q-input
    dense
    class="q-my-sm"
    outlined
    label="ID IASS *"
    v-model="inputs.id"
    :rules="[(val) => !val || !isNaN(val) || 'Hanya angka!']"
    error-color="negative"
  />
  <q-input
    dense
    hint=""
    class="q-my-sm"
    outlined
    label="Nama *"
    v-model="inputs.nama"
    :rules="[(val) => !!val || 'Harus diisi!', (val) => val?.length >= 5 || 'Setidaknya 5 huruf!']"
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
    error-color="negative"
  />
  <q-input dense hint="" class="q-my-sm" outlined label="Tempat Lahir" v-model="inputs.tmp_lahir" />
  <q-input
    dense
    class="q-my-sm"
    outlined
    label="Tanggal Lahir"
    v-model="inputs.tgl_lahir"
    type="date"
    hint=""
  />
</template>
<script setup>
const inputs = defineModel()
</script>
