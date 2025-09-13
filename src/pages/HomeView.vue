<script setup>
const env = import.meta.env;
</script>

<template>
    <div class="">
        <div class="text-center tw:py-8">
            <q-avatar round color="" size="200px">
                <img alt="logo" src="/icons/icon-512x512.png" />
            </q-avatar>
        </div>
        <div class="tw:text-center tw:p-2 tw:space-y-2">
            <div class="tw:text-xl tw:font-light">Selamat Datang di</div>
            <div class="tw:text-2xl tw:font-semibold">{{ env.VITE_APP_LONG_NAME }}</div>
            <div class="tw:text-xl">{{ env.VITE_APP_DESCRIPTION }}</div>
        </div>
        <!-- <pre>{{ env }}</pre> -->
    </div>
</template>
