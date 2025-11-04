<template>
    <QCard class="" bordered flat>
        <QCardActions class="">
            <q-btn
                icon="sync"
                no-caps
                @click="loadData"
                dense
                flat
                class="q-mr-xs"
                title="Muat ulang"
                label="Rekap Absensi"
            />
            <QSpace />
            <QBtn
                :to="`/${meta.scope}/activities/${activityId}/absences`"
                label="Detail Absen"
                color="orange-10"
                no-caps
                outline=""
                class="q-px-sm text-orange-1"
                icon="sym_o_list"
            />
        </QCardActions>
        <QMarkupTable class="">
            <LoadingAbsolute v-if="loading" />
            <thead class="bg-brown-1">
                <tr>
                    <th class="text-left">Komisariat</th>
                    <th>Total (Aktif)</th>
                    <th>Hadir</th>
                    <th>%</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="report?.length > 0">
                    <tr v-for="item in report" :key="item.komisariat">
                        <td>{{ item.komisariat }}</td>
                        <td class="text-center">{{ item.jumlah }}</td>
                        <td class="text-center">{{ item.hadir }}</td>
                        <td class="text-center">
                            {{
                                String(((item.hadir / item.jumlah) * 100).toFixed(2)).padStart(
                                    5,
                                    '0',
                                )
                            }}%
                        </td>
                    </tr>
                </template>
                <template v-else>
                    <tr>
                        <td colspan="4" class="text-center q-pa-lg">
                            <div class="q-my-md">Belum ada data untuk ditampilkan</div>
                            <QBtn
                                icon="assignment_add"
                                label="Buat Absen"
                                class="q-my-md"
                                outline
                                no-caps
                                glossy
                                @click="createAbsence"
                            />
                        </td>
                    </tr>
                </template>
            </tbody>
            <tfoot class="bg-orange-2">
                <tr>
                    <td>
                        <QBtn
                            label="Reset"
                            color="negative"
                            no-caps
                            @click="resetAbsence"
                            :disable="!report.length"
                            dense
                            class="q-px-sm"
                        />
                    </td>
                    <td class="text-center">{{ sumActive }}</td>
                    <td class="text-center">{{ sumHadir }}</td>
                    <td class="text-center">
                        {{ String(((sumHadir / sumActive) * 100).toFixed(2)).padStart(5, '0') }}%
                    </td>
                </tr>
            </tfoot>
        </QMarkupTable>
    </QCard>
    <!-- <pre>{{ report }}</pre> -->
</template>
<script setup>
import LoadingAbsolute from '@/components/LoadingAbsolute.vue';
import KomisariatAbsences from '@/models/KomisariatAbsences';
import WilayahAbsences from '@/models/WilayahAbsences';
import { notifyConfirm } from '@/utils/notify';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
    activityId: { required: true },
});

const loading = ref(false);
const report = ref([]);
const { meta } = useRoute();
let model = null;

onMounted(async () => {
    if (meta.scope == 'Komisariat') {
        model = KomisariatAbsences;
    }
    if (meta.scope == 'Wilayah') {
        model = WilayahAbsences;
    }

    if (props.activityId) {
        await loadData();
    }
});

const sumActive = computed(() => {
    return report.value.reduce((accumulator, r) => {
        return accumulator + parseInt(r.jumlah);
    }, 0);
});
const sumHadir = computed(() => {
    return report.value.reduce((accumulator, r) => {
        return accumulator + parseInt(r.hadir);
    }, 0);
});

// load absence (summary/report)
async function loadData() {
    try {
        loading.value = true;
        const res = await model.getSummaryByActivity(props.activityId);
        report.value = res.absence_summaries;
    } catch (e) {
        console.log('error report absence', e);
    } finally {
        loading.value = false;
    }
}

async function createAbsence() {
    try {
        loading.value = true;
        const res = await model.createByActivity(props.activityId);
        report.value = res.absence_summaries;
    } catch (e) {
        console.log('error report absence', e);
    } finally {
        loading.value = false;
    }
}

async function resetAbsence() {
    const isConfirmed = await notifyConfirm('Hapus data absensi untuk NKS ini?', true);
    if (!isConfirmed) return;

    try {
        loading.value = true;
        await model.removeByActivity(props.activityId);
        report.value = [];
    } catch (error) {
        console.log('error on reset absence ', error);
    } finally {
        loading.value = false;
    }
}
</script>
<style scoped>
td {
    white-space: normal;
    word-wrap: break-word;
    padding: 4px 8px;
}
</style>
