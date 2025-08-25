<template>
    <QCard flat bordered class="relative-position">
        <SectionHeader title="Detail Anggota" @on-reload="loadData"> </SectionHeader>

        <!-- <div class="tw:z-[999] tw:flex tw:items-center tw:justify-center tw:text-center tw:fixed">
      <q-spinner-cube color="orange-12" size="14em" class="flex flex-center q-ma-md q-mx-auto" />
    </div> -->
        <LoadingFixed v-if="loading" />
        <QCardSection class="q-pa-sm">
            <AnggotaDetailIdentity :anggota="anggota" />
            <AnggotaDetailStatus :statuses="anggota?.statuses" />
        </QCardSection>
        <!-- <pre>
      {{ anggota }}
    </pre> -->
    </QCard>
</template>
<script setup>
import Member from '@/models/Member';
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import SectionHeader from '@/components/SectionHeader.vue';
import AnggotaDetailIdentity from './comp/DetailIdentity.vue';
import AnggotaDetailStatus from './comp/DetailStatus.vue';
import LoadingFixed from '@/components/LoadingFixed.vue';

const route = useRoute();
const id = route.params.id;
const loading = ref(false);
const anggota = ref({});

async function loadData(id) {
    try {
        loading.value = true;
        const res = await Member.getById(id);
        anggota.value = res.member;
    } catch (e) {
        console.log('error get member id ', e);
    } finally {
        loading.value = false;
    }
}

onMounted(async () => {
    if (id) await loadData(id);
});
</script>
