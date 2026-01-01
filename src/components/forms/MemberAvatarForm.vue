<template>
    <q-card style="width: 560px">
        <q-form @submit.prevent="cropAndUpload">
            <FormHeader title="Upload Foto" :is-new="false" />
            <LoadingAbsolute size="12em" v-if="uploading" />

            <input
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="onFileSelect"
                class="tw:hidden"
            />
            <q-card-section class="q-pa-sm">
                <div
                    v-if="previewUrl && !showCropper"
                    class="tw:relative tw:w-full tw:aspect-square tw:overflow-hidden tw:rounded-lg tw:group"
                >
                    <img
                        :src="previewUrl"
                        alt="Avatar"
                        class="tw:w-full tw:h-full tw:object-cover"
                    />

                    <button
                        type="button"
                        @click="selectFile"
                        class="tw:absolute tw:top-1/2 tw:left-1/2 tw:-translate-x-1/2 tw:-translate-y-1/2 tw:w-28 tw:h-28 tw:rounded-full tw:bg-orange-600/25 hover:tw:bg-black/70 tw:text-orange-100 tw:border-2 tw:border-white/75 tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-1 tw:transition-all tw:duration-300 tw:backdrop-blur-xs"
                    >
                        <QIcon name="sym_o_image_arrow_up" size="2.5em" />
                        <span class="tw:text-xs tw:font-medium">Pilih Gambar</span>
                    </button>
                </div>

                <Cropper
                    v-if="showCropper"
                    ref="cropper"
                    :src="selectedImage"
                    :stencil-props="{
                        aspectRatio: 1 / 1,
                    }"
                    class="tw:h-96 tw:max-h-[50vh]"
                />
            </q-card-section>
            <FormActions
                :btn-delete="true"
                icon-delete="sync"
                label-delete="Reset"
                @on-delete="showCropper = false"
            />
        </q-form>
    </q-card>
</template>

<script setup>
import Member from '@/models/Member';
import { nextTick, onMounted, ref } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import FormHeader from './parts/FormHeader.vue';
import FormActions from './parts/FormActions.vue';
import LoadingAbsolute from '../LoadingAbsolute.vue';
import { notifyError, notifyWarning } from '@/utils/notify';

const props = defineProps({
    memberId: {
        type: [String, Number],
        required: true,
    },
    memberAvatarUrl: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['upload-success', 'upload-error']);

const fileInput = ref(null);
const cropper = ref(null);
const selectedImage = ref(null);
const showCropper = ref(false);
const previewUrl = ref(props.memberAvatarUrl);
const uploading = ref(false);

function selectFile() {
    fileInput.value.click();
}

onMounted(async () => {
    await nextTick();
    selectFile();
});

const onFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
        notifyWarning('Harap pilih file gambar yang valid');
        return;
    }

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        notifyWarning('Ukuran file maksimal 5MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        selectedImage.value = e.target.result;
        showCropper.value = true;
    };
    reader.readAsDataURL(file);
};

const toBlob = async (inputCanvas) => {
    const maxSize = 1024;
    let canvas = inputCanvas;
    let width = canvas.width;
    let height = canvas.height;

    // Cek jika hasil crop lebih besar dari 1024
    if (width > maxSize || height > maxSize) {
        // Hitung aspect ratio baru
        if (width > height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
        } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
        }

        // Buat canvas baru untuk resize
        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = width;
        resizedCanvas.height = height;

        const ctx = resizedCanvas.getContext('2d');
        // Gambar ulang canvas crop ke canvas baru yang lebih kecil
        ctx.drawImage(inputCanvas, 0, 0, width, height);

        // Ganti canvas yang akan di-convert
        canvas = resizedCanvas;
    }

    // Convert ke Blob untuk upload
    const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.8);
    });

    // Kembalikan Blob dan Kanvas yang sudah final (di-resize atau original)
    return { blob, finalCanvas: canvas };
};

const cropAndUpload = async () => {
    if (!cropper.value) {
        notifyError('Gagal upload avatar. Silakan coba lagi.');
        return;
    }

    // Ambil hasil crop dari canvas original
    const { canvas } = cropper.value.getResult();
    if (!canvas) {
        notifyError('Gagal upload avatar. Silakan coba lagi. #2');
        return;
    }

    uploading.value = true;

    try {
        // LOGIKA RESIZE & CONVERT TO BLOB
        // Menerima BLOB dan finalCanvas (kanvas yang sudah di-resize)
        const { blob, finalCanvas } = await toBlob(canvas);

        // Proses Upload
        const formData = new FormData();
        formData.append('avatar', blob, 'avatar.jpg');

        const data = await Member.uploadAvatar(props.memberId, formData);

        previewUrl.value = finalCanvas.toDataURL('image/jpeg', 0.8);
        showCropper.value = false;
        emit('upload-success', data.member);
    } catch (error) {
        console.error('Upload error:', error);
        emit('upload-error', error);
    } finally {
        uploading.value = false;
    }
};
</script>
