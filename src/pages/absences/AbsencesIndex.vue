<template>
    <q-card>
        <CardHeader :title="`Absensi Kegiatan`" @on-reload="loadData">
            <template #buttons>
                <QBtn
                    dense
                    label="Scan QR"
                    outline=""
                    icon="qr_code"
                    no-caps
                    class="q-px-md"
                    :to="`/${meta.scope}/activities/${activityId}/absences/qr`"
                />
            </template>
        </CardHeader>
        <QCardSection class="q-pa-sm" style="max-width: 1024px">
            <QCard bordered flat>
                <LoadingFixed v-if="loading" />
                <QCardSection class="q-px-md q-pt-sm q-pb-none text-center">
                    <ActivityHeader :activity="activity" :scope="meta.scope" />
                </QCardSection>
                <div
                    v-if="activity.locked"
                    class="q-mt-sm q-pa-md text-center text-negative bg-orange-3"
                >
                    Data terkunci
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
                                placeholder="nama atau kelompok desa"
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
                                        @click="() => (activity.locked ? null : setHadir(absence))"
                                        :true-value="1"
                                        :false-value="0"
                                        :disable="!!activity.locked"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </q-card-section>
                <QCard class="q-mt-sm q-pa-sm text-center bg-orange-14 text-orange-1" flat bordered>
                    Menampilkan {{ filteredData?.length }} anggota (aktif)
                </QCard>
            </QCard>
        </QCardSection>
    </q-card>

    <!-- <pre>{{ absences }}</pre> -->
</template>
<script setup>
import CardHeader from '@/components/cards/CardHeader.vue';
import LoadingFixed from '@/components/LoadingFixed.vue';
import ArrayCrud from '@/models/ArrayCrud';
import KomisariatAbsences from '@/models/KomisariatAbsences';
import WilayahAbsences from '@/models/WilayahAbsences';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import ActivityHeader from '@/pages/activities/ActivityHeader.vue';

const { params, meta } = useRoute();
const activityId = params.id;
const loading = ref(false);
const absences = ref([]);
const activity = ref({});
const filterSelect = ref('');
const filterInput = ref('');
let model = null;

onMounted(async () => {
    if (meta.scope == 'Komisariat') {
        model = KomisariatAbsences;
    }
    if (meta.scope == 'Wilayah') {
        model = WilayahAbsences;
    }

    if (activityId) {
        await loadData();
        if (optionsKomisariat.value.length === 1) {
            filterSelect.value = optionsKomisariat.value[0];
        }
    }
});

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
            item.nama?.toLowerCase().includes(filterInputValue) ||
            item.kelompok?.toLowerCase().includes(filterInputValue);

        return isKomisariatMatch && isInputMatch;
    });
});

async function loadData() {
    try {
        loading.value = true;
        const res = await model.getByActivity(activityId);
        absences.value = res.absences;
        activity.value = res.activity;
    } catch (e) {
        console.log('error get absences ', e);
    } finally {
        loading.value = false;
    }
}

async function setHadir(item) {
    try {
        await model.update(item.id, { hadir: item.hadir });
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
