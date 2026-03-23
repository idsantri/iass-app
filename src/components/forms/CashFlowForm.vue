<template>
    <q-card class="full-width" style="max-width: 425px">
        <q-form @submit.prevent="onSubmit">
            <FormHeader :title="'Input Arus Kas ' + toProperCase(scope)" :is-new="!id" />
            <LoadingAbsolute v-if="loading" />

            <q-card-section class="q-pa-sm">
                <q-input
                    v-model="inputs.rekening_nama"
                    label="Rekening *"
                    class="q-my-sm"
                    :rules="[(val) => !!val || 'Harus diisi!']"
                    dense=""
                    outlined=""
                    readonly=""
                />
                <q-input
                    dense
                    outlined
                    label="Keterangan *"
                    class="q-my-sm"
                    v-model="inputs.keterangan"
                    :rules="[(val) => !!val || 'Harus diisi!']"
                />
                <q-card bordered flat class="q-px-sm q-my-sm bg-transparent flex items-center">
                    <div class="q-mr-md text-caption">Tipe</div>
                    <q-toggle
                        v-model="inputs.flag"
                        color="orange"
                        :true-value="'in'"
                        :false-value="'out'"
                        :label="inputs.flag == 'in' ? 'Pemasukan' : 'Pengeluaran'"
                    />
                </q-card>
                <InputCurrency
                    dense
                    class="q-my-sm"
                    outlined
                    v-model="inputs.nominal"
                    required
                    label="Nominal"
                    :rules="[(val) => !!val || 'Harus diisi!']"
                />
                <q-input
                    dense
                    class="q-my-sm"
                    outlined
                    label="Atas Nama"
                    v-model="inputs.atas_nama"
                    autogrow=""
                />
                <q-input
                    dense
                    class="q-my-sm"
                    outlined
                    label="Catatan"
                    v-model="inputs.catatan"
                    autogrow=""
                />
            </q-card-section>
            <FormActions :btn-delete="!!id" @on-delete="onDelete" />
        </q-form>
    </q-card>
</template>
<script setup>
import { ref } from 'vue';
import LoadingAbsolute from '../LoadingAbsolute.vue';
import { notifyConfirm } from '@/utils/notify';
import FormHeader from './parts/FormHeader.vue';
import FormActions from './parts/FormActions.vue';
import CashFlow from '@/models/CashFlow';
import InputCurrency from './inputs/InputCurrency.vue';
import { toProperCase } from '@/utils/string';

const props = defineProps({
    dataInputs: { type: Object, required: true },
    scope: { type: String, required: true },
});
const emit = defineEmits(['successDelete', 'successSubmit', 'successUpdate', 'successCreate']);

const inputs = ref({ flag: 'in', ...props.dataInputs });
const loading = ref(false);
const id = props.dataInputs?.id;

const onSubmit = async () => {
    const data = JSON.parse(JSON.stringify(inputs.value));
    // console.log('🚀 ~ onSubmit ~ data:', data);
    // return;
    try {
        loading.value = true;
        let response = null;
        if (!id) {
            response = await CashFlow.create(data);
            emit('successCreate', response?.cash_flow);
        } else {
            response = await CashFlow.update(id, data);
            emit('successUpdate', response?.cash_flow);
        }
        emit('successSubmit', response?.cash_flow);
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
        await CashFlow.remove(id, { rekening: props.dataInputs.rekening });
        emit('successDelete', id);
    } catch (error) {
        console.log('error delete status ', error);
    } finally {
        loading.value = false;
    }
};
</script>
