<template>
  <h1>Login Page</h1>
  <q-btn @click="onLogin">Login</q-btn>
</template>
<script setup>
import auth from '@/models/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const onLogin = async () => {
  await auth.login({ login: 'admin', password: '112233' })
  // console.log('login')
  router.push('/')
}
</script>
