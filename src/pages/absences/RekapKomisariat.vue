<template lang="">
    <CardPage>
        <CardHeader title="Rekap Absensi per Komisariat" :show-reload="false"> </CardHeader>
        <LoadingFixed v-if="loading" />
        <q-card-section class="q-pa-sm bg-orange-1">
            <QSelect
                outlined
                :options="optionsNks"
                label="Pilih Tahun Ajaran"
                class=""
                behavior="menu"
                clearable=""
                style="max-width: 450px"
                dense
                :loading="loadingNks"
                v-model="thAjaranH"
                :disable="loadingNks"
            />
        </q-card-section>
        <q-card-section class="q-pa-sm">
            <QBanner class="bg-orange-2 q-mb-sm" v-if="reports.length > 0">
                <template v-slot:avatar>
                    <q-icon name="info" color="orange-10" size="md" />
                </template>
                <div>
                    Tabel rekap absensi ini menampilkan data absensi anggota per komisariat untuk
                    setiap bulan dalam tahun ajaran berjalan.
                </div>
                <div class="q-mt-sm">
                    "H" => jumlah kehadiran; "A" => jumlah ketidakhadiran (absen); "T" => total
                    anggota <span class="text-weight-bold">aktif</span> di komisariat tersebut.
                </div>
            </QBanner>
            <q-markup-table flat bordered class="my-sticky-column-table">
                <thead>
                    <tr class="text-subtitle2">
                        <th rowspan="2" class="text-left bg-deep-orange-3">Komisariat</th>
                        <th colspan="3" class="text-center bg-deep-orange-1">11 - Dz Qadah</th>
                        <th colspan="3" class="text-center bg-deep-orange-2">12 - Dz Hijjah</th>
                        <th colspan="3" class="text-center bg-deep-orange-1">01 - Muharram</th>
                        <th colspan="3" class="text-center bg-deep-orange-2">02 - Safar</th>
                        <th colspan="3" class="text-center bg-deep-orange-1">03 - R Awal</th>
                        <th colspan="3" class="text-center bg-deep-orange-2">04 - R Tsani</th>
                        <th colspan="3" class="text-center bg-deep-orange-1">05 - J Ula</th>
                        <th colspan="3" class="text-center bg-deep-orange-2">06 - J Tsaniyah</th>
                        <th colspan="3" class="text-center bg-deep-orange-1">07 - Rajab</th>
                    </tr>
                    <tr class="text-subtitle2">
                        <template v-for="n in 9" :key="n">
                            <th
                                :class="`text-center ${n % 2 == 0 ? 'bg-deep-orange-2' : 'bg-deep-orange-1'}`"
                                title="Hadir"
                                style="z-index: 0"
                            >
                                H
                            </th>
                            <th
                                :class="`text-center ${n % 2 == 0 ? 'bg-deep-orange-2' : 'bg-deep-orange-1'}`"
                                title="Absen"
                            >
                                A
                            </th>
                            <th
                                :class="`text-center ${n % 2 == 0 ? 'bg-deep-orange-2' : 'bg-deep-orange-1'}`"
                                title="Total"
                            >
                                T
                            </th>
                        </template>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="report in reports" :key="report.komisariat">
                        <td class="text-left bg-orange-3">{{ report.komisariat }}</td>

                        <td title="Hadir" class="text-center bg-orange-1">
                            {{ report.h_11 ?? '-' }}
                        </td>
                        <td title="Absen" class="text-center bg-orange-1">
                            {{ report.a_11 ?? '-' }}
                        </td>
                        <td title="Total" class="text-center bg-orange-1">
                            {{ report.t_11 ?? '-' }}
                        </td>

                        <td title="Hadir" class="text-center bg-orange-2">
                            {{ report.h_12 ?? '-' }}
                        </td>
                        <td title="Absen" class="text-center bg-orange-2">
                            {{ report.a_12 ?? '-' }}
                        </td>
                        <td title="Total" class="text-center bg-orange-2">
                            {{ report.t_12 ?? '-' }}
                        </td>

                        <td title="Hadir" class="text-center bg-orange-1">
                            {{ report.h_01 ?? '-' }}
                        </td>
                        <td title="Absen" class="text-center bg-orange-1">
                            {{ report.a_01 ?? '-' }}
                        </td>
                        <td title="Total" class="text-center bg-orange-1">
                            {{ report.t_01 ?? '-' }}
                        </td>

                        <td title="Hadir" class="text-center bg-orange-2">
                            {{ report.h_02 ?? '-' }}
                        </td>
                        <td title="Absen" class="text-center bg-orange-2">
                            {{ report.a_02 ?? '-' }}
                        </td>
                        <td title="Total" class="text-center bg-orange-2">
                            {{ report.t_02 ?? '-' }}
                        </td>

                        <td title="Hadir" class="text-center bg-orange-1">
                            {{ report.h_03 ?? '-' }}
                        </td>
                        <td title="Absen" class="text-center bg-orange-1">
                            {{ report.a_03 ?? '-' }}
                        </td>
                        <td title="Total" class="text-center bg-orange-1">
                            {{ report.t_03 ?? '-' }}
                        </td>

                        <td title="Hadir" class="text-center bg-orange-2">
                            {{ report.h_04 ?? '-' }}
                        </td>
                        <td title="Absen" class="text-center bg-orange-2">
                            {{ report.a_04 ?? '-' }}
                        </td>
                        <td title="Total" class="text-center bg-orange-2">
                            {{ report.t_04 ?? '-' }}
                        </td>

                        <td title="Hadir" class="text-center bg-orange-1">
                            {{ report.h_05 ?? '-' }}
                        </td>
                        <td title="Absen" class="text-center bg-orange-1">
                            {{ report.a_05 ?? '-' }}
                        </td>
                        <td title="Total" class="text-center bg-orange-1">
                            {{ report.t_05 ?? '-' }}
                        </td>

                        <td title="Hadir" class="text-center bg-orange-2">
                            {{ report.h_06 ?? '-' }}
                        </td>
                        <td title="Absen" class="text-center bg-orange-2">
                            {{ report.a_06 ?? '-' }}
                        </td>
                        <td title="Total" class="text-center bg-orange-2">
                            {{ report.t_06 ?? '-' }}
                        </td>

                        <td title="Hadir" class="text-center bg-orange-1">
                            {{ report.h_07 ?? '-' }}
                        </td>
                        <td title="Absen" class="text-center bg-orange-1">
                            {{ report.a_07 ?? '-' }}
                        </td>
                        <td title="Total" class="text-center bg-orange-1">
                            {{ report.t_07 ?? '-' }}
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr class="text-subtitle2">
                        <th class="text-left bg-deep-orange-3">Total</th>
                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 'h_11') }}
                        </td>
                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 'a_11') }}
                        </td>
                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 't_11') }}
                        </td>

                        <td class="text-center bg-deep-orange-2">
                            {{ hitungNilai(reports, 'h_12') }}
                        </td>
                        <td class="text-center bg-deep-orange-2">
                            {{ hitungNilai(reports, 'a_12') }}
                        </td>
                        <td class="text-center bg-deep-orange-2">
                            {{ hitungNilai(reports, 't_12') }}
                        </td>

                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 'h_01') }}
                        </td>
                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 'a_01') }}
                        </td>
                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 't_01') }}
                        </td>

                        <td class="text-center bg-deep-orange-2">
                            {{ hitungNilai(reports, 'h_02') }}
                        </td>
                        <td class="text-center bg-deep-orange-2">
                            {{ hitungNilai(reports, 'a_02') }}
                        </td>
                        <td class="text-center bg-deep-orange-2">
                            {{ hitungNilai(reports, 't_02') }}
                        </td>

                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 'h_03') }}
                        </td>
                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 'a_03') }}
                        </td>
                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 't_03') }}
                        </td>

                        <td class="text-center bg-deep-orange-2">
                            {{ hitungNilai(reports, 'h_04') }}
                        </td>
                        <td class="text-center bg-deep-orange-2">
                            {{ hitungNilai(reports, 'a_04') }}
                        </td>
                        <td class="text-center bg-deep-orange-2">
                            {{ hitungNilai(reports, 't_04') }}
                        </td>

                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 'h_05') }}
                        </td>
                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 'a_05') }}
                        </td>
                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 't_05') }}
                        </td>

                        <td class="text-center bg-deep-orange-2">
                            {{ hitungNilai(reports, 'h_06') }}
                        </td>
                        <td class="text-center bg-deep-orange-2">
                            {{ hitungNilai(reports, 'a_06') }}
                        </td>
                        <td class="text-center bg-deep-orange-2">
                            {{ hitungNilai(reports, 't_06') }}
                        </td>

                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 'h_07') }}
                        </td>
                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 'a_07') }}
                        </td>
                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 't_07') }}
                        </td>
                    </tr>
                </tfoot>
            </q-markup-table>
        </q-card-section>
    </CardPage>
    <!-- <pre>{{ reports }}</pre> -->
