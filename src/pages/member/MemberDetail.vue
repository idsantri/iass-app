<template>
    <QCard>
        <CardHeader title="Detail Anggota" @on-reload="loadData"> </CardHeader>
        <QCardSection class="q-pa-sm q-gutter-sm" style="max-width: 1024px">
            <QCard bordered flat>
                <LoadingFixed v-if="loading" />
                <DetailIdentity :anggota="anggota" @set-edit="dialog = true" />
            </QCard>
            <QCard bordered flat>
                <DetailStatus
                    :statuses="anggota?.statuses || []"
                    :member="{ id: anggota.id, nama: anggota.nama }"
                    @create-status="onCreateStatus"
                    @update-status="onUpdateStatus"
                    @delete-status="onDeleteStatus"
                />
            </QCard>
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
import DetailIdentity from './comp/DetailIdentity.vue';
import DetailStatus from './comp/DetailStatus.vue';
import LoadingFixed from '@/components/LoadingFixed.vue';
import MemberForm from '@/components/forms/MemberForm.vue';
import { useRouter } from 'vue-router';
import ArrayCrud from '@/models/ArrayCrud';
import CardHeader from '@/components/cards/CardHeader.vue';

const { params } = useRoute();
const id = params.id;
const loading = ref(false);
const anggota = ref({});
const dialog = ref(false);
const router = useRouter();

async function loadData() {
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
        router.push(`/members/${res.id}`);
    }
    Object.assign(anggota.value, res);
    // console.log(anggota.value);
}
onMounted(async () => {
    if (id) await loadData();
});

const onDeleteStatus = (id) => {
    anggota.value.statuses = ArrayCrud.remove(anggota.value.statuses, id);
};
const onUpdateStatus = (obj) => {
    anggota.value.statuses = ArrayCrud.update(anggota.value.statuses, obj.id, obj);
};
const onCreateStatus = (obj) => {
    anggota.value.statuses = ArrayCrud.create(anggota.value.statuses, obj, 'first');
};
</script>
