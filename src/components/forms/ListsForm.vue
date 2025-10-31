<template lang="">
    <q-card class="full-width" style="max-width: 425px">
        <q-form @submit.prevent="onSubmit">
            <FormHeader :title="'Lists ' + inputs.key || 'List'" :is-new="!id" />
            <LoadingAbsolute size="4em" v-if="loading" />

            <q-card-section class="q-pa-sm">
                <q-input
                    label="text1"
                    dense
                    class=""
                    outlined
                    v-model="inputs.val0"
                    autogrow=""
                    :loading="loading"
                    v-if="props.showInput.val0"
                />
                <q-input
                    label="text2"
                    dense
                    class="q-mt-sm"
                    outlined
                    v-model="inputs.val1"
                    autogrow=""
                    :loading="loading"
                    v-if="props.showInput.val1"
                />
            </q-card-section>
            <FormActions :btn-delete="!!id" @on-delete="onDelete" />
        </q-form>
    </q-card>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import FormHeader from './parts/FormHeader.vue';
import FormActions from './parts/FormActions.vue';
import LoadingAbsolute from '../LoadingAbsolute.vue';
import List from '@/models/List';
import { notifyConfirm } from '@/utils/notify';

const props = defineProps({
    dataInput: {
        type: Object,
        required: true,
    },
    showInput: {
        type: Object,
        required: true,
    },
});
const emit = defineEmits(['successSubmit', 'successDelete']);

const loading = ref(false);
const inputs = ref({});
let btnClose = null;
const id = props.dataInput?.id;

onMounted(() => {
    Object.assign(inputs.value, props.dataInput);
    btnClose = document.getElementById('btn-close-form');
});

async function onSubmit() {
    const data = JSON.parse(JSON.stringify(inputs.value));
    try {
        loading.value = true;
        let response = null;

        if (id) {
            response = await List.update(id, data);
        } else {
            response = await List.create(data);
        }

        emit('successSubmit', response);
        btnClose?.click();
    } catch (error) {
        console.log('error lists ', error);
    } finally {
        loading.value = false;
    }
}

async function onDelete() {
    const isConfirmed = await notifyConfirm('Hapus data ini?', true);
    if (!isConfirmed) return;

    try {
        loading.value = true;
        await List.remove(id);
        emit('successDelete', id);
        btnClose?.click();
    } catch (error) {
        console.log('error on delete lists ', error);
    } finally {
        loading.value = false;
    }
}
</script>
<style lang=""></style>
