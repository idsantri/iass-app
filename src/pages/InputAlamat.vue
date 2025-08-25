<template>
  <q-input outlined v-model="inputs.nama" />
  <q-input outlined v-model="inputs.dua" />
</template>
<script setup>
const inputs = defineModel()
</script>
