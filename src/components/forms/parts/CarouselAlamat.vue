<template lang="">
  <q-select
    dense
    hint=""
    class="q-mt-sm"
    outlined
    label="Provinsi"
    emit-value
    map-options
    v-model="input.provinsi"
    :options="listsProvinsi"
    :loading="loadingProvinsi"
    behavior="menu"
    clearable
  >
    <template v-slot:after>
      <DropDown @sync-click="fetchProvinsi()" @route-click="$emit('emitRoute')" />
    </template>
  </q-select>

  <q-select
    dense
    hint=""
    class="q-mt-sm"
    outlined
    label="Kabupaten/Kota"
    emit-value
    map-options
    v-model="input.kabupaten"
    :options="listsKabupaten"
    :loading="loadingKabupaten"
    behavior="menu"
    clearable
  >
    <template v-slot:after>
      <DropDown @sync-click="fetchKabupaten(input.provinsi)" @route-click="$emit('emitRoute')" />
    </template>
  </q-select>

  <q-select
    dense
    hint=""
    class="q-mt-sm"
    outlined
    label="Kecamatan"
    emit-value
    map-options
    v-model="input.kecamatan"
    :options="listsKecamatan"
    :loading="loadingKecamatan"
    behavior="menu"
    clearable
  >
    <template v-slot:after>
      <DropDown
        @sync-click="fetchKecamatan(input.provinsi, input.kabupaten)"
        @route-click="$emit('emitRoute')"
      />
    </template>
  </q-select>

  <q-select
    dense
    hint=""
    class="q-mt-sm"
    outlined
    label="Desa/Keluarahan"
    emit-value
    map-options
    v-model="input.desa"
    :options="listsDesa"
    :loading="loadingDesa"
    use-input=""
    new-value-mode="add"
    behavior="menu"
    clearable
  >
    <template v-slot:after>
      <DropDown
        @sync-click="fetchDesa(input.provinsi, input.kabupaten, input.kecamatan)"
        @route-click="$emit('emitRoute')"
      />
    </template>
  </q-select>

  <div class="row">
    <q-input
      dense
      hint=""
      class="q-mt-sm col q-mr-sm"
      outlined
      label="RT"
      v-model="input.rt"
      type="number"
    />

    <q-input
      dense
      hint=""
      class="q-mt-sm col q-ml-sm"
      outlined
      label="RW"
      v-model="input.rw"
      type="number"
    />
  </div>

  <q-input
    dense
    hint="Dusun, kampung, jalan, gang, nomor rumah ..."
    class="q-mt-sm"
    outlined
    label="Dusun"
    v-model="input.jl"
    autogrow=""
  />

  <q-input
    dense
    hint=""
    class="q-mt-sm"
    outlined
    label="Kode Pos"
    v-model="input.kode_pos"
    :rules="[(val) => !val || (val?.length == 5 && !isNaN(val)) || '5 digit angka!']"
    error-color="negative"
  />
</template>
<script setup>
/**
 * @example
<carousel-alamat
	@emit-input="(val) => Object.assign(santri, val)"
	@emit-route="closeModal"
	:data="santri"
	/>
 */
import { onMounted, ref, watch, watchEffect } from 'vue'
import alamatStore from 'src/stores/alamat-store'
import apiGet from 'src/api/api-get'
import DropDown from './CarouselAlamatDropDown.vue'

const props = defineProps({
  data: { type: Object },
})
const emit = defineEmits(['emitInput', 'emitRoute'])

const alamat = alamatStore()
const input = ref({})
const listsProvinsi = ref([])
const listsKabupaten = ref([])
const listsKecamatan = ref([])
const listsDesa = ref([])
const loadingProvinsi = ref(false)
const loadingKabupaten = ref(false)
const loadingKecamatan = ref(false)
const loadingDesa = ref(false)

onMounted(async () => {
  Object.assign(input.value, props.data)
  await checkProvinsi()
  if (input.value.provinsi) {
    await checkKabupaten(input.value.provinsi)
  }
  if (input.value.provinsi && input.value.kabupaten) {
    await checkKecamatan(input.value.provinsi, input.value.kabupaten)
  }
  if (input.value.provinsi && input.value.kabupaten && input.value.kecamatan) {
    await checkDesa(input.value.provinsi, input.value.kabupaten, input.value.kecamatan)
  }
})

function arrayAlamat(arr, alamat) {
  if (!Array.isArray(arr) || !alamat) {
    return []
  }
  const result = arr.map((i) => {
    return i[alamat]
  })
  return result.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
}

async function fetchProvinsi() {
  listsProvinsi.value = []

  const data = await apiGet({ endPoint: 'alamat', loading: loadingProvinsi })
  if (data) {
    alamat.setProvinsi(data.provinsi)
    const provinsi = alamat.getProvinsi()
    listsProvinsi.value = arrayAlamat(provinsi, 'provinsi')
  }
}

