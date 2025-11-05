<template>
    <QCard>
        <CardHeader title="Scan QR/Barcode" @on-reload="loadData"> </CardHeader>
        <q-card-section class="q-pa-sm" style="max-width: 600px">
            <QCard flat bordered>
                <LoadingFixed v-if="loading" />

                <QCardSection class="q-px-md q-py-sm text-center bg-orange-1">
                    <ActivityHeader :activity="activity" :scope="meta.scope" />
                </QCardSection>

                <QCard v-if="error" class="q-pa-sm text-center bg-red-1 text-red-10" flat bordered>
                    Terjadi kesalahan: <br />
                    {{ error }}
                </QCard>
                <q-card-section class="q-pa-sm">
                    <q-select
                        :options="constraintOptions"
                        v-model="selectedConstraints"
                        class=""
                        option-value="constraints"
                        emit-value
                        map-options
                        behavior="menu"
                        outlined
                        dense
                        label="Pilih Kamera"
                    />
                    <div v-if="!activity.locked" class="q-mt-sm">
                        <LoadingAbsolute v-if="loadingAbsence" />
                        <qrcode-stream
                            :key="cameraKey"
                            :constraints="selectedConstraints"
                            :track="paintBoundingBox"
                            :formats="['code_128', 'qr_code', 'linear_codes']"
                            @error="onError"
                            @detect="handleScan"
                            @camera-on="onCameraReady"
                        />
                    </div>
                    <div v-else class="q-mt-sm q-pa-lg text-center text-negative bg-orange-3">
                        Fitur dikunci oleh Admin!
                    </div>
                </q-card-section>
                <q-card-section class="q-pa-sm bg-orange-1 text-orange-10">
                    <div class="tw:text-xl tw:text-center">|| {{ result || '-' }} ||</div>
                </q-card-section>
            </QCard>
        </q-card-section>
    </QCard>
</template>

<script setup>
import CardHeader from '@/components/cards/CardHeader.vue';
import LoadingAbsolute from '@/components/LoadingAbsolute.vue';
import LoadingFixed from '@/components/LoadingFixed.vue';
import KomisariatAbsences from '@/models/KomisariatAbsences';
import KomisariatActivities from '@/models/KomisariatActivities';
import WilayahAbsences from '@/models/WilayahAbsences';
import WilayahActivities from '@/models/WilayahActivities';
import { onMounted, ref } from 'vue';
import { QrcodeStream } from 'vue-qrcode-reader';
import { useRoute } from 'vue-router';
import ActivityHeader from '@/pages/activities/ActivityHeader.vue';

const result = ref('');
const loading = ref(false);
const loadingAbsence = ref(false);
const error = ref('');
const { params, meta } = useRoute();
const activity = ref({});
const cameraKey = ref(0); // Key untuk memaksa render ulang
let modelActivity = null;
let modelAbsence = null;

onMounted(async () => {
    if (meta.scope == 'Komisariat') {
        modelActivity = KomisariatActivities;
        modelAbsence = KomisariatAbsences;
    }
    if (meta.scope == 'Wilayah') {
        modelActivity = WilayahActivities;
        modelAbsence = WilayahAbsences;
    }

    if (params.id) {
        await loadData();
    }
});

async function loadData() {
    try {
        loading.value = true;
        const res = await modelActivity.getById(params.id);
        activity.value = res.activity;
    } catch (e) {
        console.log('error get activity by id ', e);
    } finally {
        loading.value = false;
    }
}

const onHadir = async (member_id) => {
    try {
        loadingAbsence.value = true;
        await modelAbsence.setHadir({ activity_id: activity.value.id, member_id: member_id });
    } catch (error) {
        console.log('error hadir ', error);
    } finally {
        loadingAbsence.value = false;
    }
};

/*** detection handling ***/
async function handleScan(detectedCodes) {
    if (detectedCodes.length === 0) {
        return;
    }

    // Nonaktifkan pemindai untuk sementara waktu dengan mengubah key
    cameraKey.value++;

    const lastDetected = detectedCodes.map((code) => code.rawValue);
    result.value = lastDetected.slice(-1)[0];

    try {
        await onHadir(result.value);
    } catch (e) {
        console.log('Error processing scan:', e);
    } finally {
        // Setelah selesai, beri jeda dan aktifkan kembali
        setTimeout(() => {
            cameraKey.value++;
            result.value = '';
        }, 1000); // Jeda 1 detik
    }
}

/*** select camera ***/
const selectedConstraints = ref({ facingMode: 'environment' });
const defaultConstraintOptions = [
    { label: 'Kamera Belakang', constraints: { facingMode: 'environment' } },
    { label: 'Kamera Depan', constraints: { facingMode: 'user' } },
];
const constraintOptions = ref(defaultConstraintOptions);

async function onCameraReady() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(({ kind }) => kind === 'videoinput');

    constraintOptions.value = [
        ...defaultConstraintOptions,
        ...videoDevices.map(({ deviceId, label }) => ({
            label: `${label} (ID: ${deviceId})`,
            constraints: { deviceId },
        })),
    ];
    error.value = '';
}

/*** bounding box paint handling ***/
function paintBoundingBox(detectedCodes, ctx) {
    for (const detectedCode of detectedCodes) {
        const {
            boundingBox: { x, y, width, height },
        } = detectedCode;

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#007bff';
        ctx.strokeRect(x, y, width, height);
    }
}

/*** error handling ***/
function onError(err) {
    error.value = `[${err.name}]: `;
    if (err.name === 'NotAllowedError') {
        error.value += 'you need to grant camera access permission';
    } else if (err.name === 'NotFoundError') {
        error.value += 'no camera on this device';
    } else if (err.name === 'NotSupportedError') {
        error.value += 'secure context required (HTTPS, localhost)';
    } else if (err.name === 'NotReadableError') {
        error.value += 'is the camera already in use?';
    } else if (err.name === 'OverconstrainedError') {
        error.value += 'installed cameras are not suitable';
    } else if (err.name === 'StreamApiNotSupportedError') {
        error.value += 'Stream API is not supported in this browser';
    } else if (err.name === 'InsecureContextError') {
        error.value +=
            'Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.';
    } else {
        error.value += err.message;
    }
    console.log(error.value);
}
</script>

<style scoped></style>
