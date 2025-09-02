<script setup>
import { ref, computed } from 'vue';

/**
 * -----------------------------------------
 * PWA
 * -----------------------------------------
 */

const getOS = () => {
    const userAgent = window.navigator.userAgent;
    const osList = [
        { regex: /windows/i, name: 'Windows' },
        { regex: /android/i, name: 'Android' },
        { regex: /(iphone|ipad|ipod)/i, name: 'iOS' },
        { regex: /linux/i, name: 'Linux' },
        { regex: /mac/i, name: 'Mac/iOS' },
    ];

    return osList.find(({ regex }) => regex.test(userAgent))?.name || 'Unknown OS';
};
const isIos = () => getOS() === 'iOS';
const isAndroid = () => getOS() === 'Android';
const isMobile = () => isIos() || isAndroid();
const showIosComp = ref(false);
const deferredPrompt = ref(null);
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt.value = e;
});

const isPwaInstalled = ref(window.matchMedia('(display-mode: standalone)').matches);
const showInstallBanner = computed(() => !isPwaInstalled.value && isMobile());

const installPwa = () => {
    if (deferredPrompt.value) {
        deferredPrompt.value.prompt();
        deferredPrompt.value.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
        });
        // reset
        deferredPrompt.value = null;
    }
};
</script>

<template>
    <div v-if="showInstallBanner">
        <QList class="q-mb-md bg-orange-1 rounded-borders" bordered>
            <QItem class="">
                <q-item-section>
                    <q-item-label>
                        Instal aplikasi untuk mendapatkan pengalaman lebih baik!
                    </q-item-label>
                </q-item-section>
                <q-item-section side>
                    <QBtn
                        v-if="isAndroid()"
                        class="px-2 text-orange-1"
                        color="orange-10"
                        @click="installPwa"
                        no-caps
                        icon="install_mobile"
                    >
                        Instal
                    </QBtn>
                    <QBtn
                        v-if="isIos()"
                        class="px-2 text-orange-1"
                        color="orange-10"
                        @click="showIosComp = !showIosComp"
                        no-caps
                        icon="install_mobile"
                    >
                        Instal
                    </QBtn>
                </q-item-section>
            </QItem>
            <template v-if="showIosComp">
                <QSeparator />
                <q-item>
                    <q-item-section>
                        <p class="text-subtitle2 no-margin">Bagi Pengguna iOS!</p>
                        <ul
                            class="tw:ml-4 tw:text-sm tw:font-light tw:list-decimal tw:list-outside"
                        >
                            <li>
                                Pastikan Anda menggunakan browser
                                <span class="tw:font-semibold">Safari</span>;
                            </li>
                            <li>
                                Ketuk ikon bagikan (sebuah kotak dengan panah ke atas di bagian
                                bawah layar);
                            </li>
                            <li>
                                Gulir ke bawah dalam menu bagikan dan pilih opsi &ldquo;Tambahkan ke
                                Layar Utama&rdquo;;
                            </li>
                            <li>
                                Anda mungkin akan diminta untuk memberikan nama dan mengonfigurasi
                                ikon;
                            </li>
                            <li>
                                Ketuk &ldquo;Tambahkan&rdquo; di pojok kanan atas layar untuk
                                menyelesaikan proses;
                            </li>
                        </ul>
                    </q-item-section>
                </q-item>
            </template>
        </QList>
    </div>
</template>

<style scoped></style>