</template>
<script setup>
import LoadingFixed from '@/components/LoadingFixed.vue';
import Activity from '@/models/Activity';
import ReportAbsence from '@/models/ReportAbsence';
import { ref, onMounted, watch, shallowRef } from 'vue';

const reports = shallowRef([]);
const loading = ref(false);
const loadingNks = ref(false);
const optionsNks = ref([]);
const thAjaranH = ref('');

const loadActivityNks = async () => {
    try {
        loadingNks.value = true;
        const data = await Activity.Wilayah.getAll({ nama: 'Ngaji Kitab Sidogiri' });
        // console.log('🚀 ~ loadActivity ~ data:', data.activities);
        if (data.activities?.length > 0) {
            const _set = new Set();
            // console.log('🚀 ~ loadActivity ~ _set:', _set);
            data.activities.forEach((n) => {
                if (n.th_ajaran_h) {
                    _set.add(n.th_ajaran_h);
                }
            });
            optionsNks.value = Array.from(_set).sort();
        }
    } catch (error) {
        console.log('error load nks', error);
    } finally {
        loadingNks.value = false;
    }
};

onMounted(async () => {
    await loadActivityNks();
});

watch(thAjaranH, async (newVal) => {
    if (newVal) {
        reports.value = [];
        await loadReport(newVal);
    } else {
        reports.value = [];
    }
});

