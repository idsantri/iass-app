<template lang="">
  <q-card-actions class="flex bg-orange-6">
    <q-btn
      v-if="btnDelete"
      label="Hapus"
      class="bg-red text-red-1"
      no-caps=""
      @click="$emit('onDelete')"
    />
    <q-btn
      v-if="btnReset"
      label="Reset"
      class="bg-red text-red-1"
      no-caps=""
      @click="$emit('onReset')"
    />
    <q-space />
    <q-btn label="Tutup" v-close-popup class="bg-orange-11" no-caps="" id="btn-close-form" />
    <q-btn type="submit" label="Simpan" class="bg-orange-10 text-orange-1" no-caps="" />
  </q-card-actions>
</template>
<script setup>
defineProps({
  btnDelete: Boolean,
  btnReset: Boolean,
})
</script>
<style lang=""></style>
