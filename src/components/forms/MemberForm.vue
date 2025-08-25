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
          <q-carousel-slide :name="carousel.identitas.button" class="no-padding">
            <div class="text-subtitle1">
              {{ carousel.identitas.title }}
            </div>
            <QSeparator class="q-my-sm" />
            <MemberIdentity v-model="inputs" />
          </q-carousel-slide>

          <!-- alamat -->
          <q-carousel-slide :name="carousel.alamat.button" class="no-padding">
            <div class="text-subtitle1">
              {{ carousel.alamat.title }}
            </div>
            <QSeparator class="q-my-sm" />
            <div>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Pariatur perspiciatis
              placeat nesciunt quos ratione rem temporibus minima harum a. Soluta praesentium quasi
              quo nesciunt corrupti, aliquid magnam enim odit sunt.
            </div>
          </q-carousel-slide>

          <!-- lain-lain -->
          <q-carousel-slide :name="carousel.iass.button" class="no-padding">
            <div class="text-subtitle1">
              {{ carousel.iass.title }}
            </div>
            <QSeparator class="q-my-sm" />
            <div>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Pariatur perspiciatis
              placeat nesciunt quos ratione rem temporibus minima harum a. Soluta praesentium quasi
              quo nesciunt corrupti, aliquid magnam enim odit sunt.
            </div>
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
import { onMounted, ref, watch } from 'vue'
import FormActions from './slices/FormActions.vue'
import FormHeader from './slices/FormHeader.vue'
import MemberIdentity from './slices/MemberIdentity.vue'

const props = defineProps({
  data: { type: Object, required: false, default: () => {} },
})

const _emit = defineEmits(['successDelete', 'successSubmit', 'successUpdate', 'successCreate'])

const inputs = ref({})
const _loadingCrud = ref(false)

onMounted(async () => {
  Object.assign(inputs.value, props.data)
})

const onSubmit = async () => {}

const onDelete = async () => {}

watch(inputs.value, (newValue, oldValue) => {
  console.log('myObject changed!')
  console.log('New value:', newValue)
  console.log('Old value:', oldValue)
})

const carousel = {
  identitas: {
    title: 'Identitas Diri',
    button: '1',
  },
  alamat: {
    title: 'Data Alamat',
    button: '2',
  },
  iass: {
    title: 'Data IASS',
    button: '3',
  },
}
const slide = ref(carousel.identitas.button)
const toggleOptions = [
  {
    label: carousel.identitas.button,
    value: carousel.identitas.button,
  },
  {
    label: carousel.alamat.button,
    value: carousel.alamat.button,
  },
  {
    label: carousel.iass.button,
    value: carousel.iass.button,
  },
]
</script>
