<template lang="">
    <q-card flat bordered class="bg-transparent">
        <q-btn-dropdown flat dropdown-icon="more_vert" class="q-px-sm" color="">
            <q-btn
                no-caps
                label="Reload"
                flat
                icon="sync"
                v-close-popup
                class="block"
                @click="$emit('reload')"
                :disable="disableReload"
            />
            <q-separator />
            <q-btn
                no-caps
                label="Setting"
                flat
                icon="toc"
                :to="'/settings/lists/' + routeTo"
                v-close-popup
                class="block"
                :disable="disableRoute"
                v-if="routeTo"
            />
        </q-btn-dropdown>
    </q-card>
</template>
<script setup>
defineProps({
    routeTo: {
        type: String,
    },
    disableRoute: {
        type: Boolean,
        default: false,
    },
    disableReload: {
        type: Boolean,
        default: false,
    },
});
</script>
<style lang=""></style>
