<template>
    <q-card flat bordered style="max-width: 1024px">
        <CardHeader title="Data NKS" @on-reload="loadData">
            <template #buttons>
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
        </CardHeader>

        <q-card-section class="q-pa-sm">
            <QTable
                :rows="nks"
                :columns="columns"
                flat
                :loading="loading"
                @row-click="(evt, row, index) => $router.push(`/nks/${row.id}`)"
            />
        </q-card-section>
    </q-card>
    <QDialog v-model="dialog">
        <NksForm @success-submit="(res) => $router.push(`/nks/${res.id}`)" />
    </QDialog>
</template>
<script setup>
import CardHeader from '@/components/cards/CardHeader.vue';
import NksForm from '@/components/forms/NksForm.vue';
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

const columns = [
    {
        name: 'tahun_bulan',
        label: 'Tahun Bulan',
        align: 'left',
        field: 'tahun_bulan',
        sortable: true,
        // sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
    },
    {
        name: 'th_ajaran_h',
        label: 'Tahun Ajaran',
        align: 'left',
        field: 'th_ajaran_h',
        sortable: true,
        // sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
    },
    {
        name: 'komisariat',
        label: 'Komisariat',
        align: 'left',
        field: 'komisariat',
        sortable: true,
        // sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
    },
];
</script>
