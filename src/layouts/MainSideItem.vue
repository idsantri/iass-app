<template lang="">
    <q-item-label header class="q-px-md q-pt-sm q-pb-none">
        {{ title }}
    </q-item-label>
    <template v-for="(item, index) in data" :key="index">
        <q-item
            clickable
            :active="item.label === 'Outbox'"
            v-ripple
            :to="item.route"
            :disable="item.disable"
        >
            <q-item-section avatar class="">
                <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>
                <q-item-label>{{ item.label }}</q-item-label>
                <q-item-label caption v-if="item.caption">
                    {{ item.caption }}
                </q-item-label>
            </q-item-section>
        </q-item>
    </template>
</template>
<script setup>
defineProps({
    data: Array,
    title: String,
});
</script>
<style lang=""></style>
