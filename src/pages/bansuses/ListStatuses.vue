<template lang="">
    <q-list bordered separator class="rounded-borders">
        <CardLoading :showing="loading" message="" />
        <q-item class="bg-orange-1">
            <q-item-section>
                <q-item-label class="text-italic text-weight-light">Riwayat Status</q-item-label>
            </q-item-section>
            <q-item-section avatar>
                <q-btn dense outline no-caps icon="add" @click="handleAdd" />
            </q-item-section>
        </q-item>

        <template v-if="statuses?.length > 0">
            <q-item v-for="status in statuses" :key="status.id">
                <q-item-section>
                    <q-item-label overline>{{ status?.status }}</q-item-label>
                    <q-item-label caption>
                        {{ formatDate(status?.cr_at, 'dd MMMM yyyy') }}
                    </q-item-label>
                    <q-item-label caption>{{ status?.keterangan }}</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                    <q-btn
                        color="orange"
                        icon="sym_o_edit"
                        round
                        dense
                        outline
                        @click="handleEdit(status)"
                    />
                </q-item-section>
            </q-item>
        </template>
        <template v-else>
            <q-item>
                <q-item-section>
                    <q-item-label overline>Belum ada status</q-item-label>
                    <q-item-label caption>
                        Klik tombol tambah untuk menambahkan status
                    </q-item-label>
                </q-item-section>
            </q-item>
        </template>
        <QDialog v-model="dialog">
            <BansusStatusForm
                :data="objStatus"
                @success-delete="onDeleteStatus"
                @success-create="onCreateStatus"
                @success-update="onUpdateStatus"
            />
        </QDialog>
    </q-list>
</template>
<script setup>
import BansusStatusForm from '@/components/forms/BansusStatusForm.vue';
import ArrayCrud from '@/models/ArrayCrud';
import BansusStatus from '@/models/BansusStatus';
import { formatDate } from '@/utils/date-operation';
import { ref, watch } from 'vue';

const props = defineProps({
    bansus_id: [String, Number],
    member: {
        type: Object,
        required: true,
    },
});
const emit = defineEmits(['setLastStatus']);

const loading = ref(false);
const statuses = ref([]);
const dialog = ref(false);
const objStatus = ref({});

const handleAdd = () => {
    objStatus.value = {
        nama: props.member.nama,
        member_id: props.member.id,
        bansus_id: props.bansus_id,
    };
    dialog.value = true;
};

const handleEdit = (status) => {
    objStatus.value = status;
    objStatus.value.member_id = props.member.id;
    objStatus.value.nama = props.member.nama;
    dialog.value = true;
};

const loadStatuses = async (bansus_id) => {
    try {
        loading.value = true;
        const data = await BansusStatus.getAll({ bansus_id: bansus_id });
        statuses.value = data.statuses;
    } catch (error) {
        console.log('error get statuses ', error);
    } finally {
        loading.value = false;
    }
};

watch(
    () => props.bansus_id,
    async (newVal) => {
        if (newVal) {
            await loadStatuses(newVal);
        }
    },
    {
        immediate: true,
    },
);

const lastStatus = () => {
    const status = ArrayCrud.findMax(statuses.value);
    return status?.status || '';
};

const onCreateStatus = (status) => {
    statuses.value.unshift(status);
    emit('setLastStatus', lastStatus());
    dialog.value = false;
};

const onDeleteStatus = (id) => {
    statuses.value = ArrayCrud.remove(statuses.value, id);
    emit('setLastStatus', lastStatus());
};
const onUpdateStatus = (obj) => {
    statuses.value = ArrayCrud.update(statuses.value, obj.id, obj);
    emit('setLastStatus', lastStatus());
};
</script>
<style lang=""></style>
