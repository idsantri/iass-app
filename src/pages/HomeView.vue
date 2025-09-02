<script setup>
const env = import.meta.env;
</script>

<template>
    <div class="q-pa-xl">
        <div class="text-center">
            <q-avatar round color="orange-1" size="150px">
                <img alt="logo" src="/icons/icon-512x512.png" />
            </q-avatar>
        </div>
        <div class="tw:text-center tw:p-6">
            <div class="tw:text-xl tw:font-light">Selamat Datang di</div>
            <div class="tw:text-2xl">{{ env.VITE_APP_LONG_NAME }}</div>
            <div class="tw:text-xl">{{ env.VITE_APP_DESCRIPTION }}</div>
        </div>
        <!-- <pre>{{ env }}</pre> -->
    </div>
</template>
