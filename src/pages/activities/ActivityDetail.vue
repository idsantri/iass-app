<template lang="">
    <CardPage>
        <CardHeader
            :title="titlePage"
            @on-reload="loadData"
            :show-edit="true"
            @on-edit="dialog = true"
        />

        <q-card-section class="q-pa-sm relative-position" style="max-width: 1024px">
            <LoadingAbsolute v-if="loading" />
            <QMarkupTable flat bordered>
                <tbody>
                    <tr>
                        <td>Tanggal</td>
                        <td>
                            {{ formatDate(activity.tgl_m, 'cccc, dd MMMM yyyy') }} |
                            {{ bacaHijri(activity.tgl_h) }}
                        </td>
                    </tr>

                    <tr>
                        <td>Tahun Ajaran</td>
                        <td>{{ activity.th_ajaran_h }}</td>
                    </tr>
                    <tr>
                        <td>Nama Kegiatan</td>
                        <td>{{ activity.nama }}</td>
                    </tr>
                    <tr>
                        <td>Komisariat</td>
                        <td>{{ activity.komisariat }}</td>
                    </tr>
                    <tr>
                        <td>Lokasi</td>
                        <td>
                            {{ activity.lokasi }}
                        </td>
                    </tr>
                    <tr>
                        <td>Lock data</td>
                        <td class="no-padding">
                            <q-toggle
                                v-model="activity.locked"
                                color="orange"
                                :label="activity.locked ? 'Locked' : 'Unlocked'"
                                @click="lockActivity(activity)"
                                :true-value="1"
                                :false-value="0"
                            />
                        </td>
                    </tr>
                </tbody>
            </QMarkupTable>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-sm" style="max-width: 1024px">
            <q-card class="" flat bordered>
                <q-tabs class="bg-orange-1 text-orange-10" align="left" inline-label>
                    <q-route-tab
                        :to="`/${meta.scope}/activities/${id}/absence-summaries`"
                        icon="sym_o_planner_review"
                        label="Absensi"
                        outline
                        no-caps
                        replace
                    />
                    <q-route-tab
                        :to="`/${meta.scope}/activities/${id}/notes`"
                        icon="sym_o_comment"
                        label="Catatan"
                        outline
                        no-caps
                        replace
                    />
                </q-tabs>
                <RouterView :key="$route.path" :activityId="id" :scope="meta.scope" />
            </q-card>
        </q-card-section>
        <QDialog v-model="dialog">
            <ActivityForm
                @success-update="loadData"
                @success-delete="() => $router.go(-1)"
                :dataInputs="{ ...activity }"
                :scope="meta.scope"
            />
        </QDialog>
    </CardPage>
</template>
<script setup>
import ActivityForm from '@/components/forms/ActivityForm.vue';
import LoadingAbsolute from '@/components/LoadingAbsolute.vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { bacaHijri } from '@/utils/hijri';
import { formatDate } from '@/utils/date-operation';
import Activity from '@/models/Activity';

const { params, meta } = useRoute();
const id = params.id;
const dialog = ref(false);
const activity = ref({});
const loading = ref(false);
let model = null;

const titlePage = 'Detail Kegiatan ' + meta.scope;

onMounted(async () => {
    if (meta.scope == 'Komisariat') {
        model = Activity.Komisariat;
    }
    if (meta.scope == 'Wilayah') {
        model = Activity.Wilayah;
    }
    if (meta.scope == 'Bansus') {
        model = Activity.Bansus;
    }
    if (id) await loadData();
});

async function loadData() {
    try {
        loading.value = true;
        const res = await model.getById(id);
        activity.value = res.activity;
    } catch (e) {
        console.log('error get activity id ', e);
    } finally {
        loading.value = false;
    }
}

async function lockActivity(act) {
    try {
        await model.update(act.id, { locked: act.locked });
    } catch (e) {
        activity.value.locked = act.locked ? 0 : 1;
        console.log('error lock activity ', e);
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
