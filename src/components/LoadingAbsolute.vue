<template>
    <div
        class="tw:absolute tw:inset-0 tw:z-10 tw:flex tw:items-center tw:justify-center tw:backdrop-blur-[1px] tw:bg-orange-100/25"
    >
        <!-- Spinner custom tanpa DaisyUI -->
        <!-- <div
      class="tw:w-[70px] tw:h-[70px] tw:border-[8px] tw:border-orange-200 tw:border-t-orange-500 tw:rounded-full tw:animate-spin"
    ></div> -->
        <q-spinner-tail color="orange" :size="size" />
    </div>
</template>

<script setup>
defineProps({
    size: {
        type: String,
        default: '6em',
    },
});
</script>