const loadReport = async (th_ajaran_h) => {
    try {
        loading.value = true;
        const data = await ReportAbsence.NksByKomisariat(th_ajaran_h);
        reports.value = data.reports;
    } catch (error) {
        console.log('error load reports', error);
    } finally {
        loading.value = false;
    }
};

function hitungNilai(data, keyToCalculate) {
    // Inisialisasi variabel untuk menyimpan hasil perhitungan
    let total = 0;

    // Iterasi melalui setiap objek dalam array data
    data.forEach((item) => {
        // Periksa apakah properti yang ingin dihitung ada dalam objek
        if (Object.prototype.hasOwnProperty.call(item, keyToCalculate)) {
            // Jika nilai properti tidak null, konversi ke number dan tambahkan ke total
            if (item[keyToCalculate] !== null) {
                const nilai = parseInt(item[keyToCalculate], 10);
                if (!isNaN(nilai)) {
                    total += nilai;
                }
            }
        }
    });

    return total;
}
</script>
<style lang="sass" scoped>
.my-sticky-column-table
  /* specifying max-width so the example can
    highlight the sticky column on any browser window */

    //       max-width: 600px

  thead tr:first-child th:first-child
    /* bg color is important for th; just specify one */
    background-color: #b0b4ff

  td:first-child
    background-color: #00b4ff

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>
