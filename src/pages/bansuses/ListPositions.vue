<template lang="">
    <q-list bordered separator class="rounded-borders">
        <CardLoading :showing="loading" message="" />
        <q-item class="bg-orange-1">
            <q-item-section>
                <q-item-label class="text-italic text-weight-light">Riwayat Jabatan</q-item-label>
            </q-item-section>
            <q-item-section avatar>
                <q-btn dense outline no-caps icon="add" @click="handleAdd" />
            </q-item-section>
        </q-item>
        <template v-if="positions?.length > 0">
            <q-item v-for="position in positions" :key="position.id">
                <q-item-section>
                    <q-item-label overline>{{ position?.jabatan }}</q-item-label>
                    <q-item-label caption>
                        {{ formatDate(position?.cr_at, 'dd MMMM yyyy') }}
                    </q-item-label>
                    <q-item-label caption>{{ position?.keterangan }}</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                    <q-btn
                        color="orange"
                        icon="sym_o_edit"
                        round
                        dense
                        outline
                        @click="handleEdit(position)"
                    />
                </q-item-section>
            </q-item>
        </template>
        <template v-else>
            <q-item>
                <q-item-section>
                    <q-item-label overline>Belum ada jabatan</q-item-label>
                    <q-item-label caption>
                        Klik tombol tambah untuk menambahkan jabatan
                    </q-item-label>
                </q-item-section>
            </q-item>
        </template>
        <QDialog v-model="dialog">
            <BansusPositionForm
                :data="objPosition"
                @success-delete="onDelete"
                @success-create="onCreate"
                @success-update="onUpdate"
            />
        </QDialog>
    </q-list>
</template>
<script setup>
import BansusPositionForm from '@/components/forms/BansusPositionForm.vue';
import ArrayCrud from '@/models/ArrayCrud';
import BansusPosition from '@/models/BansusPosition';
import { formatDate } from '@/utils/date-operation';
import { ref, watch } from 'vue';

const props = defineProps({
    bansus_id: [String, Number],
    member: {
        type: Object,
        required: true,
    },
});
const emit = defineEmits(['setLastPosition']);

const loading = ref(false);
const positions = ref([]);
const dialog = ref(false);
const objPosition = ref({});

const handleAdd = () => {
    objPosition.value = {
        nama: props.member.nama,
        member_id: props.member.id,
        bansus_id: props.bansus_id,
    };
    dialog.value = true;
};

const handleEdit = (status) => {
    objPosition.value = status;
    objPosition.value.member_id = props.member.id;
    objPosition.value.nama = props.member.nama;
    dialog.value = true;
};

const loadPositions = async (bansus_id) => {
    try {
        loading.value = true;
        const data = await BansusPosition.getAll({ bansus_id: bansus_id });
        positions.value = data.positions;
    } catch (error) {
        console.log('error get positions ', error);
    } finally {
        loading.value = false;
    }
};

watch(
    () => props.bansus_id,
    async (newVal) => {
        if (newVal) {
            await loadPositions(newVal);
        }
    },
    {
        immediate: true,
    },
);

const lastPosition = () => {
    const position = ArrayCrud.findMax(positions.value);
    return position?.jabatan || '';
};

const onCreate = (pos) => {
    positions.value.unshift(pos);
    emit('setLastPosition', lastPosition());
    dialog.value = false;
};

const onDelete = (id) => {
    positions.value = ArrayCrud.remove(positions.value, id);
    emit('setLastPosition', lastPosition());
};

const onUpdate = (obj) => {
    positions.value = ArrayCrud.update(positions.value, obj.id, obj);
    emit('setLastPosition', lastPosition());
};
</script>
<style lang=""></style>
