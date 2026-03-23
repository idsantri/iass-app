<template lang="">
    <CardPage>
        <CardHeader
            :title="titlePage"
            @on-reload="null"
            :show-reload="false"
            :show-add="true"
            @on-add="handleAdd"
            :disable-add="!modRekening"
        />

        <q-card-section
            class="q-pa-sm tw:grid tw:grid-cols-1 tw:gap-2 tw:w-full tw:sm:flex tw:sm:items-center tw:sm:justify-between bg-orange-1"
        >
            <InputSelectArray
                v-if="query?.komisariat"
                v-model="modKomisariat"
                url="komisariat"
                label="Pilih Komisariat"
                class="tw:w-full tw:sm:flex-1 tw:sm:max-w-md"
                :disable="query?.scope.toLowerCase() != 'komisariat'"
            />
            <q-select
                v-model="modRekening"
                :options="optRekening"
                label="Pilih Nama Rekening"
                dense
                outlined
                clearable
                behavior="menu"
                class="tw:w-full tw:sm:flex-1 tw:sm:max-w-md"
                :loading="lodRekening"
                option-value="slug"
                option-label="nama"
                emit-value
                map-options
            >
                <template v-slot:after>
                    <q-btn no-caps outline icon="sync" @click="loadAccounts" class="q-pa-sm" />
                    <q-btn
                        no-caps
                        outline
                        icon="settings"
                        :to="{
                            path: '/accounts',
                            query: {
                                scope: query.scope,
                            },
                        }"
                        class="q-pa-sm"
                    />
                </template>
            </q-select>
            <q-input
                class="tw:w-full tw:sm:flex-1 tw:sm:max-w-md"
                borderless
                dense
                debounce="300"
                v-model="modSearch"
                placeholder="Cari"
                outlined
                clearable
                label="Cari Arus Kas"
            >
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
            </q-input>
        </q-card-section>

        <q-card-section class="q-pa-sm">
            <q-table
                flat
                bordered
                :rows="cashFlows"
                :columns="columns"
                row-key="id"
                :loading="lodCashFlow"
                :rows-per-page-options="[10, 25, 50, 100, 0]"
                :filter="modSearch"
                no-data-label="Data tidak ditemukan"
                no-results-label="Data tidak ditemukan"
            >
                <template v-slot:body-cell-id="props">
                    <q-td :props="props">
                        <q-btn
                            icon="edit"
                            flat
                            dense
                            color="orange-10"
                            :model-value="props.value"
                            @click="handleEdit(props.row)"
                        />
                    </q-td>
                </template>
            </q-table>
        </q-card-section>
        <QDialog v-model="dialog">
            <CashFlowForm
                :dataInputs="cashFlow"
                :scope="query.scope"
                @success-create="loadCashFlows"
                @success-update="loadCashFlows"
                @success-delete="loadCashFlows"
            />
        </QDialog>
    </CardPage>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref, watch, computed } from 'vue';
import { toProperCase } from '@/utils/string';
import InputSelectArray from '@/components/forms/inputs/InputSelectArray.vue';
import Account from '@/models/Account';
import CashFlowForm from '@/components/forms/CashFlowForm.vue';
import CashFlow from '@/models/CashFlow';
import { formatDate } from '@/utils/date-operation';

const router = useRouter();
const { query } = useRoute();
const titlePage = 'Data Keuangan ' + toProperCase(query.scope);
const modSearch = ref('');

const modKomisariat = ref('');

const modRekening = ref('');
const optRekening = ref([]);
const lodRekening = ref(false);

const dialog = ref(false);
const cashFlows = ref([]);
const cashFlow = ref({});
const lodCashFlow = ref(false);

const account = computed(() => {
    return optRekening.value.find((a) => a.slug == modRekening.value);
});

async function loadAccounts() {
    try {
        lodRekening.value = true;
        const res = await Account.getAll({
            lingkup: query.scope,
            komisariat: modKomisariat.value ?? null,
        });

        if (res && res.accounts) {
            optRekening.value = res.accounts;
        }
    } catch (err) {
        console.error('🚀 ~ loadAccounts ~ err:', err);
    } finally {
        lodRekening.value = false;
    }
}

async function loadCashFlows() {
    // console.log(modRekening.value);
    dialog.value = false;
    // console.log('🚀 ~ loadCashFlows ~ rekeningSlug:', rekeningSlug);
    try {
        lodCashFlow.value = true;
        const res = await CashFlow.getAll({
            rekening: modRekening.value,
        });
        if (res && res.cash_flows) {
            cashFlows.value = res.cash_flows;
        }
    } catch (err) {
        console.error('🚀 ~ loadCashFlows ~ err:', err);
    } finally {
        lodCashFlow.value = false;
    }
}

const handleAdd = () => {
    cashFlow.value = {
        rekening: modRekening.value,
        rekening_nama: account.value.nama,
    };
    dialog.value = true;
};

const handleEdit = (obj) => {
    cashFlow.value = {
        ...obj,
        rekening: modRekening.value,
        rekening_nama: account.value.nama,
    };
    dialog.value = true;
};

onMounted(async () => {
    await loadAccounts();
    if (query?.rekening) {
        modRekening.value = query.rekening;
    }
});

watch(modRekening, async (newVal) => {
    router.replace({
        query: {
            ...router.currentRoute.value.query, // pertahankan query lama
            rekening: newVal, // tambahkan/ubah rekening
        },
    });

    if (newVal) {
        await loadCashFlows();
    } else {
        cashFlows.value = [];
    }
});

const columns = [
    {
        name: 'tgl_transaksi',
        align: 'left',
        label: 'Tanggal',
        field: 'tgl_transaksi',
        format: (val) => formatDate(val, 'dd-MM-yyyy'),
        sortable: true,
    },
    {
        name: 'keterangan',
        align: 'left',
        label: 'Keterangan',
        field: 'keterangan',
        sortable: true,
    },
    {
        name: 'masuk',
        align: 'right',
        label: 'Masuk',
        field: 'masuk',
        format: (val) =>
            new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }).format(val),
        sortable: true,
    },
    {
        name: 'keluar',
        align: 'right',
        label: 'Keluar',
        field: 'keluar',
        format: (val) =>
            new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }).format(val),
        sortable: true,
    },
    {
        name: 'saldo',
        align: 'right',
        label: 'Saldo',
        field: 'saldo',
        format: (val) =>
            new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }).format(val),
        sortable: true,
    },
    {
        name: 'atas_nama',
        align: 'left',
        label: 'Atas Nama',
        field: 'atas_nama',
        sortable: true,
    },
    {
        name: 'id',
        align: 'center',
        label: 'Edit',
        field: 'id',
    },
];
</script>
<style lang=""></style>
