<template>
    <q-card class="full-width" style="max-width: 425px">
        <q-form @submit.prevent="onSubmit">
            <FormHeader title="Input Jabatan Bansus" :is-new="!id" />
            <LoadingAbsolute v-if="loading" />

            <q-card-section class="q-pa-sm">
                <q-input
                    dense
                    outlined
                    label="Nama"
                    :model-value="inputs?.nama"
                    disable=""
                    filled=""
                    class="q-my-sm"
                    :hint="'ID Bansus: ' + inputs?.bansus_id + '; ID Anggota: ' + inputs?.member_id"
                />

                <InputSelectArray
                    v-model="inputs.jabatan"
                    url="jabatan-bansus"
                    label="Jabatan *"
                    class="q-my-sm"
                    :rules="[(val) => !!val || 'Harus diisi!']"
                />
                <q-input
                    dense
                    class="q-my-sm"
                    outlined
                    label="Keterangan"
                    v-model="inputs.keterangan"
                    autogrow=""
                />
            </q-card-section>
            <FormActions :btn-delete="!!id" @on-delete="onDelete" />
        </q-form>
    </q-card>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import LoadingAbsolute from '../LoadingAbsolute.vue';
import InputSelectArray from './inputs/InputSelectArray.vue';
import { notifyConfirm } from '@/utils/notify';
import FormHeader from './parts/FormHeader.vue';
import FormActions from './parts/FormActions.vue';
import BansusPosition from '@/models/BansusPosition';

const props = defineProps({
    data: { type: Object, required: true },
});
const emit = defineEmits(['successDelete', 'successSubmit', 'successUpdate', 'successCreate']);

const inputs = ref({ ...props.data });
const loading = ref(false);
let btnClose = null;
const id = props.data?.id;

onMounted(async () => {
    btnClose = document.getElementById('btn-close-form');
});

const onSubmit = async () => {
    const data = JSON.parse(JSON.stringify(inputs.value));

    try {
        loading.value = true;
        let response = null;
        if (!id) {
            response = await BansusPosition.create(data);
            emit('successCreate', response?.position);
        } else {
            response = await BansusPosition.update(id, data);
            emit('successUpdate', response?.position);
        }
        emit('successSubmit', response?.position);
        btnClose.click();
    } catch (error) {
        console.log('error position ', error);
    } finally {
        loading.value = false;
    }
};

const onDelete = async () => {
    const isConfirmed = await notifyConfirm('Hapus data ini?', true);
    if (!isConfirmed) return;

    try {
        loading.value = true;
        await BansusPosition.remove(id);
        btnClose.click();
        emit('successDelete', id);
    } catch (error) {
        console.log('error delete status ', error);
    } finally {
        loading.value = false;
    }
};
</script>
