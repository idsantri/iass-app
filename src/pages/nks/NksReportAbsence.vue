<template>
    <div class="q-card--bordered q-pa-sm q-mb-sm bg-orange-3 flex items-center">
        <q-btn
            icon="sync"
            no-caps
            @click="loadData"
            dense
            flat
            class="q-mr-xs"
            title="Muat ulang"
        />
        <div>Rekap Absen Perkomisariat</div>
        <QSpace />
        <QBtn
            :to="`/nks/${nksId}/absence`"
            label="Detail Absen"
            dense
            color="orange-10"
            no-caps
            glossy=""
            class="q-px-sm text-orange-1"
            icon="sym_o_co_present"
        />
    </div>
    <QMarkupTable flat bordered>
        <LoadingAbsolute v-if="loading" />
        <thead class="bg-orange-1">
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
                            String(((item.hadir / item.jumlah) * 100).toFixed(2)).padStart(5, '0')
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
                            @click="createReport"
                        />
                    </td>
                </tr>
            </template>
        </tbody>
        <tfoot class="bg-orange-2">
            <tr>
                <td>
                    <QBtn
                        label="Reset Data"
                        color="negative"
                        no-caps
                        @click="resetAbsence"
                        :disable="!report.length"
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

    <!-- <pre>{{ sumActive }}</pre> -->
</template>
<script setup>
import LoadingAbsolute from '@/components/LoadingAbsolute.vue';
import NksAbsence from '@/models/NksAbsence';
import { notifyConfirm } from '@/utils/notify';
import { computed, ref, watchEffect } from 'vue';

const props = defineProps({
    nksId: { required: true },
});
const loading = ref(false);
const report = ref([]);

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

async function loadData() {
    try {
        loading.value = true;
        const res = await NksAbsence.reportByNks(props.nksId);
        report.value = res.report;
    } catch (e) {
        console.log('error report absence nks id ', e);
    } finally {
        loading.value = false;
    }
}

async function createReport() {
    try {
        loading.value = true;
        const res = await NksAbsence.createByNks({ nks_id: props.nksId });
        report.value = res.report;
    } catch (e) {
        console.log('error report absence nks id ', e);
    } finally {
        loading.value = false;
    }
}

watchEffect(async () => {
    if (props.nksId) {
        await loadData();
    }
});

async function resetAbsence() {
    const isConfirmed = await notifyConfirm('Hapus data absensi untuk NKS ini?', true);
    if (!isConfirmed) return;

    try {
        loading.value = true;
        await NksAbsence.removeByNks(props.nksId);
        report.value = [];
    } catch (error) {
        console.log('error on reset absence ', error);
    } finally {
        loading.value = false;
    }
}
</script>
