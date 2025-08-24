<template>
  <QCard flat bordered>
    <SectionHeader title="Detail Anggota" @on-reload="loadData">
      <template #left>
        <QBtn
          dense
          label="Edit"
          outline=""
          icon="edit"
          no-caps
          class="q-px-md q-mr-sm text-orange-1"
        />
      </template>
    </SectionHeader>
    <q-spinner-cube
      v-if="loading"
      color="orange-12"
      size="14em"
      class="flex flex-center q-ma-md q-mx-auto"
    />

    <QCardSection v-else class="q-pa-sm">
      <div class="q-pa-sm bg-orange-1 q-mb-sm">Data Diri</div>
      <QMarkupTable flat bordered>
        <tbody>
          <tr>
            <td>ID IASS</td>
            <td class="flex items-center justify-between">
              <span>{{ anggota.id }}</span>
              <span>{{ anggota.th_berhenti }}</span>
            </td>
          </tr>
          <tr>
            <td>Nama</td>
            <td>{{ anggota.nama }}</td>
          </tr>
          <tr>
            <td>Kelahiran</td>
            <td>{{ anggota.tmp_lahir }}, {{ formatDate(anggota.tgl_lahir, 'dd MMMM yyyy') }}</td>
          </tr>
          <tr>
            <td>Alamat Lengkap</td>
            <td>{{ anggota.alamat_lengkap }}</td>
          </tr>
          <tr>
            <td>Keanggotaan</td>
            <td>
              {{ anggota.keanggotaan }} (<span class="text-weight-bold">{{
                anggota.status_max
              }}</span
              >)
            </td>
          </tr>
          <tr>
            <td>Komisariat</td>
            <td>{{ anggota.komisariat }}</td>
          </tr>
          <tr>
            <td>Kelompok Desa</td>
            <td>{{ anggota.kelompok }}</td>
          </tr>
          <tr>
            <td>Nomor HP</td>
            <td>{{ anggota.no_hp }}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{{ anggota.email }}</td>
          </tr>
        </tbody>
      </QMarkupTable>
      <div class="q-pa-sm bg-orange-1 q-mt-sm">Status</div>
    </QCardSection>
    <!-- <pre>
      {{ anggota }}
    </pre> -->
  </QCard>
</template>
<script setup>
import Anggota from '@/models/Anggota'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import SectionHeader from '@/components/SectionHeader.vue'
import formatDate from '@/utils/format-date'

const route = useRoute()
const id = route.params.id
const loading = ref(false)
const anggota = ref({})

async function loadData(id) {
  loading.value = true
  try {
    const res = await Anggota.getById(id)
    anggota.value = res.anggota
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (id) await loadData(id)
})
</script>
<style scoped>
td {
  white-space: normal;
  word-wrap: break-word;
}
</style>
