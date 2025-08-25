<template>
  <QCard flat bordered>
    <SectionHeader title="Detail Anggota" @on-reload="loadData"> </SectionHeader>

    <q-spinner-cube
      v-if="loading"
      color="orange-12"
      size="14em"
      class="flex flex-center q-ma-md q-mx-auto"
    />

    <QCardSection v-else class="q-pa-sm">
      <AnggotaDetailIdentity :anggota="anggota" />
      <AnggotaDetailStatus :statuses="anggota?.statuses" />
    </QCardSection>
    <!-- <pre>
      {{ anggota }}
    </pre> -->
  </QCard>
</template>
<script setup>
import Member from '@/models/Member'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import SectionHeader from '@/components/SectionHeader.vue'
import AnggotaDetailIdentity from './comp/DetailIdentity.vue'
import AnggotaDetailStatus from './comp/DetailStatus.vue'

const route = useRoute()
const id = route.params.id
const loading = ref(false)
const anggota = ref({})

async function loadData(id) {
  loading.value = true
  try {
    const res = await Member.getById(id)
    anggota.value = res.member
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
