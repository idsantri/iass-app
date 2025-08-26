<template>
    <QCard flat bordered class="relative-position">
        <SectionHeader title="Detail Anggota" @on-reload="loadData"> </SectionHeader>

        <!-- <div class="tw:z-[999] tw:flex tw:items-center tw:justify-center tw:text-center tw:fixed">
      <q-spinner-cube color="orange-12" size="14em" class="flex flex-center q-ma-md q-mx-auto" />
    </div> -->
        <LoadingFixed v-if="loading" />
        <QCardSection class="q-pa-sm">
            <AnggotaDetailIdentity :anggota="anggota" @set-edit="dialog = true" />
            <AnggotaDetailStatus :statuses="anggota?.statuses" />
        </QCardSection>
        <!-- <pre>
      {{ anggota }}
    </pre> -->
        <QDialog v-model="dialog">
            <MemberForm
                :data="anggota"
                @success-delete="() => $router.go(-1)"
                @success-submit="onSubmit"
            />
        </QDialog>
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
import MemberForm from '@/components/forms/MemberForm.vue';
import { useRouter } from 'vue-router';

const route = useRoute();
const id = route.params.id;
const loading = ref(false);
const anggota = ref({});
const dialog = ref(false);
const router = useRouter();

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

function onSubmit(res) {
    if (id != res.id) {
        router.push(`/anggota/${res.id}`);
    }
    Object.assign(anggota.value, res);
    console.log(anggota.value);
    // assing res to anggota.value
}
onMounted(async () => {
    if (id) await loadData(id);
});
</script>
