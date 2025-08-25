<template>
    <div
        data-testid="loading"
        class="tw:fixed tw:inset-0 tw:z-[1000] tw:flex tw:items-center tw:justify-center"
    >
        <!-- Background blur -->
        <div class="tw:absolute tw:inset-0 tw:backdrop-blur-[1px] tw:bg-orange-200/30"></div>

        <!-- Konten loading -->
        <div
            class="tw:min-w-sm tw:relative tw:flex tw:flex-col tw:items-center tw:justify-center tw:p-6 tw:rounded-xl tw:shadow-lg tw:bg-orange-300/50 tw:backdrop-saturate-150 tw:backdrop-contrast-125"
        >
            <!-- Bola animasi -->
            <div class="tw:flex tw:items-center tw:justify-center tw:gap-x-3">
                <div
                    class="tw:w-6 tw:h-6 tw:bg-[#ffc3a0] tw:rounded-full tw:animate-bounce [tw:animation-delay:0.1s]"
                ></div>
                <div
                    class="tw:w-6 tw:h-6 tw:bg-[#ff9354] tw:rounded-full tw:animate-bounce [tw:animation-delay:0.3s]"
                ></div>
                <div
                    class="tw:w-6 tw:h-6 tw:bg-[#ff5e00] tw:rounded-full tw:animate-bounce [tw:animation-delay:0.5s]"
                ></div>
            </div>

            <!-- Pesan teks -->
            <div
                class="tw:w-full tw:text-center tw:mt-4 tw:px-8 tw:py-4 tw:rounded-md tw:text-sm tw:font-medium tw:text-orange-900 tw:bg-orange-100/80 tw:shadow tw:shadow-orange-800/50 tw:border tw:border-orange-600/50"
            >
                {{ message }}
            </div>
        </div>
    </div>
</template>

<script setup>
/**
 * @description parent must be relative position
 */
defineProps({
    message: {
        type: String,
        default: 'Tunggu sebentar, sedang memuat data …',
    },
});
</script>
