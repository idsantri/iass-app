<template lang="">
    <q-card flat bordered>
        <SectionHeader title="Rekap Absensi per Komisariat" :show-reload="false"> </SectionHeader>
        <LoadingFixed v-if="loading" />

        <q-card-section class="q-pa-sm">
            <q-markup-table flat bordered class="my-sticky-column-table">
                <thead>
                    <tr class="bg-orange-1 text-subtitle2">
                        <th class="text-left">Komisariat</th>
                        <th class="text-center">B-11</th>
                        <th class="text-center">B-12</th>
                        <th class="text-center">B-01</th>
                        <th class="text-center">B-02</th>
                        <th class="text-center">B-03</th>
                        <th class="text-center">B-04</th>
                        <th class="text-center">B-05</th>
                        <th class="text-center">B-06</th>
                        <th class="text-center">B-07</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="report in filtered" :key="report.komisariat">
                        <td class="text-left">{{ report.komisariat }}</td>
                        <td class="text-center">{{ report.b11 ?? '-' }}</td>
                        <td class="text-center">{{ report.b12 ?? '-' }}</td>
                        <td class="text-center">{{ report.b01 ?? '-' }}</td>
                        <td class="text-center">{{ report.b02 ?? '-' }}</td>
                        <td class="text-center">{{ report.b03 ?? '-' }}</td>
                        <td class="text-center">{{ report.b04 ?? '-' }}</td>
                        <td class="text-center">{{ report.b05 ?? '-' }}</td>
                        <td class="text-center">{{ report.b06 ?? '-' }}</td>
                        <td class="text-center">{{ report.b07 ?? '-' }}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr class="bg-orange-2 text-subtitle2">
                        <th class="text-left">Total</th>
                        <th class="text-center">{{ hitungNilai(filtered, 'b11') }}</th>
                        <th class="text-center">{{ hitungNilai(filtered, 'b12') }}</th>
                        <th class="text-center">{{ hitungNilai(filtered, 'b01') }}</th>
                        <th class="text-center">{{ hitungNilai(filtered, 'b02') }}</th>
                        <th class="text-center">{{ hitungNilai(filtered, 'b03') }}</th>
                        <th class="text-center">{{ hitungNilai(filtered, 'b04') }}</th>
                        <th class="text-center">{{ hitungNilai(filtered, 'b05') }}</th>
                        <th class="text-center">{{ hitungNilai(filtered, 'b06') }}</th>
                        <th class="text-center">{{ hitungNilai(filtered, 'b07') }}</th>
                    </tr>
                </tfoot>
            </q-markup-table>
        </q-card-section>
    </q-card>
    <!-- <pre>{{ reports }}</pre> -->
</template>
<script setup>
import LoadingFixed from '@/components/LoadingFixed.vue';
import SectionHeader from '@/components/SectionHeader.vue';
import ReportAbsence from '@/models/ReportAbsence';
import { ref, onMounted, computed } from 'vue';
const reports = ref([]);
const loading = ref(false);

const filtered = computed(() => {
    return reports.value.filter((r) => r.hadir == 1);
});

const loadData = async (th_ajaran_h) => {
    try {
        loading.value = true;
        const data = await ReportAbsence.byKomisariat({ th_ajaran_h });
        reports.value = data.reports;
    } catch (error) {
        console.log('error load reports', error);
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    await loadData('1446-1447');
});

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
