<template lang="">
    <q-card>
        <CardHeader title="Rekap Absensi per Anggota" :show-reload="false"> </CardHeader>
        <LoadingFixed v-if="loading" />

        <q-card-section class="q-pa-sm bg-orange-1">
            <div class="row q-col-gutter-sm justify-between">
                <QSelect
                    outlined
                    :options="optionsNks"
                    label="Pilih Tahun Ajaran"
                    class="full-width"
                    behavior="menu"
                    clearable=""
                    style="max-width: 450px"
                    dense
                    :loading="loadingNks"
                    v-model="thAjaranH"
                    :disable="loadingNks"
                />
                <QSelect
                    outlined
                    :options="optionsKomisariat"
                    label="Pilih Komisariat"
                    class="full-width"
                    behavior="menu"
                    clearable=""
                    style="max-width: 450px"
                    dense
                    v-model="komisariat"
                />
                <QSelect
                    outlined
                    :options="optionsKelompok"
                    label="Pilih Kelompok"
                    class="full-width"
                    behavior="menu"
                    clearable=""
                    style="max-width: 450px"
                    dense
                    v-model="kelompok"
                />
            </div>
        </q-card-section>
        <q-card-section class="q-pa-sm">
            <QBanner class="bg-orange-2 q-mb-sm" v-if="reports.length > 0">
                <template v-slot:avatar>
                    <q-icon name="info" color="orange-10" size="md" />
                </template>
                Tabel ini menampilkan data absensi anggota setiap bulan dalam tahun ajaran berjalan.
                "B" => bulan hijriah.
            </QBanner>
            <q-markup-table flat bordered class="my-sticky-column-table">
                <thead>
                    <tr>
                        <th class="text-left bg-orange-2">Nama</th>
                        <th class="text-left">Komisariat</th>
                        <th class="text-left">Kelompok</th>
                        <th class="text-center">B-11</th>
                        <th class="text-center">B-12</th>
                        <th class="text-center">B-01</th>
                        <th class="text-center">B-02</th>
                        <th class="text-center">B-03</th>
                        <th class="text-center">B-04</th>
                        <th class="text-center">B-05</th>
                        <th class="text-center">B-05</th>
                        <th class="text-center">B-07</th>
                        <th class="text-center">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="report in filteredReports" :key="report.member_id">
                        <td class="text-left bg-orange-1">
                            <q-btn
                                icon="person"
                                round
                                outline
                                glossy
                                size="sm"
                                color="orange-10"
                                dense
                                class="q-mr-sm"
                                :to="`/members/${report.member_id}`"
                            />
                            {{ report.member_nama }}
                        </td>
                        <td class="text-left">
                            {{ report.member_komisariat }}
                        </td>
                        <td class="text-left">{{ report.member_kelompok }}</td>
                        <td class="text-center">
                            <q-icon
                                :name="report.b11 == '1' ? 'check_circle' : 'cancel'"
                                :color="report.b11 == '1' ? 'green' : 'red'"
                                size="xs"
                            />
                        </td>
                        <td class="text-center">
                            <q-icon
                                :name="report.b12 == '1' ? 'check_circle' : 'cancel'"
                                :color="report.b12 == '1' ? 'green' : 'red'"
                                size="xs"
                            />
                        </td>
                        <td class="text-center">
                            <q-icon
                                :name="report.b01 == '1' ? 'check_circle' : 'cancel'"
                                :color="report.b01 == '1' ? 'green' : 'red'"
                                size="xs"
                            />
                        </td>
                        <td class="text-center">
                            <q-icon
                                :name="report.b02 == '1' ? 'check_circle' : 'cancel'"
                                :color="report.b02 == '1' ? 'green' : 'red'"
                                size="xs"
                            />
                        </td>
                        <td class="text-center">
                            <q-icon
                                :name="report.b03 == '1' ? 'check_circle' : 'cancel'"
                                :color="report.b03 == '1' ? 'green' : 'red'"
                                size="xs"
                            />
                        </td>
                        <td class="text-center">
                            <q-icon
                                :name="report.b04 == '1' ? 'check_circle' : 'cancel'"
                                :color="report.b04 == '1' ? 'green' : 'red'"
                                size="xs"
                            />
                        </td>
                        <td class="text-center">
                            <q-icon
                                :name="report.b05 == '1' ? 'check_circle' : 'cancel'"
                                :color="report.b05 == '1' ? 'green' : 'red'"
                                size="xs"
                            />
                        </td>
                        <td class="text-center">
                            <q-icon
                                :name="report.b06 == '1' ? 'check_circle' : 'cancel'"
                                :color="report.b06 == '1' ? 'green' : 'red'"
                                size="xs"
                            />
                        </td>
                        <td class="text-center">
                            <q-icon
                                :name="report.b07 == '1' ? 'check_circle' : 'cancel'"
                                :color="report.b07 == '1' ? 'green' : 'red'"
                                size="xs"
                            />
                        </td>
                        <td class="text-center">{{ report.total }}</td>
                    </tr>
                </tbody>
            </q-markup-table>
        </q-card-section>

        <!-- <pre>
            {{ filteredReports }}
        </pre> -->
    </q-card>
