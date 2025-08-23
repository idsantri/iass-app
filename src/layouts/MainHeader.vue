<template>
  <q-header elevated :class="$q.dark.isActive ? 'bg-secondary' : 'bg-black'">
    <q-toolbar>
      <q-btn flat @click="$emit('onDrawer', drawer)" round dense icon="menu" />
      <q-toolbar-title>{{ env.VITE_APP_INSTANCE }}</q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const env = import.meta.env
const $q = useQuasar()
const drawer = ref(false)
</script>
