<template lang="">
    <CardPage>
        <CardHeader
            :title="titlePage"
            @on-reload="null"
            :show-reload="false"
            :show-add="true"
            @on-add="dialog = true"
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

        <q-card-section class="q-pa-sm" style="max-width: 1024px">
            model: {{ modRekening }}
            <pre>
optRekening {{ optRekening }}
            </pre>
        </q-card-section>
    </CardPage>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { toProperCase } from '@/utils/string';
import InputSelectArray from '@/components/forms/inputs/InputSelectArray.vue';
import Account from '@/models/Account';

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

async function loadCashFlows(rekeningSlug) {
    console.log('🚀 ~ loadCashFlows ~ rekeningSlug:', rekeningSlug);
}

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
        await loadCashFlows(newVal);
    } else {
        cashFlows.value = [];
    }
});
</script>
<style lang=""></style>
