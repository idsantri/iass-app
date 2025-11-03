<template>
    <q-form @submit.prevent="onSubmit">
        <LoadingAbsolute v-if="loading" />
        <q-card-section class="q-px-sm q-py-none">
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
import KomisariatNotes from '@/models/KomisariatNotes';
import WilayahNotes from '@/models/WilayahNotes';

const emit = defineEmits(['successDelete', 'successSubmit', 'successUpdate', 'successCreate']);
const props = defineProps({
    dataInputs: { type: Object, required: true },
    scope: { type: String, required: true },
});

const inputs = ref({ ...props.dataInputs });
const id = props.dataInputs?.id;
const loading = ref(false);
let model = null;

onMounted(async () => {
    if (props.scope.toLocaleLowerCase() === 'komisariat') {
        model = KomisariatNotes;
    }
    if (props.scope.toLocaleLowerCase() === 'wilayah') {
        model = WilayahNotes;
    }
});

const onSubmit = async () => {
    const data = JSON.parse(JSON.stringify(inputs.value));

    try {
        loading.value = true;
        let response = null;
        if (!id) {
            response = await model.create(data);
            emit('successCreate', response?.note);
        } else {
            response = await model.update(id, data);
            emit('successUpdate', response?.note);
        }
        emit('successSubmit', response?.note);
    } catch (error) {
        console.log('error note ', error);
    } finally {
        loading.value = false;
    }
};

const onDelete = async () => {
    const isConfirmed = await notifyConfirm('Hapus catatan ini?', true);
    if (!isConfirmed) return;

    try {
        loading.value = true;
        await model.remove(id);
        emit('successDelete', id);
    } catch (error) {
        console.log('error delete note ', error);
    } finally {
        loading.value = false;
    }
};
</script>
