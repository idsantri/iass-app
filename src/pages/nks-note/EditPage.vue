<template lang="">
    <q-card flat bordered style="max-width: 1024px">
        <SectionHeader title="Catatan NKS" :show-reload="false"> </SectionHeader>

        <NksNoteForm
            :data="state.note"
            @successDelete="$router.back()"
            @successSubmit="$router.back()"
        />
    </q-card>
</template>
<script setup>
import NksNoteForm from '@/components/forms/NksNoteForm.vue';
import SectionHeader from '@/components/SectionHeader.vue';
const state = history.state;
</script>
<style lang=""></style>
