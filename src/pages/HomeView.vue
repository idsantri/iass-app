<script setup>
import { ref } from 'vue'
import InputAlamat from './InputAlamat.vue'

const inputs = ref({})
</script>

<template>
  <q-input type="text" v-model="inputs.nama" outlined="" />
  <q-input type="text" v-model="inputs.alamat" outlined="" />
  <InputAlamat v-model="inputs" />
  <pre>
  {{ inputs }}
</pre
  >
</template>
