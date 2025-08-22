<script setup>
import auth from '@/models/auth'

const login = () => {
  auth
    .login({ login: 'admin', password: '112233' })
    .then((res) => console.log(res))
    .catch((err) => console.log(err))
}

const logout = () => {
  auth.logout()
}
</script>

<template>
  <main>
    <QBtn label="Click Me" glossy="" class="text-red" @click="login" />
    <QBtn label="logout" glossy="" class="text-red" @click="logout" />
    <h1 class="tw:text-sm">Home</h1>
    <h1 class="tw:text-red-600 tw:text-2xl">rumah</h1>
    <div class="tw:p-4 tw:flex tw:gap-4">
      <p class="tw:bg-green-500 tw:p-4 tw:rounded-lg">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit aperiam eveniet libero
        deleniti dolore! Soluta incidunt aliquam obcaecati, temporibus repudiandae necessitatibus
        qui repellendus numquam voluptate architecto excepturi mollitia cum illo!
      </p>
      <p class="bg-green-5 tw:p-4 rounded-lg">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit aperiam eveniet libero
        deleniti dolore! Soluta incidunt aliquam obcaecati, temporibus repudiandae necessitatibus
        qui repellendus numquam voluptate architecto excepturi mollitia cum illo!
      </p>
    </div>
    <!-- <TheWelcome /> -->
  </main>
</template>
