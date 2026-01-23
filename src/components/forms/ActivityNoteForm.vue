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
import { ref } from 'vue';
import LoadingAbsolute from '../LoadingAbsolute.vue';
import { notifyConfirm } from '@/utils/notify';
import FormActions from './parts/FormActions.vue';
import Note from '@/models/Note';

const emit = defineEmits(['successDelete', 'successSubmit', 'successUpdate', 'successCreate']);
const props = defineProps({
    dataInputs: { type: Object, required: true },
    scope: { type: String, required: true },
});

const inputs = ref({ ...props.dataInputs, content: props.dataInputs?.content || '' });
const id = props.dataInputs?.id;
const loading = ref(false);

const Model = () => {
    switch (props.scope) {
        case 'Komisariat':
            return Note.Komisariat;
        case 'Wilayah':
            return Note.Wilayah;
        case 'Bansus':
            return Note.Bansus;
        default:
            throw new Error(`Scope '${props.scope}' is not recognized`);
    }
};

const onSubmit = async () => {
    const data = JSON.parse(JSON.stringify(inputs.value));

    try {
        loading.value = true;
        let response = null;
        if (!id) {
            response = await Model().create(data);
            emit('successCreate', response?.note);
        } else {
            response = await Model().update(id, data);
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
        await Model().remove(id);
        emit('successDelete', id);
    } catch (error) {
        console.log('error delete note ', error);
    } finally {
        loading.value = false;
    }
};
</script>
