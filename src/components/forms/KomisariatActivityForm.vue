<template>
    <q-card class="full-width" style="max-width: 425px">
        <q-form @submit.prevent="onSubmit">
            <FormHeader title="Input Kegiatan Komisariat" :is-new="!id" />
            <LoadingAbsolute v-if="loading" />

            <q-card-section class="q-pa-sm">
                <q-input
                    dense
                    class="q-my-sm"
                    outlined
                    label="Komisariat *"
                    v-model="inputs.komisariat"
                    :rules="[(val) => !!val || 'Harus diisi!']"
                    readonly=""
                />

                <q-input
                    dense
                    :hint="
                        isValid(new Date(inputs.tgl_m))
                            ? formatDate(new Date(inputs.tgl_m), 'cccc, dd MMMM yyyy')
                            : ''
                    "
                    class="q-my-sm"
                    outlined
                    label="Tanggal (M) *"
                    v-model="inputs.tgl_m"
                    type="date"
                    @change="
                        isValid(new Date(inputs.tgl_m)) ? (inputs.tgl_h = m2h(inputs.tgl_m)) : ''
                    "
                    :rules="[(val) => !!val || 'Harus diisi!']"
                    error-color="negative"
                />
                <q-input
                    dense
                    :hint="inputs.tgl_h?.length ? bacaHijri(inputs.tgl_h) : ''"
                    class="q-my-sm"
                    outlined
                    label="Tanggal (H) *"
                    v-model="inputs.tgl_h"
                    mask="####-##-##"
                    :rules="[
                        (val) => !!val || 'Harus diisi!',
                        (val) => val?.length == 8 || '8 digit angka!',
                    ]"
                    error-color="negative"
                />

                <InputSelectArray
                    v-model="inputs.nama"
                    url="nama-kegiatan"
                    label="Nama Kegiatan *"
                    class="q-my-sm"
                    :rules="[(val) => !!val || 'Harus diisi!']"
                />
                <q-input
                    dense
                    class="q-my-sm"
                    outlined
                    label="Lokasi *"
                    v-model="inputs.lokasi"
                    autogrow
                />

                <!-- <q-input dense class="q-my-sm" outlined label="Locked" v-model="inputs.locked" /> -->
            </q-card-section>
            <FormActions :btn-delete="!!id" @on-delete="onDelete" />
        </q-form>
    </q-card>
</template>
<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import LoadingAbsolute from '../LoadingAbsolute.vue';
import InputSelectArray from './inputs/InputSelectArray.vue';
import { notifyConfirm } from '@/utils/notify';
import FormHeader from './parts/FormHeader.vue';
import FormActions from './parts/FormActions.vue';
import { isValid } from 'date-fns';
import { formatDate } from '@/utils/date-operation';
import { bacaHijri, m2h } from '@/utils/hijri';
import KomisariatActivities from '@/services/KomisariatActivities';

const props = defineProps({
    dataInputs: { type: Object },
});
const emit = defineEmits(['successDelete', 'successSubmit', 'successUpdate', 'successCreate']);

const loading = ref(false);
const id = props.dataInputs?.id;
const inputs = ref({ ...props.dataInputs });
let btnClose = null;

onMounted(async () => {
    if (inputs.value.tgl_m) {
        inputs.value.tgl_m = formatDate(new Date(inputs.value.tgl_m), 'yyyy-MM-dd');
    }
    btnClose = document.getElementById('btn-close-form');
});

watch(
    () => inputs.value.tgl_h,
    (newValue, oldValue) => {
        if (newValue !== oldValue) {
            inputs.value.tgl_h = newValue.replace(/-/g, '');
        }
    },
);

const onSubmit = async () => {
    const data = JSON.parse(JSON.stringify(inputs.value));
    const {
        data: dataCreated,
        loading: loadingCreate,
        execute: executeCreate,
    } = KomisariatActivities.create(data);
    const {
        data: dataUpdated,
        loading: loadingUpdate,
        execute: executeUpdate,
    } = KomisariatActivities.update(id, data);
    let response = null;
    loading.value = true;
    if (id) {
        await executeUpdate();
        response = dataUpdated?.activity;
        emit('successUpdate', response);
        emit('successSubmit', response);
        loading.value = false;
        btnClose?.click();
    } else {
        await executeCreate();
        response = dataCreated?.activity;
        emit('successCreate', response);
        emit('successSubmit', response);
        loading.value = false;
        btnClose.click();
    }
};

const onDelete = async () => {
    const isConfirmed = await notifyConfirm('Hapus data ini?', true);
    if (!isConfirmed) return;
    const { execute: executeDelete } = KomisariatActivities.remove(inputs.value.id || 0);
    await executeDelete();
    emit('successDelete', id);
    btnClose.click();
};
</script>
