<template>
    <q-card class="full-width" style="max-width: 425px">
        <q-form @submit.prevent="onSubmit">
            <FormHeader title="Input Bansus" :is-new="true" />
            <LoadingAbsolute v-if="loading" />

            <q-card-section class="q-pa-sm">
                <q-select
                    :hint="
                        member_id
                            ? member_id + ' &mdash; ' + getNama
                            : 'Pilih anggota untuk yang akan dijadikan bansus.'
                    "
                    dense
                    outlined
                    v-model="member_id"
                    label="Cari Anggota"
                    class="q-my-sm"
                    :rules="[(val) => !!val || 'Harus diisi!']"
                    :options="filteredMembers"
                    emit-value
                    map-options
                    option-value="id"
                    option-label="nama"
                    @filter="onFilter"
                    input-debounce="400"
                    use-input
                    clearable
                    :loading="isLoading"
                >
                    <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps">
                            <q-item-section>
                                <q-item-label
                                    >{{ scope.opt.id }} &mdash; {{ scope.opt.nama }}
                                </q-item-label>
                                <q-item-label caption>
                                    {{ scope.opt.komisariat }} &mdash;
                                    {{ scope.opt.kelompok || '?' }}</q-item-label
                                >
                            </q-item-section>
                        </q-item>
                    </template>
                    <template v-slot:after>
                        <q-btn
                            class="q-pa-sm"
                            no-caps
                            dense
                            outline
                            icon="sync"
                            @click="reload"
                            color="orange-6"
                        />
                    </template>
                </q-select>
            </q-card-section>
            <FormActions :btn-delete="false" />
        </q-form>
    </q-card>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import LoadingAbsolute from '../LoadingAbsolute.vue';
import FormHeader from './parts/FormHeader.vue';
import FormActions from './parts/FormActions.vue';
import useMembersStore from '@/stores/membersStore';
import { storeToRefs } from 'pinia';
import Bansus from '@/models/Bansus';

const emit = defineEmits(['successDelete', 'successSubmit', 'successUpdate', 'successCreate']);

const memberStore = useMembersStore();
const { isLoading, sortByName: memberByName } = storeToRefs(memberStore);

const member_id = ref('');
const loading = ref(false);
const filteredMembers = ref([]);

const getNama = computed(() => {
    const member = memberByName.value.find((m) => m.id === member_id.value);
    return member ? member.nama : '';
});
const reload = async () => {
    await memberStore.loadMembers();
    filteredMembers.value = memberByName.value;
};

onMounted(async () => {
    if (!memberByName.value?.length) {
        await reload();
    }
    filteredMembers.value = memberByName.value;
});

const onFilter = (val, update, _abort) => {
    if (!val || val.length < 3) {
        update(() => {
            filteredMembers.value = memberByName.value || [];
        });
        return;
    }

    // if (val.length < 3) {
    //     abort();
    //     return;
    // }

    update(() => {
        const needle = val.toLowerCase();
        filteredMembers.value = memberByName.value.filter((member) => {
            // Cari berdasarkan nama atau id (konversi id ke string)
            const nameMatch = member.nama?.toLowerCase().includes(needle);
            const idMatch = String(member.id).toLowerCase().includes(needle);
            return nameMatch || idMatch;
        });
    });
};

const onSubmit = async () => {
    try {
        loading.value = true;
        const data = await Bansus.create({ member_id: member_id.value });

        console.log('🚀 ~ onSubmit ~ data.bansus:', data.bansus);
        emit('successSubmit', data.bansus);
    } catch (error) {
        console.error('Error submitting form:', error);
    } finally {
        loading.value = false;
    }
};
</script>
