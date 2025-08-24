<template>
  <q-card flat bordered>
    <QCardSection class="flex items-center justify-between bg-orange-1 q-pa-sm">
      <div class="tw:text-2xl">Data Anggota</div>
      <QSelect
        outlined
        v-model="filter"
        :options="optionsKomisariat"
        label="Filter Komisariat"
        class="full-width q-my-sm"
        behavior="menu"
        clearable=""
        style="max-width: 400px"
        dense
      />
    </QCardSection>
    <q-card-section>
      <q-spinner-cube
        v-if="isLoading"
        color="orange-12"
        size="14em"
        class="flex flex-center q-mx-auto"
      />
      <DataTable v-else class="display" :options="optionsDT" :data="filteredData" ref="table" />
    </q-card-section>
  </q-card>
</template>

<script setup>
import 'datatables.net-select-dt'

import { onMounted, ref, computed } from 'vue'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-dt'
import { useRouter } from 'vue-router'
import Anggota from '@/models/Anggota'

const table = ref(null)
const isLoading = ref(false)
const anggota = ref([])
const router = useRouter()
const filter = ref('')
DataTable.use(DataTablesCore)

const filteredData = computed(() => {
  if (!filter.value) {
    return anggota.value
  }
  return anggota.value.filter((item) => item.komisariat == filter.value)
})

async function loadData() {
  isLoading.value = true
  const data = await Anggota.getAll()
  if (data) {
    anggota.value = data.anggota
  }
  isLoading.value = false
}

const optionsKomisariat = computed(() => {
  const komSet = new Set()
  anggota.value.forEach((item) => {
    if (item.komisariat) {
      komSet.add(item.komisariat)
    }
  })
  return Array.from(komSet).sort((a, b) => a.localeCompare(b))
})

const optionsDT = ref({
  responsive: true,
  order: [],
  select: {
    style: 'single',
    info: false,
  },
  columns: [
    {
      title: 'ID',
      data: 'id',
    },
    {
      title: 'Nama',
      data: 'nama',
    },
    {
      title: 'Alamat',
      render: function (data, type, row) {
        return `${row.jl ?? ''} ${row.desa ?? ''} ${row.kecamatan ?? ''}`
      },
    },
    {
      title: 'Komisariat',
      data: 'komisariat',
    },
    {
      title: 'Kelompok',
      data: 'kelompok',
    },
    {
      title: 'status',
      data: 'status_max',
    },
    {
      title: 'Keanggotaan',
      data: 'iass',
      render: function (data, type, row) {
        return `${row.iass == true ? 'IASS' : 'Sidogirian'}`
      },
    },
  ],
  language: {
    search: 'Cari:',
    zeroRecords: 'Tidak data data untuk ditampilkan. Coba kata kunci yang lain!',
    info: 'Menampilkan _START_ hingga _END_, dari total _TOTAL_ data',
    infoFiltered: '(disaring dari _MAX_ total data)',
    paginate: { first: '↑', previous: '←', next: '→', last: '↓' },
    lengthMenu: '_MENU_ Perhalaman',
  },
  autoWidth: true,
  dom: 'bftip',
  scrollX: true,
})

onMounted(async () => {
  await loadData()

  if (table.value) {
    const dt = table.value.dt
    dt.on('select', (e, dt, type, indexes) => {
      const selectedData = dt.rows(indexes).data().toArray()
      if (selectedData.length > 0) {
        const selected = selectedData[0]
        router.push(`/anggota/${selected.id}`)
      }
    })
  }
})
</script>

<style lang="scss">
@import 'datatables.net-dt';
// @import 'datatables.net-select-dt';
@import 'datatables.net-responsive-dt';
</style>
