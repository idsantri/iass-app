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
        <DropdownAbsence
            :nks-id="nksId"
            @on-loading="(v) => (loading = v)"
            @success-delete="report = []"
        />
    </div>
    <QMarkupTable flat bordered>
        <LoadingAbsolute v-if="loading" />
        <thead>
            <tr>
                <th class="text-left">Komisariat</th>
                <th>Aktif</th>
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
    </QMarkupTable>

    <!-- <pre>{{ report }}</pre> -->
</template>
<script setup>
import LoadingAbsolute from '@/components/LoadingAbsolute.vue';
import NksAbsence from '@/models/NksAbsence';
import { ref, watchEffect } from 'vue';
import DropdownAbsence from './DropdownAbsence.vue';

const props = defineProps({
    nksId: { required: true },
});
const loading = ref(false);
const report = ref([]);

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
</script>
