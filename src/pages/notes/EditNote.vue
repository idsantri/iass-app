<template lang="">
    <q-card flat bordered style="max-width: 1024px">
        <CardHeader title="Catatan Kegiatan" :show-reload="false"> </CardHeader>
        <QCardSection class="q-px-md q-py-sm text-center bg-orange-1">
            <strong> {{ activity.nama }}</strong> <br />
            Lingkup Kegiatan: {{ scope }}<br />
            Komisariat {{ activity.komisariat }}<br />
            <small>
                {{ formatDate(activity.tgl_m, 'cccc, dd MMMM yyyy') }} |
                {{ bacaHijri(activity.tgl_h) }}
            </small>
        </QCardSection>
        <ActivityNoteForm
            :dataInputs="note"
            :scope="scope"
            @successDelete="$router.back()"
            @successSubmit="$router.back()"
        />
    </q-card>
</template>
<script setup>
import CardHeader from '@/components/cards/CardHeader.vue';
import ActivityNoteForm from '@/components/forms/ActivityNoteForm.vue';
import { formatDate } from '@/utils/date-operation';
import { bacaHijri } from '@/utils/hijri';

const { note, activity, scope } = history.state;
// console.log('🚀 ~ scope:', scope);
// console.log('🚀 ~ activity:', activity);
// console.log('🚀 ~ note:', note);
</script>
<style lang=""></style>
