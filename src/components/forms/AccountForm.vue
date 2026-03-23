<template>
    <q-card class="full-width" style="max-width: 425px">
        <q-form @submit.prevent="onSubmit">
            <FormHeader :title="'Input Rekening ' + toProperCase(scope)" :is-new="!id" />
            <LoadingAbsolute v-if="loading" />

            <q-card-section class="q-pa-sm">
                <q-input
                    dense
                    hint="Nama Rekening (Akun)"
                    class="q-my-sm"
                    outlined
                    label="Rekening *"
                    v-model="inputs.nama"
                    type="text"
                    :rules="[(val) => !!val || 'Harus diisi!']"
                    error-color="negative"
                    ref="firstInput"
                />
                <q-input
                    :disable="scope?.toLowerCase() != 'komisariat'"
                    :readonly="scope?.toLowerCase() == 'komisariat'"
                    dense
                    class="q-my-sm"
                    outlined
                    label="Komisariat *"
                    v-model="inputs.komisariat"
                    :rules="[(val) => !!val || 'Harus diisi!']"
                />

                <q-card bordered flat class="q-px-sm q-my-sm bg-transparent flex items-center">
                    <div class="q-mr-md text-caption tw:w-1/8">Private</div>
                    <q-toggle
                        v-model="inputs.private"
                        color="orange"
                        :true-value="true"
                        :false-value="false"
                        :label="inputs.private ? 'Ya' : 'Tidak'"
                    />
                </q-card>
                <q-card bordered flat class="q-px-sm q-my-sm bg-transparent flex items-center">
                    <div class="q-mr-md text-caption tw:w-1/8">Aktif</div>
                    <q-toggle
                        v-model="inputs.active"
                        color="orange"
                        :true-value="true"
                        :false-value="false"
                        :label="inputs.active ? 'Ya (tampil di list)' : 'Tidak'"
                    />
                </q-card>
            </q-card-section>
            <FormActions :btn-delete="!!id" @on-delete="onDelete" />
        </q-form>
    </q-card>
</template>
<script setup>
import { onMounted, ref, useTemplateRef, nextTick } from 'vue';
import LoadingAbsolute from '../LoadingAbsolute.vue';
import { notifyConfirm } from '@/utils/notify';
import FormHeader from './parts/FormHeader.vue';
import FormActions from './parts/FormActions.vue';
import Account from '@/models/Account';
import { toProperCase } from '@/utils/string';

const props = defineProps({
    dataInputs: { type: Object },
    scope: { type: String, required: true },
});
const emit = defineEmits(['successDelete', 'successSubmit', 'successUpdate', 'successCreate']);

const loading = ref(false);
const id = props.dataInputs?.id;
const inputs = ref({ ...props.dataInputs });
const firstInput = useTemplateRef('firstInput');

onMounted(async () => {
    await nextTick();
    if (firstInput.value) firstInput.value.focus();
});

const onSubmit = async () => {
    const data = JSON.parse(JSON.stringify(inputs.value));
    // console.log('🚀 ~ onSubmit ~ data:', data);

    try {
        loading.value = true;
        let response = null;
        if (!id) {
            response = await Account.create(data, { lingkup: props.scope });
            emit('successCreate', response?.account);
        } else {
            response = await Account.update(id, data, { lingkup: props.scope });
            emit('successUpdate', response?.account);
        }
        emit('successSubmit', response?.account);
    } catch (error) {
        console.log('error account ', error);
    } finally {
        loading.value = false;
    }
};

const onDelete = async () => {
    const isConfirmed = await notifyConfirm('Hapus data ini?', true);
    if (!isConfirmed) return;

    try {
        loading.value = true;
        await Account.remove(id, { lingkup: props.scope });
        emit('successDelete', id);
    } catch (error) {
        console.log('error delete account ', error);
    } finally {
        loading.value = false;
    }
};
</script>
