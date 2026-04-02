<template>
    <q-card class="full-width" style="max-width: 425px">
        <q-form @submit.prevent="onSubmit">
            <FormHeader :title="'Input Kegiatan ' + toProperCase(scope)" :is-new="!id" />
            <LoadingAbsolute v-if="loading" />

            <q-card-section class="q-pa-sm">
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
                    type="datetime-local"
                    @change="
                        isValid(new Date(inputs.tgl_m)) ? (inputs.tgl_h = m2h(inputs.tgl_m)) : ''
                    "
                    :rules="[(val) => !!val || 'Harus diisi!']"
                    error-color="negative"
                    ref="firstInput"
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
                <q-input
                    v-if="scope == 'komisariat'"
                    dense
                    class="q-my-sm"
                    outlined
                    label="Komisariat *"
                    v-model="inputs.komisariat"
                    :rules="[(val) => !!val || 'Harus diisi!']"
                    readonly=""
                />
                <InputSelectArray
                    v-if="scope == 'wilayah' || scope == 'bansus'"
                    v-model="inputs.komisariat"
                    url="komisariat"
                    label="Komisariat *"
                    class="q-my-sm"
                    :rules="[(val) => !!val || 'Harus diisi!']"
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
                    :rules="[(val) => !!val || 'Harus diisi!']"
                    hint="Lokasi/Alamat kegiatan"
                />
                <!-- scope {{ scope }} -->
                <!-- <q-input dense class="q-my-sm" outlined label="Locked" v-model="inputs.locked" /> -->
            </q-card-section>
            <FormActions :btn-delete="!!id" @on-delete="onDelete" />
        </q-form>
    </q-card>
</template>
<script setup>
import { nextTick, onMounted, ref, useTemplateRef, watch } from 'vue';
import LoadingAbsolute from '../LoadingAbsolute.vue';
import InputSelectArray from './inputs/InputSelectArray.vue';
import { notifyConfirm } from '@/utils/notify';
import FormHeader from './parts/FormHeader.vue';
import FormActions from './parts/FormActions.vue';
import { format, isValid, parseISO } from 'date-fns';
import { formatDate } from '@/utils/date-operation';
import { bacaHijri, m2h } from '@/utils/hijri';
import Activity from '@/models/Activity';
import { id as idn } from 'date-fns/locale';
import { toProperCase } from '@/utils/string';

const props = defineProps({
    dataInputs: { type: Object },
    scope: { type: String, required: true },
});
const emit = defineEmits(['successDelete', 'successSubmit', 'successUpdate', 'successCreate']);

const convertToLocalForInput = (utcString) => {
    if (!utcString) return '';

    // parseISO akan membaca 'Z' sebagai UTC
    const date = parseISO(utcString);

    // Format ke 'yyyy-MM-ddTHH:mm' (Format wajib untuk datetime-local)
    return format(date, "yyyy-MM-dd'T'HH:mm", { locale: idn });
};

const loading = ref(false);
const id = props.dataInputs?.id;
const inputs = ref({ ...props.dataInputs });
const firstInput = useTemplateRef('firstInput');

onMounted(async () => {
    if (inputs.value.tgl_m) {
        inputs.value.tgl_m = convertToLocalForInput(inputs.value.tgl_m);
    }

    await nextTick();
    if (firstInput.value) firstInput.value.focus();
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
    data.lingkup = toProperCase(props.scope);

    try {
        loading.value = true;
        let response = null;
        if (!id) {
            response = await Activity.create(data);
            emit('successCreate', response?.activity);
        } else {
            response = await Activity.update(id, data);
            emit('successUpdate', response?.activity);
        }
        emit('successSubmit', response?.activity);
    } catch (error) {
        console.log('error activity ', error);
    } finally {
        loading.value = false;
    }
};

const onDelete = async () => {
    const isConfirmed = await notifyConfirm('Hapus data ini?', true);
    if (!isConfirmed) return;

    try {
        loading.value = true;
        await Activity.remove(id);
        emit('successDelete', id);
    } catch (error) {
        console.log('error delete activity ', error);
    } finally {
        loading.value = false;
    }
};
</script>
