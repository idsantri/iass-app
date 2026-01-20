<template lang="">
    <CardPage>
        <CardHeader title="Detail Anggota Bansus" @on-reload="reload" :show-add="false">
        </CardHeader>
        <q-card-section class="q-pa-sm tw:flex tw:flex-col tw:sm:grid tw:sm:grid-cols-2 tw:gap-2">
            <CardDetail :bansus="bansus" :onDelete="onDelete" :isLoading="isLoading" />
            <CardRelations
                :bansus_id="bansus?.id"
                :member="bansus?.member"
                @setLastStatus="handleSetLastStatus"
                @setLastPosition="handleSetLastPosition"
            />
        </q-card-section>
    </CardPage>
</template>
<script setup>
import Bansus from '@/models/Bansus';
import { useBansusesStore } from '@/stores/bansusesStore';
import { notifyConfirm } from '@/utils/notify';
import { storeToRefs } from 'pinia';
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import CardDetail from './CardDetail.vue';
import CardRelations from './CardRelations.vue';
import ArrayCrud from '@/models/ArrayCrud';

const store = useBansusesStore();
const { isLoading, bansuses } = storeToRefs(store);
const { params } = useRoute();
const bansus = computed(() => {
    return bansuses.value.find((b) => b.id == params.id);
});

const reload = () => {
    store.loadById(params.id);
};

const handleSetLastStatus = (val) => {
    bansuses.value = ArrayCrud.update(bansuses.value, params.id, {
        status_max: val,
    });
};

const handleSetLastPosition = (val) => {
    bansuses.value = ArrayCrud.update(bansuses.value, params.id, {
        jabatan_max: val,
    });
};

watch(
    () => params.id,
    async (newId) => {
        if (!bansus.value) {
            await store.loadById(newId);
        }
    },
    { immediate: true }, // Menjalankan fungsi saat komponen di-load
);

const onDelete = async () => {
    if (!params.id) return;
    const confirmed = await notifyConfirm('Apakah Anda yakin ingin menghapus data bansus ini?');
    if (!confirmed) return;

    try {
        isLoading.value = true;
        await Bansus.remove(params.id);
        bansuses.value = ArrayCrud.remove(bansuses.value, params.id);
        window.history.back();
    } catch (e) {
        console.error('Error deleting bansus:', e);
    } finally {
        isLoading.value = false;
    }
};
</script>
