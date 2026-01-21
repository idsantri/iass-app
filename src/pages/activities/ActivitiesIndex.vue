<template>
    <CardPage>
        <CardHeader
            :title="titlePage"
            @on-reload="loadData"
            :show-add="true"
            @on-add="dialog = true"
        />

        <q-card-section class="q-pa-sm" style="max-width: 1024px">
            <QTable
                :rows="filteredActivities"
                :columns="columns"
                flat
                bordered
                :loading="loading"
                @row-click="
                    (evt, row, index) => $router.push(`/${meta.scope}/activities/${row.id}`)
                "
                :filter="filterText"
            >
                <template v-slot:top>
                    <div
                        class="tw:gap-y-2 tw:gap-x-8 tw:grid tw:grid-cols-1 tw:w-full tw:sm:flex tw:sm:items-center tw:sm:justify-between"
                    >
                        <InputSelectArray
                            v-model="filterKomisariat"
                            url="komisariat"
                            label="Pilih Komisariat"
                            class="tw:flex-1"
                        />
                        <q-input
                            class="tw:flex-1"
                            borderless
                            dense
                            debounce="300"
                            v-model="filterText"
                            placeholder="Cari"
                            outlined
                            clearable
                        >
                            <template v-slot:append>
                                <q-icon name="search" />
                            </template>
                        </q-input>
                    </div>
                </template>
            </QTable>
        </q-card-section>
        <QDialog v-model="dialog">
            <ActivityForm
                @success-create="(res) => $router.push(`/${meta.scope}/activities/${res.id}`)"
                :dataInputs="{ komisariat: komisariatUser }"
                :scope="meta.scope"
            />
        </QDialog>
        <!-- {{ filteredActivities }}
        {{ filterKomisariat }} -->
    </CardPage>
</template>
<script setup>
import ActivityForm from '@/components/forms/ActivityForm.vue';
import InputSelectArray from '@/components/forms/inputs/InputSelectArray.vue';
import KomisariatActivities from '@/models/KomisariatActivities';
import WilayahActivities from '@/models/WilayahActivities';
import authStore from '@/stores/authStore';
import { formatDate } from '@/utils/date-operation';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const komisariatUser = authStore().user.komisariat;
const activities = ref([]);
const loading = ref(false);
const dialog = ref(false);
const { meta } = useRoute();
let model = null;

const titlePage = 'Data Kegiatan ' + meta.scope;
const filterKomisariat = ref('');
const filterText = ref('');

const filteredActivities = computed(() =>
    filterKomisariat.value
        ? activities.value.filter(
              (a) => a.komisariat.toLowerCase() == filterKomisariat.value.toLowerCase(),
          )
        : activities.value,
);

onMounted(async () => {
    if (meta.scope == 'Komisariat') {
        model = KomisariatActivities;
        filterKomisariat.value = komisariatUser;
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
