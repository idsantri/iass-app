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
                label="Catatan Kegiatan"
            />
            <QSpace />
            <QBtn
                label="Tambah"
                color="orange-10"
                no-caps
                outline=""
                class="q-px-sm text-orange-1"
                icon="add"
                @click="goEdit"
            />
        </QCardActions>
        <LoadingAbsolute v-if="loading" />
        <div v-if="activity.locked" class="q-mt-sm q-pa-md text-center text-negative bg-orange-3">
            Data tidak dapat diubah karena NKS sudah dikunci.
        </div>
        <q-card-section class="q-pa-sm">
            <q-list class="column q-gutter-y-sm">
                <template v-if="notes.length > 0">
                    <q-expansion-item
                        v-for="note in notes"
                        :key="note.id"
                        :label="note.title"
                        default-opened
                        header-class="bg-orange-1 q-pa-sm"
                        class="q-card--bordered rounded-borders overflow-hidden"
                    >
                        <q-card>
                            <q-card-section class="text-justify q-pa-sm relative-position">
                                <span v-html="note.content"></span>
                            </q-card-section>
                            <q-card-actions class="bg-grey-2" align="right" v-if="!activity.locked">
                                <q-btn
                                    outline=""
                                    icon="edit"
                                    color="orange-10"
                                    label="Edit"
                                    dense
                                    no-caps
                                    @click="goEdit(note)"
                                />
                            </q-card-actions>
                        </q-card>
                    </q-expansion-item>
                </template>
                <template v-else>
                    <div class="text-center q-pa-md">
                        <q-icon name="info" size="3rem" class="q-mb-sm" />
                        <div>
                            Tidak ada catatan. <br />
                            Silahkan tambahkan catatan.
                        </div>
                    </div>
                </template>
            </q-list>
        </q-card-section>
    </QCard>
</template>
<script setup>
import LoadingAbsolute from '@/components/LoadingAbsolute.vue';
import KomisariatNotes from '@/models/KomisariatNotes';
import WilayahNotes from '@/models/WilayahNotes';
import { onMounted, ref, shallowRef } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    activityId: { required: true },
    scope: { type: String, required: true },
});

const loading = ref(false);
const notes = shallowRef([]);
const activity = shallowRef({});
let model = null;

onMounted(async () => {
    if (props.scope.toLocaleLowerCase() === 'komisariat') {
        model = KomisariatNotes;
    }
    if (props.scope.toLocaleLowerCase() === 'wilayah') {
        model = WilayahNotes;
    }

    if (props.activityId) {
        await loadData();
    }
});

async function loadData() {
    try {
        loading.value = true;
        const res = await model.getAll({ activity_id: props.activityId });
        notes.value = res.notes;
        activity.value = res.activity;
    } catch (e) {
        console.log('error get note ', e);
    } finally {
        loading.value = false;
    }
}

const router = useRouter();
function goEdit(note = {}) {
    router.push({
        path: `/${props.scope}/activities/${props.activityId}/notes/form`,
        state: {
            note: { activity_id: activity.value.id, ...note },
            activity: { ...activity.value },
            scope: props.scope,
        },
    });
}
</script>
<style scoped></style>
