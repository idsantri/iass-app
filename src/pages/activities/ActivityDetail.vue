<template lang="">
    <CardPage>
        <CardHeader
            :title="titlePage"
            @on-reload="loadData"
            :show-edit="true"
            @on-edit="dialog = true"
            :disable-edit="!activity.id"
        />

        <q-card-section class="q-pa-sm relative-position" style="max-width: 1024px">
            <LoadingAbsolute v-if="loading" />
            <QMarkupTable flat bordered>
                <tbody>
                    <tr>
                        <td>Waktu</td>
                        <td>
                            {{ formatDate(activity.tgl_m, 'cccc, dd MMMM yyyy') }} |
                            {{ bacaHijri(activity.tgl_h) }}, Pukul
                            {{
                                activity?.tgl_m &&
                                new Intl.DateTimeFormat('id-ID', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    timeZoneName: 'short', // Ini yang akan mengambil 'WIB'
                                    timeZone: 'Asia/Jakarta',
                                }).format(new Date(activity?.tgl_m))
                            }}
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
                                checked-icon="lock"
                                unchecked-icon="lock_open"
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
                        :to="{
                            path: `/activities/${id}/absence-summaries`,
                            query: { scope: query.scope },
                        }"
                        icon="sym_o_planner_review"
                        label="Absensi"
                        outline
                        no-caps
                        replace
                    />
                    <q-route-tab
                        :to="{
                            path: `/activities/${id}/notes`,
                            query: { scope: query.scope },
                        }"
                        icon="sym_o_comment"
                        label="Catatan"
                        outline
                        no-caps
                        replace
                    />
                </q-tabs>
                <RouterView :key="$route.path" :activityId="id" :scope="query.scope" />
            </q-card>
        </q-card-section>
        <QDialog v-model="dialog">
            <ActivityForm
                @success-update="onUpdate"
                @success-delete="onDelete"
                :dataInputs="{ ...activity }"
                :scope="query.scope"
            />
        </QDialog>
    </CardPage>
</template>
<script setup>
import ActivityForm from '@/components/forms/ActivityForm.vue';
import LoadingAbsolute from '@/components/LoadingAbsolute.vue';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { bacaHijri } from '@/utils/hijri';
import { formatDate } from '@/utils/date-operation';
import Activity from '@/models/Activity';
import { toProperCase } from '@/utils/string';
import { useRouter } from 'vue-router';

const { params, query } = useRoute();
const id = params.id;
const dialog = ref(false);
const activity = ref({});
const loading = ref(false);
const router = useRouter();
const titlePage = computed(() => `Detail Kegiatan ${toProperCase(activity.value?.lingkup ?? '')}`);

onMounted(async () => {
    if (id) await loadData();
});

async function loadData() {
    try {
        loading.value = true;
        const res = await Activity.getById(id);
        activity.value = res.activity;
    } catch (e) {
        console.log('error get activity id ', e);
    } finally {
        loading.value = false;
    }
}

async function lockActivity(act) {
    try {
        await Activity.update(act.id, { ...act, locked: act.locked });
    } catch (e) {
        // rollback
        activity.value.locked = act.locked ? 0 : 1;
        console.log('error lock activity ', e);
    }
}

const onUpdate = async (updatedActivity) => {
    dialog.value = false;
    activity.value = { ...activity.value, ...updatedActivity };
};

const onDelete = (_id) => {
    dialog.value = false;
    router.go(-1);
};
</script>
<style scoped>
td {
    white-space: normal;
    word-wrap: break-word;
    padding: 4px 8px;
}
</style>
