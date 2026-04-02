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
                    (evt, row, index) =>
                        $router.push({
                            path: `/activities/${row.id}`,
                            query: { scope: QScope },
                        })
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
                @success-create="onCreate"
                :dataInputs="{ komisariat: komisariatUser }"
                :scope="QScope"
            />
        </QDialog>
    </CardPage>
</template>
<script setup>
import ActivityForm from '@/components/forms/ActivityForm.vue';
import InputSelectArray from '@/components/forms/inputs/InputSelectArray.vue';
import Activity from '@/models/Activity';
import authStore from '@/stores/authStore';
import { formatDate } from '@/utils/date-operation';
import { toProperCase } from '@/utils/string';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQueryState } from 'vue-url-state';

const komisariatUser = authStore().user.komisariat;
const activities = ref([]);
const loading = ref(false);
const dialog = ref(false);
const QScope = useQueryState('scope', '');
const router = useRouter();
const filterKomisariat = ref('');
const filterText = ref('');

const titlePage = computed(() => {
    const baseTitle = 'Data Kegiatan';
    if (QScope.value) {
        return `${baseTitle} — ${toProperCase(QScope.value)}`;
    }
    return baseTitle;
});

const filteredActivities = computed(() =>
    filterKomisariat.value
        ? activities.value.filter(
              (a) => a.komisariat.toLowerCase() == filterKomisariat.value.toLowerCase(),
          )
        : activities.value,
);

watch(QScope, async (newScope, _oldScope) => {
    await loadData(newScope);
    if (komisariatUser && newScope?.toLowerCase() == 'komisariat') {
        filterKomisariat.value = komisariatUser;
    }
});

async function loadData(lingkup) {
    try {
        loading.value = true;
        const data = await Activity.getAll({ lingkup: lingkup?.toLowerCase() });
        activities.value = data.activities;
    } catch (error) {
        console.log('error get activities ', error);
    } finally {
        loading.value = false;
    }
}

const onCreate = (newActivity) => {
    dialog.value = false;
    router.push({
        path: `/activities/${newActivity.id}`,
        query: { scope: QScope.value },
    });
};

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