async function checkProvinsi() {
  listsProvinsi.value = []
  const provinsi = alamat.getProvinsi()
  if (provinsi?.length > 0) {
    listsProvinsi.value = arrayAlamat(provinsi, 'provinsi')
  } else {
    await fetchProvinsi()
  }
}

async function fetchKabupaten(provinsi_name) {
  listsKabupaten.value = []
  if (!provinsi_name) return

  const data = await apiGet({
    endPoint: 'alamat',
    loading: loadingKabupaten,
    params: { provinsi: provinsi_name },
  })
  if (data) {
    alamat.setKabupaten(data.kabupaten, { provinsi_name })
    const kabupaten = alamat.getKabupaten({ provinsi_name })
    listsKabupaten.value = arrayAlamat(kabupaten, 'kabupaten')
  }
}

async function checkKabupaten(provinsi_name) {
  listsKabupaten.value = []
  if (!provinsi_name) return

  const kabupaten = alamat.getKabupaten({ provinsi_name })
  if (kabupaten?.length > 0) {
    listsKabupaten.value = arrayAlamat(kabupaten, 'kabupaten')
  } else {
    await fetchKabupaten(provinsi_name)
  }
}

async function fetchKecamatan(provinsi_name, kabupaten_name) {
  listsKecamatan.value = []
  if (!provinsi_name || !kabupaten_name) return

  const data = await apiGet({
    endPoint: 'alamat',
    loading: loadingKecamatan,
    params: { provinsi: provinsi_name, kabupaten: kabupaten_name },
  })
  if (data) {
    alamat.setKecamatan(data.kecamatan, { provinsi_name, kabupaten_name })
    const kecamatan = alamat.getKecamatan({
      provinsi_name,
      kabupaten_name,
    })
    listsKecamatan.value = arrayAlamat(kecamatan, 'kecamatan')
  }
}

async function checkKecamatan(provinsi_name, kabupaten_name) {
  listsKecamatan.value = []
  if (!provinsi_name || !kabupaten_name) return

  const kecamatan = alamat.getKecamatan({ provinsi_name, kabupaten_name })
  if (kecamatan?.length > 0) {
    listsKecamatan.value = arrayAlamat(kecamatan, 'kecamatan')
  } else {
    await fetchKecamatan(provinsi_name, kabupaten_name)
  }
}

async function fetchDesa(provinsi_name, kabupaten_name, kecamatan_name) {
  listsDesa.value = []
  if (!provinsi_name || !kabupaten_name || !kecamatan_name) return

  const data = await apiGet({
    endPoint: 'alamat',
    loading: loadingDesa,
    params: {
      provinsi: provinsi_name,
      kabupaten: kabupaten_name,
      kecamatan: kecamatan_name,
    },
  })
  if (data) {
    alamat.setDesa(data.desa, {
      provinsi_name,
      kabupaten_name,
      kecamatan_name,
    })
    const desa = alamat.getDesa({
      provinsi_name,
      kabupaten_name,
      kecamatan_name,
    })
    listsDesa.value = arrayAlamat(desa, 'desa')
  }
}

async function checkDesa(provinsi_name, kabupaten_name, kecamatan_name) {
  listsDesa.value = []
  if (!provinsi_name || !kabupaten_name || !kecamatan_name) return

  const desa = alamat.getDesa({
    provinsi_name,
    kabupaten_name,
    kecamatan_name,
  })
  if (desa?.length > 0) {
    listsDesa.value = arrayAlamat(desa, 'desa')
  } else {
    await fetchDesa(provinsi_name, kabupaten_name, kecamatan_name)
  }
}

watchEffect(() => {
  emit('emitInput', input.value)
})

watch(
  () => input.value.provinsi,
  async (newProvinsi, oldProvinsi) => {
    if (newProvinsi != oldProvinsi && typeof oldProvinsi != 'undefined') {
      input.value.kabupaten = ''
      input.value.kecamatan = ''
      input.value.desa = ''
      await checkKabupaten(newProvinsi)
    }
  },
)

watch(
  () => input.value.kabupaten,
  async (newValue, oldValue) => {
    if (newValue != oldValue && typeof oldValue != 'undefined') {
      input.value.kecamatan = ''
      input.value.desa = ''
      await checkKecamatan(input.value.provinsi, newValue)
    }
  },
)

watch(
  () => input.value.kecamatan,
  async (newValue, oldValue) => {
    if (newValue != oldValue && typeof oldValue != 'undefined') {
      input.value.desa = ''
      await checkDesa(input.value.provinsi, input.value.kabupaten, newValue)
    }
  },
)
</script>

<style lang=""></style>
