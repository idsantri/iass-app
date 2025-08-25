<template>
    <q-header elevated class="bg-orange-10 text-orange-1">
        <q-toolbar>
            <q-btn flat @click="$emit('onDrawer', drawer)" round dense icon="menu" />
            <q-toolbar-title>{{ env.VITE_APP_INSTANCE }}</q-toolbar-title>
        </q-toolbar>
    </q-header>
</template>

<script setup>
import { ref } from 'vue';

const env = import.meta.env;
const drawer = ref(false);
</script>
