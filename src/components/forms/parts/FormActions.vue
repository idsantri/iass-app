<template lang="">
    <q-card-actions class="flex items-center bg-orange-6">
        <q-btn v-if="btnDelete" color="negative" no-caps="" @click="$emit('onDelete')">
            <q-icon v-if="iconDelete" :name="iconDelete" class="q-mr-xs" />
            <span>{{ labelDelete }}</span>
        </q-btn>
        <q-space />
        <q-btn v-if="btnClose" v-close-popup color="warning" no-caps="" id="btn-close-form">
            <q-icon v-if="iconClose" :name="iconClose" class="q-mr-xs" />
            <span>{{ labelClose }}</span>
        </q-btn>
        <q-btn type="submit" color="positive" no-caps="">
            <q-icon v-if="iconSubmit" :name="iconSubmit" class="q-mr-xs" />
            <span>{{ labelSubmit }}</span>
        </q-btn>
    </q-card-actions>
</template>
<script setup>
defineProps({
    btnDelete: { type: Boolean, default: true },
    btnClose: { type: Boolean, default: true },

    labelDelete: { type: String, default: () => 'Hapus' },
    labelClose: { type: String, default: () => 'Tutup' },
    labelSubmit: { type: String, default: () => 'Simpan' },

    iconSubmit: { type: String, default: () => 'sym_o_save' },
    iconDelete: { type: String, default: () => 'sym_o_delete' },
    iconClose: { type: String, default: () => 'sym_o_close' },
});
</script>
<style lang=""></style>
