<template lang="">
    <q-card>
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
                            {{ report.h11 ?? '-' }}
                        </td>
                        <td title="Absen" class="text-center bg-orange-1">
                            {{ report.a11 ?? '-' }}
                        </td>
                        <td title="Total" class="text-center bg-orange-1">
                            {{ report.t11 ?? '-' }}
                        </td>

                        <td title="Hadir" class="text-center bg-orange-2">
                            {{ report.h12 ?? '-' }}
                        </td>
                        <td title="Absen" class="text-center bg-orange-2">
                            {{ report.a12 ?? '-' }}
                        </td>
                        <td title="Total" class="text-center bg-orange-2">
                            {{ report.t12 ?? '-' }}
                        </td>

                        <td title="Hadir" class="text-center bg-orange-1">
                            {{ report.h01 ?? '-' }}
                        </td>
                        <td title="Absen" class="text-center bg-orange-1">
                            {{ report.a01 ?? '-' }}
                        </td>
                        <td title="Total" class="text-center bg-orange-1">
                            {{ report.t01 ?? '-' }}
                        </td>

                        <td title="Hadir" class="text-center bg-orange-2">
                            {{ report.h02 ?? '-' }}
                        </td>
                        <td title="Absen" class="text-center bg-orange-2">
                            {{ report.a02 ?? '-' }}
                        </td>
                        <td title="Total" class="text-center bg-orange-2">
                            {{ report.t02 ?? '-' }}
                        </td>

                        <td title="Hadir" class="text-center bg-orange-1">
                            {{ report.h03 ?? '-' }}
                        </td>
                        <td title="Absen" class="text-center bg-orange-1">
                            {{ report.a03 ?? '-' }}
                        </td>
                        <td title="Total" class="text-center bg-orange-1">
                            {{ report.t03 ?? '-' }}
                        </td>

                        <td title="Hadir" class="text-center bg-orange-2">
                            {{ report.h04 ?? '-' }}
                        </td>
                        <td title="Absen" class="text-center bg-orange-2">
                            {{ report.a04 ?? '-' }}
                        </td>
                        <td title="Total" class="text-center bg-orange-2">
                            {{ report.t04 ?? '-' }}
                        </td>

                        <td title="Hadir" class="text-center bg-orange-1">
                            {{ report.h05 ?? '-' }}
                        </td>
                        <td title="Absen" class="text-center bg-orange-1">
                            {{ report.a05 ?? '-' }}
                        </td>
                        <td title="Total" class="text-center bg-orange-1">
                            {{ report.t05 ?? '-' }}
                        </td>

                        <td title="Hadir" class="text-center bg-orange-2">
                            {{ report.h06 ?? '-' }}
                        </td>
                        <td title="Absen" class="text-center bg-orange-2">
                            {{ report.a06 ?? '-' }}
                        </td>
                        <td title="Total" class="text-center bg-orange-2">
                            {{ report.t06 ?? '-' }}
                        </td>

                        <td title="Hadir" class="text-center bg-orange-1">
                            {{ report.h07 ?? '-' }}
                        </td>
                        <td title="Absen" class="text-center bg-orange-1">
                            {{ report.a07 ?? '-' }}
                        </td>
                        <td title="Total" class="text-center bg-orange-1">
                            {{ report.t07 ?? '-' }}
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr class="text-subtitle2">
                        <th class="text-left bg-deep-orange-3">Total</th>
                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 'h11') }}
                        </td>
                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 'a11') }}
                        </td>
                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 't11') }}
                        </td>

                        <td class="text-center bg-deep-orange-2">
                            {{ hitungNilai(reports, 'h12') }}
                        </td>
                        <td class="text-center bg-deep-orange-2">
                            {{ hitungNilai(reports, 'a12') }}
                        </td>
                        <td class="text-center bg-deep-orange-2">
                            {{ hitungNilai(reports, 't12') }}
                        </td>

                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 'h01') }}
                        </td>
                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 'a01') }}
                        </td>
                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 't01') }}
                        </td>

                        <td class="text-center bg-deep-orange-2">
                            {{ hitungNilai(reports, 'h02') }}
                        </td>
                        <td class="text-center bg-deep-orange-2">
                            {{ hitungNilai(reports, 'a02') }}
                        </td>
                        <td class="text-center bg-deep-orange-2">
                            {{ hitungNilai(reports, 't02') }}
                        </td>

                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 'h03') }}
                        </td>
                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 'a03') }}
                        </td>
                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 't03') }}
                        </td>

                        <td class="text-center bg-deep-orange-2">
                            {{ hitungNilai(reports, 'h04') }}
                        </td>
                        <td class="text-center bg-deep-orange-2">
                            {{ hitungNilai(reports, 'a04') }}
                        </td>
                        <td class="text-center bg-deep-orange-2">
                            {{ hitungNilai(reports, 't04') }}
                        </td>

                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 'h05') }}
                        </td>
                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 'a05') }}
                        </td>
                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 't05') }}
                        </td>

                        <td class="text-center bg-deep-orange-2">
                            {{ hitungNilai(reports, 'h06') }}
                        </td>
                        <td class="text-center bg-deep-orange-2">
                            {{ hitungNilai(reports, 'a06') }}
                        </td>
                        <td class="text-center bg-deep-orange-2">
                            {{ hitungNilai(reports, 't06') }}
                        </td>

                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 'h07') }}
                        </td>
                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 'a07') }}
                        </td>
                        <td class="text-center bg-deep-orange-1">
                            {{ hitungNilai(reports, 't07') }}
                        </td>
                    </tr>
                </tfoot>
            </q-markup-table>
        </q-card-section>
    </q-card>
    <!-- <pre>{{ reports }}</pre> -->
</template>
<script setup>
import CardHeader from '@/components/cards/CardHeader.vue';
import LoadingFixed from '@/components/LoadingFixed.vue';
import AbsenceNks from '@/models/AbsenceNks';
import WilayahActivities from '@/models/WilayahActivities';
import { ref, onMounted, watch, shallowRef } from 'vue';

const reports = shallowRef([]);
const loading = ref(false);
const loadingNks = ref(false);
const optionsNks = ref([]);
const thAjaranH = ref('');

const loadActivityNks = async () => {
    try {
        loadingNks.value = true;
        const data = await WilayahActivities.getAll({ nama: 'Ngaji Kitab Sidogiri' });
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
        // console.log(optionsNks.value);
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
        const data = await AbsenceNks.byKomisariat({ th_ajaran_h });
        // console.log(data);
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
