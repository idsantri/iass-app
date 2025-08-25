<template lang="">
	<q-card flat bordered>
		<q-btn-dropdown flat dropdown-icon="more_vert" class="q-px-sm" color="">
			<q-btn
				no-caps
				label="Reload"
				flat
				icon="sync"
				v-close-popup
				class="block"
				@click="$emit('syncClick')"
			/>
			<q-separator />
			<q-btn
				no-caps
				label="Setting"
				flat
				icon="toc"
				to="/settings/alamat"
				v-close-popup
				class="block"
				@click="$emit('routeClick')"
			/>
		</q-btn-dropdown>
	</q-card>
</template>
<script setup></script>
<style lang=""></style>
