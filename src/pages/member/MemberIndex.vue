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
    getPaginationState,
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
    const displayStart = settings._iDisplayStart;
    const pageLength = settings._iDisplayLength;
    membersStore.updatePagination(displayStart, pageLength);

    // Attach event listener untuk link setelah draw
    attachLinkListeners();
}

// Function untuk attach event listener ke link
function attachLinkListeners() {
    const links = document.querySelectorAll('.btn-member-info');
    links.forEach((link) => {
        link.onclick = function (e) {
            e.preventDefault();
            const memberId = this.getAttribute('data-member-id');
            router.push(`/members/${memberId}`);
        };
    });
}

// Computed untuk DataTable options dengan kolom aksi
const optionsDT = computed(() => ({
    responsive: true,
    order: [],
    select: false, // Nonaktifkan select karena tidak digunakan lagi
    displayStart: getPaginationState.value.displayStart,
    pageLength: getPaginationState.value.pageLength,
    columns: [
        {
            title: `
                <button disabled title="Detail anggota" 
                    class="q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--rectangle q-btn--actionable q-focusable q-hoverable q-btn--dense" 
                    style="color: #f57c00; text-decoration: none;">
                    <span class="q-focus-helper"></span>
                    <span class="q-btn__content text-center col items-center q-anchor--skip justify-center row">
                        <i class="q-icon notranslate material-icons" aria-hidden="true" role="img">info</i>
                    </span>
                </button>`,
            data: null,
            orderable: false,
            searchable: false,
            // width: '60px',
            render: function (data, type, row) {
                return `
                    <a href="/members/${row.id}" data-member-id="${row.id}" title="Detail anggota"
                        class="btn-member-info q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--rectangle q-btn--actionable q-focusable q-hoverable q-btn--dense" 
                        style="color: #f57c00; text-decoration: none;">
                        <span class="q-focus-helper"></span>
                        <span class="q-btn__content text-center col items-center q-anchor--skip justify-center row">
                            <i class="q-icon notranslate material-icons" aria-hidden="true" role="img">info</i>
                        </span>
                    </a>`;
            },
        },
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
        setTimeout(() => {
            const totalRecords = filteredMembers.value.length;
            const wasAdjusted = membersStore.validatePagination(totalRecords);

            if (wasAdjusted && table.value) {
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

    // Attach link listeners setelah mount
    setTimeout(() => {
        attachLinkListeners();
    }, 100);
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

// Style untuk link info
.btn-member-info {
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex !important;
    text-align: center !important;

    &:hover {
        background-color: rgba(245, 124, 0, 0.1);
        transform: scale(1.1);
    }
}

// Responsive adjustments for small screens
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
