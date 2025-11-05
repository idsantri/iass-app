<template lang="">
    <q-card flat bordered>
        <CardHeader title="Catatan Kegiatan" :show-reload="false"> </CardHeader>
        <q-card-section class="q-pa-sm" style="max-width: 1024px">
            <QCard flat bordered>
                <QCardSection class="q-px-md q-py-sm text-center bg-orange-1">
                    <ActivityHeader :activity="activity" :scope="scope" />
                </QCardSection>
                <ActivityNoteForm
                    :dataInputs="note"
                    :scope="scope"
                    @successDelete="$router.back()"
                    @successSubmit="$router.back()"
                />
            </QCard>
        </q-card-section>
    </q-card>
</template>
<script setup>
import CardHeader from '@/components/cards/CardHeader.vue';
import ActivityNoteForm from '@/components/forms/ActivityNoteForm.vue';
import ActivityHeader from '../activities/ActivityHeader.vue';

const { note, activity, scope } = history.state;
// console.log('🚀 ~ scope:', scope);
// console.log('🚀 ~ activity:', activity);
// console.log('🚀 ~ note:', note);
</script>
<style lang=""></style>
