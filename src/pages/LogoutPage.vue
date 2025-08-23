<template>
  <div></div>
</template>

<script setup>
import auth from '@/models/auth'
import { notifyConfirm } from '@/utils/notify'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

onMounted(async () => {
  const isConfirmed = await notifyConfirm('Keluar dari akun?')
  if (!isConfirmed) {
    router.go(-1)
  } else {
    await auth.logout()
    router.push('/login')
  }
})
</script>
