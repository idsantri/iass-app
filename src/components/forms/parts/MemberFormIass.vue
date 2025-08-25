<template>
  <q-card bordered flat class="q-px-sm q-my-sm bg-transparent flex items-center">
    <div class="q-mr-md text-caption">Keanggotaan</div>
    <q-toggle
      v-model="inputs.iass"
      color="orange"
      :true-value="1"
      :false-value="0"
      :label="inputs.iass ? 'IASS' : 'Sidogirian'"
    />
  </q-card>
  <q-input
    dense
    hint=""
    class="q-my-sm"
    outlined
    label="Tahun Berhenti (Masehi)"
    v-model="inputs.th_berhenti"
    :disable="!inputs.iass"
    :rules="[(val) => !val || (val?.length == 4 && !isNaN(val)) || '4 digit angka!']"
    error-color="negative"
  />
  <q-input
    dense
    hint=""
    class="q-my-sm"
    outlined
    label="Wilayah"
    v-model="inputs.wilayah"
    disable
  />
  <q-input dense hint="" class="q-my-sm" outlined label="Komisariat" v-model="inputs.komisariat" />
  <q-input
    dense
    class="q-my-sm"
    outlined
    label="Kelompok"
    v-model="inputs.kelompok"
    hint="Kelompok koordinasi desa"
  />
</template>

<script setup>
import { watch } from 'vue'

const inputs = defineModel()
watch(
  () => inputs.value.iass,
  (n, _o) => {
    if (!n) {
      inputs.value.th_berhenti = ''
    }
  },
)
</script>
