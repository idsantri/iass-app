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
        <q-banner v-if="warning" class="bg-yellow-2 text-black text-center q-pa-sm">
            <q-icon name="warning" class="q-mr-sm" />
            Klik tombol muat ulang untuk memperbarui data!
        </q-banner>
        <QCardSection class="q-pa-sm bg-orange-1">
            <div class="flex items-center justify-between q-gutter-y-sm">
                <QSelect
                    outlined
                    v-model="filterKomisariat"
                    :options="komisariatOptions"
                    label="Filter Komisariat"
                    class="full-width"
                    behavior="menu"
                    clearable=""
                    style="max-width: 450px"
                    dense
                />
                <q-card
                    bordered
                    flat
                    class="q-px-sm bg-transparent flex items-center justify-between full-width"
                    style="max-width: 450px"
                >
                    <div class="text-caption">Status</div>
                    <div class="q-gutter-sm">
                        <q-radio
                            v-model="filterStatus"
                            val="active"
                            label="Aktif"
                            color="orange-10"
                            checked-icon="task_alt"
                            unchecked-icon="panorama_fish_eye"
                        />
                        <q-radio
                            v-model="filterStatus"
                            val="non-active"
                            label="Non Aktif"
                            color="orange-10"
                            checked-icon="task_alt"
                            unchecked-icon="panorama_fish_eye"
                        />
                        <q-radio
                            v-model="filterStatus"
                            val="all"
                            label="Semua"
                            color="orange-10"
                            checked-icon="task_alt"
                            unchecked-icon="panorama_fish_eye"
                        />
                    </div>
                </q-card>
            </div>
        </QCardSection>
        <q-card-section class="relative-position">
            <LoadingFixed v-if="isLoading" />
            <DataTable class="display" :options="optionsDT" :data="filteredMembers" ref="table" />
        </q-card-section>
    </q-card>
    <QDialog v-model="dialog">
        <MemberForm @success-submit="(res) => $router.push(`/members/${res.id}`)" />
    </QDialog>
</template>

<script setup>
import 'datatables.net-select-dt';
import { onMounted, ref } from 'vue';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-dt';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import useMembersStore from '@/stores/membersStore';
import Member from '@/models/Member';
import SectionHeader from '@/components/SectionHeader.vue';
import LoadingFixed from '@/components/LoadingFixed.vue';
import MemberForm from '@/components/forms/MemberForm.vue';

const table = ref(null);
const isLoading = ref(false);
const router = useRouter();
const dialog = ref(false);
const warning = ref(true);

const membersStore = useMembersStore();
const { filterKomisariat, filterStatus, members, komisariatOptions, filteredMembers } =
    storeToRefs(membersStore);

DataTable.use(DataTablesCore);

async function loadData() {
    try {
        isLoading.value = true;
        const res = await Member.getAll();
        membersStore.setMembers(res.members);
        warning.value = false;
    } catch (e) {
        console.log('error get members ', e);
    } finally {
        isLoading.value = false;
    }
}

const optionsDT = ref({
    responsive: true,
    order: [],
    select: {
        style: 'single',
        info: false,
    },
    columns: [
        {
            title: 'ID',
            data: 'id',
        },
        {
            title: 'Nama',
            data: 'nama',
        },
        {
            title: 'Alamat',
            render: function (data, type, row) {
                return `${row.jl ?? ''} ${row.desa ?? ''} ${row.kecamatan ?? ''}`;
            },
            // data: 'alamat_singkat',
        },
        {
            title: 'Komisariat',
            data: 'komisariat',
        },
        {
            title: 'Kelompok',
            data: 'kelompok',
        },
        {
            title: 'Status',
            data: 'status_max',
        },
        {
            title: 'Keanggotaan',
            // data: 'iass',
            render: function (data, type, row) {
                return `${row.alumni == true ? 'IASS' : 'Sidogirian'}`;
            },
        },
        {
            title: 'NIK',
            data: 'nik',
        },
    ],
    language: {
        search: 'Cari:',
        zeroRecords: 'Tidak data data untuk ditampilkan. Coba kata kunci yang lain!',
        info: 'Menampilkan _START_ hingga _END_, dari total _TOTAL_ data',
        infoFiltered: '(disaring dari _MAX_ total data)',
        paginate: { first: '↑', previous: '←', next: '→', last: '↓' },
        lengthMenu: '_MENU_ Perhalaman',
    },
    autoWidth: true,
    dom: 'bftip',
    scrollX: true,
});

onMounted(async () => {
    if (!members.value.length) {
        await loadData();
    }

    if (table.value) {
        const dt = table.value.dt;
        dt.on('select', (e, dt, type, indexes) => {
            const selectedData = dt.rows(indexes).data().toArray();
            if (selectedData.length > 0) {
                const selected = selectedData[0];
                router.push(`/members/${selected.id}`);
            }
        });
    }
});
</script>

<style lang="scss">
@import 'datatables.net-dt';
// @import 'datatables.net-select-dt';
@import 'datatables.net-responsive-dt';
</style>
