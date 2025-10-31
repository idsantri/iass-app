<template>
    <div>
        <q-card flat bordered style="max-width: 1024px">
            <CardHeader :title="`Data Kegiatan Komisariat ${komisariat}`" @on-reload="loadData">
                <template #buttons>
                    <QBtn
                        dense
                        label="Tambah"
                        outline=""
                        icon="add"
                        no-caps
                        class="q-px-md"
                        @click="dialog = true"
                        :disable="!komisariat"
                    />
                </template>
            </CardHeader>

            <q-card-section class="q-pa-sm">
                <QTable :rows="activities" :columns="columns" flat :loading="loading" />
            </q-card-section>
        </q-card>
        <QDialog v-model="dialog">
            <KomisariatActivityForm @success-submit="loadData" :dataInputs="{ komisariat }" />
        </QDialog>
    </div>
</template>
<script setup>
import CardHeader from '@/components/cards/CardHeader.vue';
import KomisariatActivityForm from '@/components/forms/KomisariatActivityForm.vue';
import KomisariatActivities from '@/services/KomisariatActivities';
import authStore from '@/stores/authStore';
import { formatDate } from '@/utils/date-operation';
import { computed, ref } from 'vue';

const komisariat = authStore().user.komisariat;
const params = komisariat ? { komisariat } : {};
const { data, loading, execute: loadData } = KomisariatActivities.useGetAll(params);
const activities = computed(() => data.value?.activities || []);
const dialog = ref(false);
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
