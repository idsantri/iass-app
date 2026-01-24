<template>
    <CardPage>
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
                                <th class="tw:p-2 text-center">!</th>
                                <th class="tw:p-2 text-left">Nama</th>
                                <th class="tw:p-2 text-left">Hadir</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="absence in filteredData"
                                :key="absence.id"
                                class="tw:border-b tw:border-orange-200/50"
                            >
                                <td class="text-center tw:p-2">
                                    <QBtn
                                        icon="info"
                                        dense
                                        class="q-mr-sm"
                                        flat
                                        round=""
                                        color="orange-4"
                                        :to="`/members/${absence.member_id}`"
                                    />
                                </td>
                                <td class="tw:p-2">
                                    <span class="tw:font-medium">
                                        {{ absence.nama }}
                                    </span>
                                    <br />
                                    <small class="tw:font-light">
                                        {{ absence.komisariat }} | {{ absence.kelompok }}
                                    </small>
                                </td>
                                <td class="tw:p-2">
                                    <template v-if="!readonly">
                                        <q-toggle
                                            class=""
                                            v-model="absence.hadir"
                                            color="orange"
                                            label="Hadir"
                                            @click="
                                                () =>
                                                    activity.locked ? null : updateHadir(absence)
                                            "
                                            :true-value="true"
                                            :false-value="false"
                                            :disable="!!activity.locked"
                                        />
                                    </template>
                                    <template v-else>
                                        <span
                                            :class="
                                                cekKehadiran(activity.tgl_m, absence.hadir_at) ==
                                                'Disiplin'
                                                    ? 'text-black'
                                                    : 'text-red-12'
                                            "
                                        >
                                            {{ cekKehadiran(activity.tgl_m, absence.hadir_at) }}
                                        </span>
                                    </template>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </q-card-section>
                <QCard class="q-mt-sm q-pa-sm text-center bg-orange-14 text-orange-1" flat bordered>
                    Menampilkan {{ filteredData?.length }} anggota
                </QCard>
            </QCard>
        </QCardSection>
    </CardPage>

    <!-- <pre>{{ absences }}</pre> -->
</template>
<script setup>
import LoadingFixed from '@/components/LoadingFixed.vue';
import ArrayCrud from '@/models/ArrayCrud';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import ActivityHeader from '@/pages/activities/ActivityHeader.vue';
import Absence from '@/models/Absence';

const { params, meta } = useRoute();
const activityId = params.id;
const loading = ref(false);
const absences = ref([]);
const activity = ref({});
const filterSelect = ref('');
const filterInput = ref('');

const Model = () => {
    switch (meta.scope) {
        case 'Komisariat':
            return Absence.Komisariat;
        case 'Wilayah':
            return Absence.Wilayah;
        case 'Bansus':
            return Absence.Bansus;
        default:
            throw new Error(`Scope '${meta.scope}' is not recognized`);
    }
};

function cekKehadiran(date1, date2) {
    if (!date2) return 'Absen';

    const waktuTetap = new Date(date1);
    const waktuHadir = new Date(date2);

    if (waktuHadir <= waktuTetap) {
        return 'Disiplin';
    }

    const selisihMs = waktuHadir - waktuTetap;
    const totalMenit = Math.floor(selisihMs / (1000 * 60));

    // Menghitung jam dan sisa menit
    const jam = Math.floor(totalMenit / 60);
    const menit = totalMenit % 60;

    // Format output agar lebih enak dibaca
    if (jam > 0) {
        return `T+ ${jam} jam ${menit} menit`;
    } else {
        return `T+ ${menit} menit`;
    }
}

let readonly = false;
onMounted(async () => {
    if (activityId) {
        await loadData();
        if (optionsKomisariat.value.length === 1) {
            filterSelect.value = optionsKomisariat.value[0];
        }
    }
    if (meta.scope === 'Bansus') {
        readonly = true;
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
        const res = await Model().getByActivity(activityId);
        absences.value = res.absences;
        activity.value = res.activity;
    } catch (e) {
        console.log('error get absences ', e);
    } finally {
        loading.value = false;
    }
}

async function updateHadir(item) {
    try {
        const data = await Model().update(item.id, { hadir: item.hadir });
        absences.value = ArrayCrud.update(absences.value, item.id, data.absence);
    } catch (error) {
        absences.value = ArrayCrud.update(absences.value, item.id, {
            hadir: item.hadir ? false : true,
        });
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
