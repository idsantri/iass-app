<template>
    <q-card flat bordered style="max-width: 1024px">
        <SectionHeader title="Absensi NKS" @on-reload="loadData">
            <template #left>
                <QBtn
                    dense
                    label="Scan QR"
                    outline=""
                    icon="qr_code"
                    no-caps
                    class="q-px-md q-mr-sm text-orange-1"
                    :to="`/nks/${nksId}/absence/qr`"
                />
            </template>
        </SectionHeader>

        <LoadingFixed v-if="loading" />

        <QCardSection class="q-px-md q-pt-sm q-pb-none text-center">
            NKS {{ nks.komisariat }} <br />
            <small>
                {{ formatDate(nks.tgl_m, 'cccc, dd MMMM yyyy') }} |
                {{ bacaHijri(nks.tgl_h) }}
            </small>
        </QCardSection>
        <div v-if="nks.locked" class="q-mt-sm q-pa-md text-center text-negative bg-orange-3">
            Data dikunci oleh Admin
        </div>
        <q-card-section class="q-px-sm q-pt-none q-pb-sm">
            <div class="flex justify-between">
                <div class="q-ma-sm full-width" style="max-width: 450px">
                    <QSelect
                        outlined
                        v-model="filterSelect"
                        :options="optionsKomisariat"
                        label="Filter Komisariat"
                        behavior="menu"
                        clearable=""
                        dense
                    />
                </div>
                <div class="q-ma-sm full-width" style="max-width: 450px">
                    <QInput
                        v-model="filterInput"
                        label="Cari data"
                        placeholder="nama, komisariat, kelompok desa …"
                        outlined
                        dense
                        class=""
                        clearable
                        type="search"
                    />
                </div>
            </div>

            <table class="full-width">
                <thead>
                    <tr class="bg-orange-1">
                        <th class="tw:p-2">Nama</th>
                        <th class="tw:p-2">Hadir</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="absence in filteredData"
                        :key="absence.id"
                        class="tw:border-b tw:border-orange-200/50"
                    >
                        <td class="tw:flex tw:items-center tw:gap-x-1 tw:p-2">
                            <QBtn
                                icon="info"
                                dense
                                class="q-mr-sm"
                                flat
                                round=""
                                color="orange-4"
                                :to="`/members/${absence.member_id}`"
                            />
                            <div>
                                <span class="tw:font-medium">
                                    {{ absence.nama }}
                                </span>
                                <br />
                                <small class="tw:font-light">
                                    {{ absence.komisariat }} | {{ absence.kelompok }}
                                </small>
                            </div>
                        </td>
                        <td class="tw:p-2">
                            <q-toggle
                                class="q-px-sm"
                                v-model="absence.hadir"
                                color="orange"
                                label="Hadir"
                                @click="() => (nks.locked ? null : setHadir(absence))"
                                :true-value="1"
                                :false-value="0"
                                :disable="!!nks.locked"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </q-card-section>
    </q-card>
    <QCard class="q-mt-sm q-pa-sm text-center bg-orange-14 text-orange-1" flat bordered>
        Menampilkan {{ filteredData?.length }} anggota (aktif)
    </QCard>

    <!-- <pre>{{ absences }}</pre> -->
</template>
<script setup>
import LoadingFixed from '@/components/LoadingFixed.vue';
import SectionHeader from '@/components/SectionHeader.vue';
import ArrayCrud from '@/models/ArrayCrud';
import NksAbsence from '@/models/NksAbsence';
import { formatDate } from '@/utils/date-operation';
import { bacaHijri } from '@/utils/hijri';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const { params } = useRoute();
const nksId = params.nksId;
const loading = ref(false);
const absences = ref([]);
const nks = ref({});
const filterSelect = ref('');
const filterInput = ref('');

const optionsKomisariat = computed(() => {
    const komSet = new Set();
    absences.value.forEach((item) => {
        if (item.komisariat) {
            komSet.add(item.komisariat);
        }
    });
    return Array.from(komSet).sort((a, b) => a.localeCompare(b));
});

const filteredData = computed(() => {
    const filterInputValue = filterInput.value?.toLowerCase();

    if (!filterSelect.value && !filterInputValue) {
        return absences.value;
    }

    return absences.value.filter((item) => {
        const isKomisariatMatch = !filterSelect.value || item.komisariat === filterSelect.value;

        const isInputMatch =
            !filterInputValue ||
            item.nama.toLowerCase().includes(filterInputValue) ||
            item.komisariat.toLowerCase().includes(filterInputValue) ||
            item.kelompok.toLowerCase().includes(filterInputValue);

        return isKomisariatMatch && isInputMatch;
    });
});

async function loadData() {
    try {
        loading.value = true;
        const res = await NksAbsence.byNks(nksId);
        absences.value = res.absences;
        nks.value = res.nks;
        // console.log(res);
    } catch (e) {
        console.log('error get absences ', e);
    } finally {
        loading.value = false;
    }
}

onMounted(async () => {
    if (nksId) {
        await loadData();
    }
});

async function setHadir(item) {
    try {
        await NksAbsence.update(item.id, { hadir: item.hadir });
    } catch (error) {
        absences.value = ArrayCrud.update(absences.value, item.id, { hadir: item.hadir ? 0 : 1 });
        console.log('error update absen by id ', error);
    }
}
</script>
<style scoped>
td,
td * {
    white-space: normal;
    word-wrap: break-word;
}
</style>
