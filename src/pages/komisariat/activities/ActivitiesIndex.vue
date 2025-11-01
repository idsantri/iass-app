<template>
    <div>
        <q-card flat bordered style="max-width: 1024px">
            <CardHeader
                :title="`Data Kegiatan`"
                @on-reload="loadData"
                :show-add="true"
                :disable-add="!komisariat"
                @on-add="dialog = true"
            />

            <q-card-section class="q-pa-sm">
                <QTable
                    :rows="activities"
                    :columns="columns"
                    flat
                    :loading="loading"
                    @row-click="
                        (evt, row, index) => $router.push(`/komisariat/activities/${row.id}`)
                    "
                />
            </q-card-section>
        </q-card>
        <QDialog v-model="dialog">
            <KomisariatActivityForm
                @success-create="(res) => $router.push(`/komisariat/activities/${res.id}`)"
                :dataInputs="{ komisariat }"
            />
        </QDialog>
    </div>
</template>
<script setup>
import CardHeader from '@/components/cards/CardHeader.vue';
import KomisariatActivityForm from '@/components/forms/KomisariatActivityForm.vue';
import KomisariatActivities from '@/models/KomisariatActivities';
import authStore from '@/stores/authStore';
import { formatDate } from '@/utils/date-operation';
import { onMounted, ref } from 'vue';

const komisariat = authStore().user.komisariat;
const params = komisariat ? { komisariat } : {};
const activities = ref([]);
const loading = ref(false);
const dialog = ref(false);

async function loadData() {
    try {
        loading.value = true;
        const data = await KomisariatActivities.getAll(params);
        activities.value = data.activities;
    } catch (error) {
        console.log('error get activities ', error);
    } finally {
        loading.value = false;
    }
}
onMounted(async () => {
    await loadData();
});

const columns = [
    // {
    //     name: 'tahun_bulan',
    //     label: 'Tahun Bulan',
    //     align: 'left',
    //     field: 'tahun_bulan',
    //     sortable: true,
    //     // sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
    // },
    {
        name: 'tgl_m',
        label: 'Tanggal (M)',
        align: 'left',
        field: 'tgl_m',
        format: (val) => formatDate(val, 'cccc, dd MMMM yyyy'),
        sortable: true,
    },
    {
        name: 'nama',
        label: 'Nama Kegiatan',
        align: 'left',
        field: 'nama',
        sortable: true,
    },
    {
        name: 'komisariat',
        label: 'Komisariat',
        align: 'left',
        field: 'komisariat',
        sortable: true,
    },
];
</script>
