<template lang="">
    <strong> {{ activity.nama }}</strong> <br />
    <span class="text-caption"> Lingkup Kegiatan: {{ scope?.toUpperCase() }} </span>
    <br />
    Komisariat {{ activity.komisariat }}<br />
    <small>
        {{ formatDate(activity.tgl_m, 'cccc, dd MMMM yyyy') }} |
        {{ bacaHijri(activity.tgl_h) }}
    </small>
</template>
<script>
import { formatDate } from '@/utils/date-operation';
import { bacaHijri } from '@/utils/hijri';

export default {
    props: {
        activity: {
            type: Object,
            required: true,
        },
        scope: {
            type: String,
            required: true,
        },
    },
    setup() {
        return {
            formatDate,
            bacaHijri,
        };
    },
};
</script>
<style lang=""></style>
