<template lang="">
    <q-card-section class="bg-orange-9 text-orange-1 q-pa-sm">
        <div class="flex items-center">
            <div class="text-subtitle2 flex items-center">
                <q-btn
                    v-if="showReload"
                    icon="sync"
                    no-caps
                    @click="$emit('onReload')"
                    dense
                    flat
                    class="q-mr-xs"
                    title="Muat ulang"
                />
                <!-- <q-icon v-else name="dashboard" class="q-mr-xs" size="sm" /> -->
                <img
                    v-else
                    src="/idsantri.svg"
                    class="q-mr-xs"
                    style="height: 24px"
                    title="ID Santri"
                />
                <span v-html="title"></span>
            </div>
            <q-space />
            <slot name="left"></slot>
            <q-btn
                v-if="showBack"
                no-caps
                :label="$q.screen.lt.sm ? '' : 'Kembali'"
                icon="reply"
                dense
                class="q-px-md"
                outline
                @click="$router.go(-1)"
                title="Kembali"
            />
            <slot name="right"></slot>
        </div>
    </q-card-section>
</template>
<script setup>
defineProps({
    showReload: { type: Boolean, default: true },
    showBack: { type: Boolean, default: true },
    title: { type: String, required: true },
});
</script>
<style lang=""></style>
