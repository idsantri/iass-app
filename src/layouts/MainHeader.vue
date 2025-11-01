<template>
    <q-header elevated class="bg-orange-10 text-orange-1">
        <q-toolbar>
            <q-btn flat @click="$emit('onDrawer', drawer)" round dense icon="menu" />
            <q-toolbar-title>
                <router-link to="/">
                    {{ env.VITE_APP_INSTANCE }}
                </router-link>
            </q-toolbar-title>
            <q-btn-dropdown
                flat
                dense
                class="q-pl-md"
                color="orange-1"
                no-caps
                dropdown-icon="more_vert"
            >
                <template #label>
                    <span class="">
                        {{ user.name }}
                    </span>
                    <q-icon v-if="!$q.screen.lt.sm" name="account_circle" class="q-ml-xs" />
                </template>
                <q-list clickable v-close-popup>
                    <q-item to="/profile">
                        <q-item-section>Profil</q-item-section>
                        <q-item-section avatar>
                            <q-icon color="orange" name="3p" />
                        </q-item-section>
                    </q-item>

                    <q-item to="/logout">
                        <q-item-section>Keluar</q-item-section>
                        <q-item-section avatar>
                            <q-icon color="red" name="logout" />
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-btn-dropdown>
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
