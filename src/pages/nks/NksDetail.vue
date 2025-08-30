<template>
    <QCard flat bordered class="relative-position">
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
                        <td>ID</td>
                        <td class="flex items-center justify-between">
                            <span>{{ nks.id }}</span>
                            <span>({{ nks.tahun_bulan }})</span>
                        </td>
                    </tr>
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
                        <td>Komisariat</td>
                        <td>{{ nks.komisariat }}</td>
                    </tr>
                </tbody>
            </QMarkupTable>
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
}
</style>
