<script setup>
import { ref } from 'vue';

const inputs = ref({});
</script>

<template>
    <q-input type="text" v-model="inputs.nama" outlined="" />
    <q-input type="text" v-model="inputs.alamat" outlined="" />
    <pre>
  {{ inputs }}
</pre
    >
</template>
