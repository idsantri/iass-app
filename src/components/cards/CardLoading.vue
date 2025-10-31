<template lang="">
    <!-- <q-inner-loading :showing="showing" label="Please wait..." label-class="text-teal" label-style="font-size: 1.1em" /> -->

    <!-- 
		NOTE:
		- parent must be relative position (or the relative-position CSS class declared)
		- QInnerLoading must be the last element inside its parent so it can appear on top of the other content.
	-->
    <!-- <q-inner-loading :showing="showing" class="tw:flex tw:flex-col tw:items-center">
		<div>
			<q-spinner-puff size="8em" color="orange-14" />
			<div v-if="message" class="text-subtitle2 text-orange-10">{{ message }}</div>
		</div>
	</q-inner-loading> -->
    <div
        v-if="showing"
        class="tw:absolute tw:inset-0 tw:z-10 tw:flex tw:items-center tw:flex-col tw:justify-center tw:backdrop-blur-[1px] tw:bg-orange-100/25"
    >
        <q-spinner-puff size="8em" color="orange-14" />
        <div v-if="message" class="text-subtitle2 text-orange-10">{{ message }}</div>
    </div>
</template>
<script setup>
defineProps({
    showing: {
        type: Boolean,
        default: false,
    },
    message: {
        type: String,
        default: 'Tunggu sebentar …',
    },
});
</script>
<style lang=""></style>