</template>
<script setup>
import { ref, onMounted, watch, shallowRef, computed } from 'vue';
import LoadingFixed from '@/components/LoadingFixed.vue';
import AbsenceNks from '@/models/AbsenceNks';
import WilayahActivities from '@/models/WilayahActivities';
import CardHeader from '@/components/cards/CardHeader.vue';

const loading = ref(false);
const loadingNks = ref(false);
const optionsNks = ref([]);
const thAjaranH = ref('');
const reports = shallowRef([]);
const komisariat = ref('');
const kelompok = ref('');
const optionsKomisariat = ref([]);

watch(komisariat, () => {
    kelompok.value = '';
});
watch(thAjaranH, () => {
    komisariat.value = '';
    kelompok.value = '';
});
const optionsKelompok = computed(() => {
    const _set = new Set();
    if (komisariat.value) {
        reports.value
            .filter((r) => r.member_komisariat === komisariat.value)
            .forEach((r) => {
                if (r.member_kelompok) {
                    _set.add(r.member_kelompok);
                }
            });
    } else {
        reports.value.forEach((r) => {
            if (r.member_kelompok) {
                _set.add(r.member_kelompok);
            }
        });
    }
    return Array.from(_set).sort();
});

const filteredReports = computed(() => {
    return reports.value.filter((r) => {
        return (
            (komisariat.value ? r.member_komisariat === komisariat.value : true) &&
            (kelompok.value ? r.member_kelompok === kelompok.value : true)
        );
    });
});

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

const loadReport = async (th_ajaran_h) => {
    try {
        loading.value = true;
        const data = await AbsenceNks.byMember({ th_ajaran_h });
        // console.log(data);
        reports.value = data.reports;
        // set options komisariat
        const _set = new Set();
        data.reports.forEach((r) => {
            if (r.member_komisariat) {
                _set.add(r.member_komisariat);
            }
        });
        optionsKomisariat.value = Array.from(_set).sort();

        if (optionsKomisariat.value.length === 1) {
            komisariat.value = optionsKomisariat.value[0];
        }
    } catch (error) {
        console.log('error load reports', error);
    } finally {
        loading.value = false;
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
</script>
<style lang="sass" scoped>
.my-sticky-column-table
  /* specifying max-width so the example can
    highlight the sticky column on any browser window */

    //       max-width: 600px

  thead tr:first-child th:first-child
    /* bg color is important for th; just specify one */
    background-color: #b0b4ff
    max-width: 160px

  td:first-child
    background-color: #00b4ff
    max-width: 160px
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
  tbody tr td
    padding: 6px 8px
    height: 36px
  thead tr th
    padding: 6px 8px
</style>
