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
                    class="q-px-sm q-mr-sm text-orange-1"
                    @click="dialog = true"
                />
            </template>
            <template #right>
                <q-btn-dropdown
                    flat
                    dense
                    class=""
                    color="orange-1"
                    no-caps
                    dropdown-icon="more_vert"
                >
                    <q-list clickable v-close-popup class="text-orange-10">
                        <q-item clickable="" @click="download('aktif')">
                            <q-item-section>Download Aktif</q-item-section>
                            <q-item-section avatar>
                                <q-icon color="orange" name="sym_o_download" />
                            </q-item-section>
                        </q-item>
                        <q-item clickable="" @click="download('semua')">
                            <q-item-section>Download Semua</q-item-section>
                            <q-item-section avatar>
                                <q-icon color="orange" name="sym_o_download" />
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown>
            </template>
        </SectionHeader>
        <q-banner v-if="warning" class="bg-yellow-2 text-black text-center q-pa-sm">
            <q-icon name="warning" class="q-mr-sm" />
            Data tidak realtime. Klik tombol muat ulang untuk memperbarui data!
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
            <DataTable
                class="display"
                :options="optionsDT"
                :data="filteredMembers"
                ref="table"
                @draw="onDataTableDraw"
            />
        </q-card-section>
    </q-card>
    <QDialog v-model="dialog">
        <MemberForm @success-submit="(res) => $router.push(`/members/${res.id}`)" />
    </QDialog>
</template>

<script setup>
import 'datatables.net-select-dt';
import { onMounted, ref, computed, watch } from 'vue';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-dt';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import useMembersStore from '@/stores/membersStore';
import Member from '@/models/Member';
import SectionHeader from '@/components/SectionHeader.vue';
import LoadingFixed from '@/components/LoadingFixed.vue';
import MemberForm from '@/components/forms/MemberForm.vue';
import FileDownloader from '@/models/FileDownloader';

const table = ref(null);
const isLoading = ref(false);
const router = useRouter();
const dialog = ref(false);
const warning = ref(true);

const membersStore = useMembersStore();
const {
    filterKomisariat,
    filterStatus,
    members,
    komisariatOptions,
    filteredMembers,
    getPaginationState, // Tambah pagination state dari store
} = storeToRefs(membersStore);

DataTable.use(DataTablesCore);

async function download(status) {
    try {
        isLoading.value = true;
        const params = status === 'aktif' ? { status_max: 'aktif' } : {};
        await FileDownloader.downloadMember(
            `anggota-${status}-${new Date().toISOString().slice(0, 10)}.xlsx`,
            params,
        );
    } catch (e) {
        console.log('error download excel ', e);
    } finally {
        isLoading.value = false;
    }
}

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

// Function untuk handle DataTable draw event
function onDataTableDraw(eDt, settings) {
    // console.log('DataTable redraw');

    // 1. Tangkap informasi halaman
    const displayStart = settings._iDisplayStart;
    const pageLength = settings._iDisplayLength;

    // console.log('Page info:', {
    //     displayStart,
    //     pageLength,
    //     currentPage: Math.floor(displayStart / pageLength) + 1,
    //     totalRecords: settings.fnRecordsTotal ? settings.fnRecordsTotal() : 0,
    // });

    // 2. Simpan ke store (sessionStorage via persist)
    membersStore.updatePagination(displayStart, pageLength);
}

// Computed untuk DataTable options dengan pagination state dari store
const optionsDT = computed(() => ({
    responsive: true,
    order: [],
    select: true,
    // 3. Gunakan pagination state dari store
    displayStart: getPaginationState.value.displayStart,
    pageLength: getPaginationState.value.pageLength,
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
        // search: 'Cari:',
        zeroRecords: 'Tidak data data untuk ditampilkan. Coba kata kunci yang lain!',
        info: 'Menampilkan _START_ hingga _END_ dari total _TOTAL_ data',
        infoFiltered: '(disaring dari _MAX_ total data)',
        paginate: { first: '↑', previous: '←', next: '→', last: '↓' },
        lengthMenu: '_MENU_ Perhalaman',
    },
    autoWidth: true,
    layout: {
        topStart: {
            pageLength: {
                menu: [10, 25, 50, 100, -1],
            },
        },
        topEnd: {
            search: {
                placeholder: 'Cari anggota...',
                text: 'Cari _INPUT_',
            },
        },
    },
    scrollX: true,
}));

// Watch untuk perubahan filter - validasi pagination
watch(
    [filterKomisariat, filterStatus],
    () => {
        // Tunggu sampai filteredMembers terupdate
        setTimeout(() => {
            const totalRecords = filteredMembers.value.length;
            const wasAdjusted = membersStore.validatePagination(totalRecords);

            if (wasAdjusted && table.value) {
                // Redraw DataTable dengan pagination yang sudah disesuaikan
                // console.log('Redrawing DataTable after pagination adjustment');
                table.value.dt.page(getPaginationState.value.currentPage - 1).draw(false);
            }
        }, 0);
    },
    { immediate: false },
);

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

// Helper functions (optional)
function _resetTablePagination() {
    membersStore.resetPagination();
}

function _goToPage(pageNumber) {
    membersStore.setPage(pageNumber, getPaginationState.value.pageLength);
}
</script>

<style lang="scss">
@import 'datatables.net-dt';
@import 'datatables.net-responsive-dt';

// Responsive adjustments for small screens
// sm or smaller
@media screen and (max-width: 767px) {
    .dt-search {
        label {
            display: none !important;
        }
        input {
            width: 100% !important;
            text-align: center;
        }
    }
}
</style>
