<template>
    <q-card class="full-width bg-orange-1" style="max-width: 425px">
        <q-form @submit.prevent="onSubmit">
            <FormHeader title="Input Anggota" :is-new="inputs.id ? false : true" />
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
                        <div>
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Pariatur
                            perspiciatis placeat nesciunt quos ratione rem temporibus minima harum
                            a. Soluta praesentium quasi quo nesciunt corrupti, aliquid magnam enim
                            odit sunt.
                        </div>
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
            <FormActions :btn-delete="inputs.id ? true : false" @on-delete="onDelete" />
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

const props = defineProps({
    data: { type: Object, required: false, default: () => {} },
});

const _emit = defineEmits(['successDelete', 'successSubmit', 'successUpdate', 'successCreate']);

const inputs = ref({ wilayah: 'Bangkalan', iass: 1 });
const _loadingCrud = ref(false);

onMounted(async () => {
    Object.assign(inputs.value, props.data);
});

const onSubmit = async () => {
    console.log(inputs.value);
};

const onDelete = async () => {};

// watch(inputs.value, (newValue, oldValue) => {
//   console.log('myObject changed!')
//   console.log('New value:', newValue)
//   console.log('Old value:', oldValue)
// })

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
