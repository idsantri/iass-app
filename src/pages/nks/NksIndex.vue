<template>
    <q-card flat bordered>
        <SectionHeader title="Data Anggota" @on-reload="loadData">
            <template #left>
                <QBtn
                    dense
                    label="Tambah"
                    outline=""
                    icon="add"
                    no-caps
                    class="q-px-md q-mr-sm text-orange-1"
                    @click="dialog = true"
                />
            </template>
        </SectionHeader>

        <q-card-section class="q-pa-sm">
            <QTable
                :rows="nks"
                flat
                :loading="loading"
                @row-click="(evt, row, index) => $router.push(`/nks/${row.id}`)"
            />
        </q-card-section>
    </q-card>
    <QDialog v-model="dialog">
        <!-- <MemberForm @success-submit="(res) => $router.push(`/anggota/${res.id}`)" /> -->
    </QDialog>
</template>
<script setup>
import SectionHeader from '@/components/SectionHeader.vue';
import Nks from '@/models/Nks';
import { onMounted, ref } from 'vue';

const nks = ref([]);
const loading = ref(false);
const dialog = ref(false);

async function loadData() {
    try {
        loading.value = true;
        const data = await Nks.getAll();
        nks.value = data.nks;
    } catch (error) {
        console.log('error get nks ', error);
    } finally {
        loading.value = false;
    }
}
onMounted(async () => {
    await loadData();
});
</script>
