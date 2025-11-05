<template>
    <q-card>
        <CardHeader
            :title="titlePage"
            @on-reload="loadData"
            :show-add="true"
            @on-add="dialog = true"
        />

        <q-card-section class="q-pa-sm" style="max-width: 1024px">
            <QTable
                :rows="activities"
                :columns="columns"
                flat
                bordered
                :loading="loading"
                @row-click="
                    (evt, row, index) => $router.push(`/${meta.scope}/activities/${row.id}`)
                "
            />
        </q-card-section>
        <QDialog v-model="dialog">
            <ActivityForm
                @success-create="(res) => $router.push(`/${meta.scope}/activities/${res.id}`)"
                :dataInputs="{ komisariat }"
                :scope="meta.scope"
            />
        </QDialog>
    </q-card>
</template>
<script setup>
import CardHeader from '@/components/cards/CardHeader.vue';
import ActivityForm from '@/components/forms/ActivityForm.vue';
import KomisariatActivities from '@/models/KomisariatActivities';
import WilayahActivities from '@/models/WilayahActivities';
import authStore from '@/stores/authStore';
import { formatDate } from '@/utils/date-operation';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const komisariat = authStore().user.komisariat;
const activities = ref([]);
const loading = ref(false);
const dialog = ref(false);
const { meta } = useRoute();
let model = null;

const titlePage =
    meta.scope == 'Wilayah'
        ? 'Data Kegiatan Wilayah'
        : meta.scope == 'Komisariat'
          ? 'Data Kegiatan Komisariat ' + (komisariat || '(?)')
          : 'Data Kegiatan';

onMounted(async () => {
    if (meta.scope == 'Komisariat') {
        model = KomisariatActivities;
    }
    if (meta.scope == 'Wilayah') {
        model = WilayahActivities;
    }
    await loadData();
});

async function loadData() {
    try {
        loading.value = true;
        const data = await model.getAll();
        activities.value = data.activities;
    } catch (error) {
        console.log('error get activities ', error);
    } finally {
        loading.value = false;
    }
}

const columns = [
    {
        name: 'tahun_bulan',
        label: 'Tahun Bulan',
        align: 'left',
        field: 'tahun_bulan',
        sortable: true,
        // sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
    },
    // {
    //     name: 'th_ajaran_h',
    //     label: 'Tahun Ajaran',
    //     align: 'left',
    //     field: 'th_ajaran_h',
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
