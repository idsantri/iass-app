<template lang="">
    <q-card flat bordered>
        <q-card-section class="bg-orange-7 text-orange-1 q-pa-xs flex items-center justify-between">
            <q-tabs v-model="tab" class="" no-caps dense>
                <q-tab name="positions" label="Jabatan" class="" />
                <q-tab name="statuses" label="Status" class="" />
            </q-tabs>
            <div class="tw:flex tw:gap-2">
                <q-btn dense outline no-caps icon="add" label="Tambah" class="q-px-sm" disable />
                <!-- <q-btn dense outline no-caps icon="add" label="Tambah" class="q-px-sm" disable /> -->
            </div>
        </q-card-section>
        <q-card-section class="q-pa-sm">
            <q-tab-panels v-model="tab" animated class="rounded-borders">
                <q-tab-panel name="positions" class="q-pa-none">
                    <ListPositions />
                </q-tab-panel>

                <q-tab-panel name="statuses" class="q-pa-none">
                    <ListStatuses />
                </q-tab-panel>
            </q-tab-panels>
        </q-card-section>
    </q-card>
</template>
<script setup>
import { ref } from 'vue';
import ListPositions from './ListPositions.vue';
import ListStatuses from './ListStatuses.vue';

const tab = ref('statuses');
</script>
<style lang=""></style>
