<template lang="">
    <q-card id="qr">
        <q-card-section class="flex flex-center q-mx-xl q-mb-none q-mt-md">
            <!-- <q-avatar
                size="150px"
                class="text-center tw:ring-4 tw:ring-orange-300/75  tw:m-2">
                <q-img
                    :src="member?.avatar_url || '/user-default.png'"
                    fit="cover"
                    ratio="1"
                    width="200px"
                />
            </q-avatar> -->
        </q-card-section>
        <q-card-section class="flex flex-center q-mx-xl q-my-none">
            <qrcode-vue :value="member.id.toString()" :size="200" level="H" render-as="svg" />
        </q-card-section>
        <q-card-section class="no-padding tw:text-center tw:text-xl tw:font-mono tw:font-bold">
            {{ member.id }}
        </q-card-section>

        <q-card-section class="text-center bg-orange-3 q-mt-md">
            <div class="tw:text-xl">
                {{ member.nama?.toUpperCase() }}
            </div>
            <div class="tw:text-xl tw:font-light">
                    {{ member.komisariat }} | {{ member.kelompok }}
            </div>
        </q-card-section>
    </q-card>
</template>

<script setup>
import { domToPng } from 'modern-screenshot';
import QrcodeVue from 'qrcode.vue'
import { onMounted, nextTick } from 'vue';

defineProps({
    member: {
        type: Object,
        required: true,
    },
});


onMounted(async () => {
    await nextTick();

    setTimeout(async () => {
        const dataUrl = await domToPng(document.querySelector('#qr'));
        const link = document.createElement('a');
        link.download = 'screenshot.png';
        link.href = dataUrl;
        link.click();
    }, 250);
});
</script>

<style lang="">
</style>
