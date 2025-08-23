<template>
  <q-layout view="hHh Lpr lff">
    <MainHeader @onDrawer="drawer = !drawer" />

    <q-drawer
      v-model="drawer"
      show-if-above
      :width="250"
      :breakpoint="500"
      bordered
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    >
      <MainSideBar />
    </q-drawer>

    <q-page-container>
      <q-page class="q-pa-sm">
        <!-- START HERE -->
        <router-view />
      </q-page>
    </q-page-container>
    <MainFooter />
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import MainHeader from './MainHeader.vue'
import MainFooter from './MainFooter.vue'
import MainSideBar from './MainSideBar.vue'
const drawer = ref(false)
</script>
