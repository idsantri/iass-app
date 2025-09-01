<template>
    <q-btn-dropdown color="orange-10" outline label="Menu" no-caps dense class="q-px-sm">
        <q-list>
            <q-item clickable v-close-popup @click="null" disable>
                <q-item-section>
                    <q-item-label>Detail (Input)</q-item-label>
                </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="null" disable>
                <q-item-section>
                    <q-item-label>Scan QR</q-item-label>
                </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="removeAbsences">
                <q-item-section>
                    <q-item-label>Reset Data</q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
    </q-btn-dropdown>
</template>
<script setup>
import NksAbsence from '@/models/NksAbsence';
import { notifyConfirm } from '@/utils/notify';

const emit = defineEmits(['onLoading', 'successDelete']);
const props = defineProps({
    nksId: { required: true },
});

async function removeAbsences() {
    const isConfirmed = await notifyConfirm('Hapus data absensi untuk NKS ini?', true);
    if (!isConfirmed) return;

    try {
        emit('onLoading', true);
        await NksAbsence.removeByNks(props.nksId);
        emit('successDelete', props.nksId);
    } catch (error) {
        console.log('error on reset absence ', error);
    } finally {
        emit('onLoading', false);
    }
}
</script>
