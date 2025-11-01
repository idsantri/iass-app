<template lang="">
    <q-card-section class="bg-orange-9 text-orange-1 q-pa-sm">
        <div class="tw:flex tw:flex-wrap tw:justify-between tw:items-center tw:gap-2 tw:w-full">
            <!-- child 1 -->
            <div class="tw:flex-shrink-0">
                <div class="tw:flex tw:items-center justify-start">
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
                    <img
                        v-else
                        src="/idsantri.svg"
                        class="q-mr-xs"
                        style="height: 24px"
                        title="ID Santri"
                    />
                    <div v-html="title" class="text-subtitle2"></div>
                </div>
            </div>

            <!-- child 2 -->
            <div class="tw:text-right tw:ml-auto">
                <div class="tw:flex tw:items-center tw:gap-2 tw:justify-end">
                    <div class="tw:flex tw:items-center tw:gap-2">
                        <slot name="buttons"> </slot>
                    </div>
                    <q-btn
                        v-if="showEdit"
                        no-caps
                        :label="$q.screen.lt.sm ? '' : 'Edit'"
                        icon="edit"
                        dense
                        class="q-px-sm"
                        outline
                        @click="$emit('onEdit')"
                        title="Sunting data"
                        :disable="disableEdit"
                    />
                    <q-btn
                        v-if="showAdd"
                        no-caps
                        :label="$q.screen.lt.sm ? '' : 'Tambah'"
                        icon="add"
                        dense
                        class="q-px-sm"
                        outline
                        @click="$emit('onAdd')"
                        title="Tambah data baru"
                        :disable="disableAdd"
                    />
                    <q-btn
                        v-if="showBack"
                        no-caps
                        :label="$q.screen.lt.sm ? '' : 'Kembali'"
                        icon="reply"
                        dense
                        class="q-px-sm"
                        outline
                        @click="$router.go(-1)"
                        title="Kembali"
                    />
                    <q-btn-dropdown
                        flat
                        no-caps
                        class="text-orange-11"
                        dense
                        dropdown-icon="more_vert"
                        :disabled="!slotMore"
                        title="Lainnya"
                    >
                        <slot name="more"></slot>
                    </q-btn-dropdown>
                </div>
            </div>
        </div>
    </q-card-section>
</template>
<script setup>
import { useSlots } from 'vue';

defineProps({
    showReload: { type: Boolean, default: true },
    showBack: { type: Boolean, default: true },
    showEdit: { type: Boolean, default: false },
    showAdd: { type: Boolean, default: false },
    disableEdit: { type: Boolean, default: false },
    disableAdd: { type: Boolean, default: false },

    title: { type: String, required: true },
});
const slots = useSlots();
const slotMore = !!slots.more;
</script>
<style lang=""></style>
