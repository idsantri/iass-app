<template>
    <q-card class="full-width" style="max-width: 425px">
        <q-form @submit.prevent="onSubmit">
            <FormHeader title="Input User" :is-new="!id" />
            <LoadingAbsolute v-if="loading" />

            <q-card-section class="q-pa-sm">
                <q-input dense outlined label="Nama *" v-model="inputs.name" />
                <q-input
                    dense
                    class="q-my-sm"
                    outlined
                    label="Username *"
                    v-model="inputs.username"
                    type="text"
                    hint=""
                    :rules="[(val) => !!val || 'Harus diisi!']"
                />
                <q-input v-if="!id" dense outlined label="Password" v-model="inputs.password" />

                <InputSelectArray
                    v-model="inputs.komisariat"
                    url="komisariat"
                    label="Komisariat"
                    class="q-my-sm"
                    clearable
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
import User from '@/models/User';

const props = defineProps({
    data: { type: Object },
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
        name: inputs.value.name,
        username: inputs.value.username,
        password: inputs.value.password,
        komisariat: inputs.value.komisariat,
    };

    try {
        loading.value = true;
        let response = null;
        if (!id) {
            response = await User.create(data);
            emit('successCreate', response?.user);
        } else {
            response = await User.update(id, data);
            emit('successUpdate', response?.user);
        }
        emit('successSubmit', response?.user);
        btnClose.click();
    } catch (error) {
        console.log('error user ', error);
    } finally {
        loading.value = false;
    }
};

const onDelete = async () => {
    const isConfirmed = await notifyConfirm('Hapus data ini?', true);
    if (!isConfirmed) return;

    try {
        loading.value = true;
        await User.remove(id);
        btnClose.click();
        emit('successDelete', id);
    } catch (error) {
        console.log('error delete user ', error);
    } finally {
        loading.value = false;
    }
};
</script>
