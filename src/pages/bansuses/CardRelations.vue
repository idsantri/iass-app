<template lang="">
    <q-card flat bordered>
        <q-card-section class="bg-orange-7 text-orange-1 q-pa-xs flex">
            <q-tabs
                v-model="tab"
                class="text-orange-2"
                no-caps
                dense
                active-color="white"
                active-bg-color="orange-6"
            >
                <q-tab name="positions" label="Jabatan" class="" />
                <q-tab name="statuses" label="Status" class="" />
            </q-tabs>
        </q-card-section>
        <q-card-section class="q-pa-sm">
            <q-tab-panels v-model="tab" animated class="rounded-borders">
                <q-tab-panel name="positions" class="q-pa-none">
                    <ListPositions
                        :bansus_id="bansus_id"
                        :member="member"
                        @setLastPosition="emit('setLastPosition', $event)"
                    />
                </q-tab-panel>

                <q-tab-panel name="statuses" class="q-pa-none">
                    <ListStatuses
                        :bansus_id="bansus_id"
                        :member="member"
                        @setLastStatus="(val) => emit('setLastStatus', val)"
                    />
                </q-tab-panel>
            </q-tab-panels>
        </q-card-section>
    </q-card>
</template>
<script setup>
import { ref } from 'vue';
import ListPositions from './ListPositions.vue';
import ListStatuses from './ListStatuses.vue';

defineProps({
    bansus_id: [String, Number],
    member: Object,
});
const emit = defineEmits(['setLastStatus', 'setLastPosition']);

const tab = ref('positions');
</script>
<style lang=""></style>
