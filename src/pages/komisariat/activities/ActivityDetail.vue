<template lang="">
    <div>
        <q-card flat bordered style="max-width: 1024px">
            <CardHeader :title="`Detail Kegiatan Komisariat ${komisariat}`" @on-reload="loadData">
                <template #buttons>
                    <QBtn
                        dense
                        label="Edit"
                        outline=""
                        icon="edit"
                        no-caps
                        class="q-px-md"
                        @click="dialog = true"
                        :disable="!komisariat"
                    />
                </template>
            </CardHeader>
            <q-card-section class="q-pa-sm relative-position">
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
                                    v-if="data?.activity"
                                    v-model="data.activity.locked"
                                    color="orange"
                                    :label="data.activity.locked ? 'Locked' : 'Unlocked'"
                                    :true-value="1"
                                    :false-value="0"
                                />
                            </td>
                        </tr>
                    </tbody>
                </QMarkupTable>
            </q-card-section>
            <q-card-section class="q-pa-sm">
                <ActivityDetailAbsence :activityId="id" />
            </q-card-section>
        </q-card>
        <QDialog v-model="dialog">
            <KomisariatActivityForm
                @success-update="loadData"
                @success-delete="() => $router.go(-1)"
                :dataInputs="{ ...activity }"
            />
        </QDialog>
    </div>
</template>
<script setup>
import CardHeader from '@/components/cards/CardHeader.vue';
import KomisariatActivityForm from '@/components/forms/KomisariatActivityForm.vue';
import LoadingAbsolute from '@/components/LoadingAbsolute.vue';
import KomisariatActivities from '@/services/KomisariatActivities';
import authStore from '@/stores/authStore';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { bacaHijri } from '@/utils/hijri';
import { formatDate } from '@/utils/date-operation';
import ActivityDetailAbsence from './ActivityDetailAbsence.vue';

const { params } = useRoute();
const id = params.id;
const komisariat = authStore().user.komisariat;
const dialog = ref(false);

const { data, loading, execute: loadData } = KomisariatActivities.useGetById(id);
// const activity = computed(() => data.value?.activity || [])
const activity = ref({ ...data.value?.activity });

async function lockActivity(act) {
    try {
        await KomisariatActivities.asyncUpdate(act.id, { locked: act.locked });
    } catch (e) {
        activity.value.locked = act.locked ? 0 : 1;
        console.log('error lock nks ', e);
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
