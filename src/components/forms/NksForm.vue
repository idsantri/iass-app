<template>
    <q-card class="full-width" style="max-width: 425px">
        <q-form @submit.prevent="onSubmit">
            <FormHeader title="Input Kegiatan" :is-new="!id" />
            <LoadingAbsolute v-if="loading" />

            <q-card-section class="q-pa-sm">
                <q-input
                    dense
                    class="q-my-sm"
                    outlined
                    label="ID NKS*"
                    v-model="inputs.id"
                    hint="[tahun hijri][bulan] (misal: “144701”)"
                />
                <!-- :rules="[
                        (val) => !val || val?.length == 6 || 'tahun dan bulan (6 digit)!',
                        (val) => !val || !isNaN(val) || 'tahun dan bulan (hanya angka)!',
                    ]" -->
                <q-input
                    dense
                    :hint="
                        isValid(new Date(inputs.tgl_m))
                            ? formatDate(new Date(inputs.tgl_m), 'cccc, dd MMMM yyyy')
                            : ''
                    "
                    class="q-my-sm"
                    outlined
                    label="Tanggal (M)*"
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
                    label="Tanggal (H)*"
                    v-model="inputs.tgl_h"
                    mask="####-##-##"
                    :rules="[
                        (val) => !!val || 'Harus diisi!',
                        (val) => val?.length == 8 || '8 digit angka!',
                    ]"
                    error-color="negative"
                />
                <InputSelectArray
                    v-model="inputs.komisariat"
                    url="komisariat"
                    label="Komisariat *"
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
import { onMounted, ref, watch } from 'vue';
import LoadingAbsolute from '../LoadingAbsolute.vue';
import InputSelectArray from './inputs/InputSelectArray.vue';
import { notifyConfirm } from '@/utils/notify';
import FormHeader from './parts/FormHeader.vue';
import FormActions from './parts/FormActions.vue';
import Nks from '@/models/Nks';
import { isValid } from 'date-fns';
import { formatDate } from '@/utils/date-operation';
import { bacaHijri, m2h } from '@/utils/hijri';

const props = defineProps({
    data: { type: Object },
});
const emit = defineEmits(['successDelete', 'successSubmit', 'successUpdate', 'successCreate']);

const id = props.data?.id;
const inputs = ref({ id: id });
const loading = ref(false);
let btnClose = null;

onMounted(async () => {
    Object.assign(inputs.value, props.data);
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
    try {
        loading.value = true;
        let response = null;
        if (!id) {
            response = await Nks.create(data);
            emit('successCreate', response?.nks);
        } else {
            response = await Nks.update(id, data);
            emit('successUpdate', response?.nks);
        }
        emit('successSubmit', response?.nks);
        btnClose.click();
    } catch (error) {
        console.log('error nks ', error);
    } finally {
        loading.value = false;
    }
};

const onDelete = async () => {
    const isConfirmed = await notifyConfirm('Hapus data ini?', true);
    if (!isConfirmed) return;

    try {
        loading.value = true;
        await Nks.remove(id);
        btnClose.click();
        emit('successDelete', id);
    } catch (error) {
        console.log('error delete status ', error);
    } finally {
        loading.value = false;
    }
};
</script>
