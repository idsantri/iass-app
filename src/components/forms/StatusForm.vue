<template>
    <q-card class="full-width" style="max-width: 425px">
        <q-form @submit.prevent="onSubmit">
            <FormHeader title="Input Status" :is-new="!id" />
            <LoadingAbsolute v-if="loading" />

            <q-card-section>
                <q-input
                    dense
                    outlined
                    label="Nama"
                    :model-value="inputs?.nama + ' (' + inputs?.member_id + ')'"
                    disable=""
                    filled=""
                />

                <InputSelectArray
                    v-model="inputs.status"
                    url="status"
                    label="Status *"
                    class="q-mt-sm"
                    :rules="[(val) => !!val || 'Harus diisi!']"
                />
                <q-input
                    dense
                    class="q-mt-sm"
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

const inputs = ref({});
const loading = ref(false);
let btnClose = null;
const id = props.data?.id;

onMounted(async () => {
    Object.assign(inputs.value, props.data);
    btnClose = document.getElementById('btn-close-form');
});

const onSubmit = async () => {
    const data = {
        member_id: inputs.value.member_id,
        status: inputs.value.status,
        keterangan: inputs.value.keterangan,
    };

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
