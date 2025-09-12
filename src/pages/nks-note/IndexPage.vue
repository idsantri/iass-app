<template>
    <q-card flat bordered style="max-width: 1024px">
        <SectionHeader title="Catatan NKS" @on-reload="loadData">
            <template #left>
                <QBtn
                    dense
                    label="Tambah"
                    outline=""
                    icon="add"
                    no-caps
                    class="q-px-md q-mr-sm text-orange-1"
                    :to="{ path: `/nks/${nksId}/notes/form`, state: { note: { nks_id: nksId } } }"
                />
            </template>
        </SectionHeader>

        <LoadingFixed v-if="loading" />

        <QCardSection class="q-px-md q-pt-sm q-pb-none text-center">
            NKS {{ nks.komisariat }} <br />
            <small>
                {{ formatDate(nks.tgl_m, 'cccc, dd MMMM yyyy') }} |
                {{ bacaHijri(nks.tgl_h) }}
            </small>
        </QCardSection>
        <div v-if="nks.locked" class="q-mt-sm q-pa-md text-center text-negative bg-orange-3">
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
                            <q-card-actions class="bg-grey-2" align="right" v-if="!nks.locked">
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
    </q-card>

    <!-- <pre>{{ notes }}</pre> -->
</template>
<script setup>
import LoadingFixed from '@/components/LoadingFixed.vue';
import SectionHeader from '@/components/SectionHeader.vue';
import NksNote from '@/models/NksNote';
import { formatDate } from '@/utils/date-operation';
import { bacaHijri } from '@/utils/hijri';
import { onMounted, ref, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';

const { params } = useRoute();
const nksId = params.nksId;
const loading = ref(false);
const notes = shallowRef([]);
const nks = shallowRef({});

async function loadData() {
    try {
        loading.value = true;
        const res = await NksNote.getAll({ nks_id: nksId });
        notes.value = res.notes;
        nks.value = res.nks;
    } catch (e) {
        console.log('error get absences ', e);
    } finally {
        loading.value = false;
    }
}

onMounted(async () => {
    if (nksId) {
        await loadData();
    }
});
const router = useRouter();
function goEdit(note) {
    router.push({ path: `/nks/${nksId}/notes/form`, state: { note } });
}
</script>
<style scoped></style>
