<template>
    <q-card class="full-width bg-orange-1" style="max-width: 425px">
        <q-form @submit.prevent="onSubmit">
            <FormHeader title="Input Anggota" :is-new="!id" />
            <LoadingAbsolute v-if="loading" />
            <q-card-section class="q-pa-sm">
                <q-carousel
                    v-model="slide"
                    transition-prev="slide-right"
                    transition-next="slide-left"
                    animated
                    control-color="primary"
                    class="full-width bg-transparent"
                    style="height: 60vh"
                    swipeable
                    infinite
                >
                    <!-- identitas -->
                    <q-carousel-slide :name="carousel.identity.button" class="no-padding">
                        <div class="text-subtitle1">
                            {{ carousel.identity.title }}
                        </div>
                        <QSeparator class="q-my-sm" />
                        <MemberIdentity v-model="inputs" />
                    </q-carousel-slide>

                    <!-- alamat -->
                    <q-carousel-slide :name="carousel.address.button" class="no-padding">
                        <div class="text-subtitle1">
                            {{ carousel.address.title }}
                        </div>
                        <QSeparator class="q-my-sm" />
                        <MemberFormAddress v-model="inputs" />
                    </q-carousel-slide>

                    <!-- lain-lain -->
                    <q-carousel-slide :name="carousel.membership.button" class="no-padding">
                        <div class="text-subtitle1">
                            {{ carousel.membership.title }}
                        </div>
                        <QSeparator class="q-my-sm" />
                        <MemberFormIass v-model="inputs" />
                    </q-carousel-slide>
                </q-carousel>
            </q-card-section>
            <q-card-section class="q-pa-sm bg-orange-2">
                <div class="row justify-center">
                    <q-btn-toggle
                        toggle-color="orange-10"
                        text-color="text-orange-11"
                        no-caps=""
                        glossy
                        v-model="slide"
                        :options="toggleOptions"
                    />
                </div>
            </q-card-section>
            <FormActions :btn-delete="!!id" @on-delete="onDelete" />
        </q-form>
        <!-- <pre>{{ props.santri }}</pre> -->
    </q-card>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import FormActions from './parts/FormActions.vue';
import FormHeader from './parts/FormHeader.vue';
import MemberIdentity from './parts/MemberIdentity.vue';
import MemberFormIass from './parts/MemberFormIass.vue';
import MemberFormAddress from './parts/MemberFormAddress.vue';
import LoadingAbsolute from '../LoadingAbsolute.vue';
import Member from '@/models/Member';
import { notifyConfirm } from '@/utils/notify';

const props = defineProps({
    data: { type: Object, required: false, default: () => {} },
});

const emit = defineEmits(['successSubmit', 'successCreate', 'successUpdate', 'successDelete']);

const inputs = ref({
    wilayah: 'Bangkalan',
    alumni: 1,
    tmp_lahir: 'Bangkalan',
    provinsi: 'Jawa Timur',
    kabupaten: 'Kab. Bangkalan',
    rt: 1,
    rw: 1,
});
const loading = ref(false);
const id = props.data?.id;
let btnClose = null;

onMounted(async () => {
    Object.assign(inputs.value, props.data);
    btnClose = document.getElementById('btn-close-form');
});

const onSubmit = async () => {
    const data = JSON.parse(JSON.stringify(inputs.value));
    try {
        loading.value = true;
        let response = null;
        if (!id) {
            response = await Member.create(data);
            emit('successCreate', response?.member);
        } else {
            response = await Member.update(id, data);
            emit('successUpdate', response?.member);
        }
        emit('successSubmit', response?.member);
        btnClose?.click();
    } catch (error) {
        console.log('error submit member ', error);
    } finally {
        loading.value = false;
    }
};

const onDelete = async () => {
    const isConfirmed = await notifyConfirm('Hapus data ini?', true);
    if (!isConfirmed) return;

    try {
        loading.value = true;
        await Member.remove(id);
        emit('successDelete', id);
        btnClose?.click();
    } catch (error) {
        console.log('error on delete member ', error);
    } finally {
        loading.value = false;
    }
};

const carousel = {
    identity: {
        title: 'Identitas Diri',
        button: '1',
    },
    address: {
        title: 'Data Alamat',
        button: '2',
    },
    membership: {
        title: 'Data IASS',
        button: '3',
    },
};
const slide = ref(carousel.identity.button);
const toggleOptions = [
    {
        label: carousel.identity.button,
        value: carousel.identity.button,
    },
    {
        label: carousel.address.button,
        value: carousel.address.button,
    },
    {
        label: carousel.membership.button,
        value: carousel.membership.button,
    },
];
</script>
