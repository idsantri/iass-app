<template>
    <q-card class="full-width" style="max-width: 425px">
        <q-form @submit.prevent="onSubmit">
            <FormHeader title="Input Status" :is-new="!id" />
            <LoadingAbsolute v-if="loading" />

            <q-card-section class="q-pa-sm">
                <q-input
                    dense
                    outlined
                    label="Nama"
                    :model-value="inputs?.nama + ' (' + inputs?.member_id + ')'"
                    disable=""
                    filled=""
                    class="q-my-sm"
                />

                <InputSelectArray
                    v-model="inputs.status"
                    url="status"
                    label="Status *"
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
import Status from '@/models/Status';
import { notifyConfirm } from '@/utils/notify';
import FormHeader from './parts/FormHeader.vue';
import FormActions from './parts/FormActions.vue';

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
            response = await Status.create(data);
            emit('successCreate', response?.status);
        } else {
            response = await Status.update(id, data);
            emit('successUpdate', response?.status);
        }
        emit('successSubmit', response?.status);
        btnClose.click();
    } catch (error) {
        console.log('error status ', error);
    } finally {
        loading.value = false;
    }
};

const onDelete = async () => {
    const isConfirmed = await notifyConfirm('Hapus data ini?', true);
    if (!isConfirmed) return;

    try {
        loading.value = true;
        await Status.remove(id);
        btnClose.click();
        emit('successDelete', id);
    } catch (error) {
        console.log('error delete status ', error);
    } finally {
        loading.value = false;
    }
};
</script>
