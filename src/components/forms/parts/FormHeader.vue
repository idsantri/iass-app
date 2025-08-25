<template lang="">
    <q-card-section class="bg-orange-7 text-orange-1 q-pa-sm">
        <q-toolbar class="q-px-none" style="min-height: 0">
            <q-toolbar-title class="text-subtitle1">
                {{ title }}
                <span v-if="slot" class="text-white">
                    &mdash;
                    <em>{{ isNew ? 'baru' : 'edit' }}</em>
                </span>
            </q-toolbar-title>
            <slot></slot>
            <q-chip
                v-if="!slot"
                outline
                square
                color="orange-1"
                text-color="white"
                class="text-italic text-weight-light no-margin"
                :ripple="false"
                :icon="isNew ? 'sym_o_new_releases' : 'sym_o_stylus'"
            >
                input:&nbsp;
                <span style="font-weight: 500 !important">
                    {{ isNew ? 'baru' : 'edit' }}
                </span>
            </q-chip>
        </q-toolbar>
    </q-card-section>
</template>
<script setup>
/**
	@example
	<FormHeader
		title="Input Desa/Kelurahan"
		:is-new="props.data?.id ? false : true"
	/>
  **/

import { onMounted, ref, useSlots } from 'vue';

defineProps({
    title: { type: String, default: 'Input' },
    isNew: { type: Boolean, default: () => true },
});

const slot = ref(false);
const checkSlotUsage = () => (useSlots().default ? (slot.value = true) : (slot.value = false));

onMounted(() => {
    checkSlotUsage();
});
</script>
<style lang="scss"></style>
