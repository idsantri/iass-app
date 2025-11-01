<template>
    <QCard flat bordered class="relative-position" style="max-width: 1024px">
        <SectionHeader title="Detail NKS" @on-reload="loadData">
            <template #left>
                <QBtn
                    dense
                    label="Edit"
                    outline=""
                    icon="edit"
                    no-caps
                    class="q-px-md q-mr-sm text-orange-1"
                    @click="dialog = true"
                />
            </template>
        </SectionHeader>

        <LoadingFixed v-if="loading" />
        <QCardSection class="q-pa-sm">
            <QMarkupTable flat bordered>
                <tbody>
                    <tr>
                        <td>Tanggal</td>
                        <td>
                            {{ formatDate(nks.tgl_m, 'cccc, dd MMMM yyyy') }} |
                            {{ bacaHijri(nks.tgl_h) }}
                        </td>
                    </tr>

                    <tr>
                        <td>Tahun Ajaran</td>
                        <td>{{ nks.th_ajaran_h }}</td>
                    </tr>
                    <tr>
                        <td>Komisariat</td>
                        <td>{{ nks.komisariat }}</td>
                    </tr>
                    <tr>
                        <td>Lokasi</td>
                        <td>
                            {{ nks.lokasi }}
                        </td>
                    </tr>
                    <tr>
                        <td>Lock data</td>
                        <td class="no-padding">
                            <q-toggle
                                v-model="nks.locked"
                                color="orange"
                                :label="nks.locked ? 'Locked' : 'Unlocked'"
                                @click="lockNks(nks)"
                                :true-value="1"
                                :false-value="0"
                            />
                        </td>
                    </tr>
                </tbody>
                <tfoot class="bg-orange-1">
                    <tr>
                        <td colspan="2" class="text-right text-orange-10">
                            <QBtn
                                label="Catatan NKS"
                                :to="`/nks/${nks.id}/notes`"
                                outline
                                size="sm"
                                no-caps
                            />
                        </td>
                    </tr>
                </tfoot>
            </QMarkupTable>
        </QCardSection>
        <QCardSection class="q-pa-sm">
            <NksReportAbsence :nksId="nks.id" />
        </QCardSection>
        <!-- <pre>
      {{ nks }}
    </pre> -->
        <QDialog v-model="dialog">
            <NksForm
                :data="nks"
                @success-delete="() => $router.go(-1)"
                @success-submit="onSubmit"
            />
        </QDialog>
    </QCard>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import SectionHeader from '@/components/SectionHeader.vue';
import LoadingFixed from '@/components/LoadingFixed.vue';
import { useRouter } from 'vue-router';
import Nks from '@/models/Nks';
import { bacaHijri } from '@/utils/hijri';
import { formatDate } from '@/utils/date-operation';
import NksForm from '@/components/forms/NksForm.vue';
import NksReportAbsence from './NksReportAbsence.vue';

const { params } = useRoute();
const id = params.id;
const loading = ref(false);
const nks = ref({});
const dialog = ref(false);
const router = useRouter();

async function loadData() {
    try {
        loading.value = true;
        const res = await Nks.getById(id);
        nks.value = res.nks;
    } catch (e) {
        console.log('error get nks id ', e);
    } finally {
        loading.value = false;
    }
}

async function lockNks(data) {
    try {
        await Nks.update(data.id, { locked: data.locked });
    } catch (e) {
        nks.value.locked = data.locked ? 0 : 1;
        console.log('error lock nks ', e);
    }
}

function onSubmit(res) {
    if (id != res.id) {
        router.push(`/nks/${res.id}`);
    }
    Object.assign(nks.value, res);
    // console.log(res);
    // console.log(nks.value);
}

onMounted(async () => {
    if (id) await loadData();
});
</script>
<style scoped>
td {
    white-space: normal;
    word-wrap: break-word;
    padding: 4px 8px;
}
</style>
