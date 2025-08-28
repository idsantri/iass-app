<template>
    <q-header elevated class="bg-orange-10 text-orange-1">
        <q-toolbar>
            <q-btn flat @click="$emit('onDrawer', drawer)" round dense icon="menu" />
            <q-toolbar-title>{{ env.VITE_APP_INSTANCE }}</q-toolbar-title>
            <router-link to="/profile" class="text-caption flex items-center">
                <span class="q-px-xs">
                    {{ user.name }}
                </span>
                <q-icon name="person" size="xs" />
            </router-link>
        </q-toolbar>
    </q-header>
</template>

<script setup>
import authStore from '@/stores/authStore';
import { ref } from 'vue';
const env = import.meta.env;
const drawer = ref(false);

const user = authStore().user;
</script>
