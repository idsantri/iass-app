<template>
    <CardPage :dynamic-height="true">
        <CardHeader
            title="Data Anggota Bansus"
            @on-reload="reload"
            :show-add="true"
            @on-add="dialog = true"
        >
        </CardHeader>
        <div v-if="!realtime" class="bg-yellow-2 text-black text-center q-pa-xs">
            <q-icon name="warning" class="q-mr-sm" />
            Data tidak realtime. Klik tombol muat ulang untuk memperbarui data!
        </div>

        <q-card-section class="q-pa-sm">
            <LoadingAbsolute v-if="isLoading" />
            <q-table
                :columns="columns"
                flat
                bordered
                row-key="id"
                :rows="bansuses"
                :rows-per-page-options="[10, 25, 50, 100, 0]"
                :loading="isLoading"
                @row-click="(e, row, i) => $router.push(`/bansuses/${row.id}`)"
                :filter="filter"
            >
                <template v-slot:top-right>
                    <q-input
                        outlined
                        dense
                        debounce="300"
                        color="primary"
                        v-model="filter"
                        clearable
                    >
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                </template>
            </q-table>
            <!-- <pre
                >{{ bansuses }}
            </pre> -->
        </q-card-section>

        <QDialog v-model="dialog">
            <BansusForm @success-submit="(res) => $router.push(`/bansuses/${res.id}`)" />
        </QDialog>
    </CardPage>
</template>

<script setup>
import CardHeader from '@/components/cards/CardHeader.vue';
import BansusForm from '@/components/forms/BansusForm.vue';
import LoadingAbsolute from '@/components/LoadingAbsolute.vue';
import { useBansusesStore } from '@/stores/bansusesStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

const store = useBansusesStore();
const { isLoading, bansusesFlattened: bansuses } = storeToRefs(store);

const realtime = ref(false);
const dialog = ref(false);
const filter = ref('');

const reload = async () => {
    await store.loadData();
    realtime.value = true;
};

onMounted(async () => {
    realtime.value = false;
    if (!bansuses.value?.length) {
        await reload();
    }
});

const columns = [
    // {
    //     name: 'member_id',
    //     label: 'ID Alumni',
    //     sortable: true,
    //     field: 'member_id',
    //     align: 'center',
    // },
    {
        name: 'id',
        label: 'ID Bansus',
        sortable: true,
        field: 'id',
        align: 'center',
    },
    {
        name: 'member_nama',
        label: 'Nama',
        sortable: true,
        field: 'member_nama',
        align: 'left',
    },
    {
        name: 'member_komisariat',
        label: 'Komisariat',
        sortable: true,
        field: 'member_komisariat',
        align: 'left',
    },
    {
        name: 'jabatan_max',
        label: 'Jabatan',
        sortable: true,
        field: 'jabatan_max',
        align: 'left',
    },
    {
        name: 'status_max',
        label: 'Status',
        sortable: true,
        field: 'status_max',
        align: 'left',
    },
];
</script>
<style lang=""></style>
