<template>
    <!-- <q-card class="full-width" flat bordered=""> -->
    <q-form @submit.prevent="onSubmit">
        <!-- <FormHeader title="Input Catatan NKS" :is-new="!id" /> -->
        <LoadingAbsolute v-if="loading" />

        <q-card-section class="q-px-sm q-py-none">
            <q-input
                dense
                class="q-my-sm"
                filled
                label="ID NKS *"
                v-model="inputs.nks_id"
                disable
            />
            <q-input dense class="q-my-sm" outlined label="Judul *" v-model="inputs.title" />

            <q-editor v-model="inputs.content" class="q-my-sm" />
        </q-card-section>
        <FormActions :btn-delete="!!id" @on-delete="onDelete" :btn-close="false" />
    </q-form>
    <!-- </q-card> -->
    <!-- <pre>
        {{ inputs }}
    </pre> -->
</template>
<script setup>
import { onMounted, ref } from 'vue';
import LoadingAbsolute from '../LoadingAbsolute.vue';
import { notifyConfirm } from '@/utils/notify';
import FormActions from './parts/FormActions.vue';
import NksNote from '@/models/NksNote';

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
    const data = JSON.parse(JSON.stringify(inputs.value));

    try {
        loading.value = true;
        let response = null;
        if (!id) {
            response = await NksNote.create(data);
            emit('successCreate', response?.note);
        } else {
            response = await NksNote.update(id, data);
            emit('successUpdate', response?.note);
        }
        emit('successSubmit', response?.note);
        btnClose.click();
    } catch (error) {
        console.log('error status ', error);
    } finally {
        loading.value = false;
    }
};

const onDelete = async () => {
    const isConfirmed = await notifyConfirm('Hapus catatan ini?', true);
    if (!isConfirmed) return;

    try {
        loading.value = true;
        await NksNote.remove(id);
        btnClose.click();
        emit('successDelete', id);
    } catch (error) {
        console.log('error delete status ', error);
    } finally {
        loading.value = false;
    }
};
</script>
