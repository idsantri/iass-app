<template lang="">
    <q-page class="q-pa-sm">
        <q-card class="card-page-container" id="card-page-container">
            <slot></slot>
        </q-card>
    </q-page>
</template>

<script>
export default {
    props: {
        dynamicHeight: {
            type: Boolean,
            default: true, // default true
        },
    },
    mounted() {
        if (this.dynamicHeight) {
            this.setDynamicHeight();
        }
    },

    methods: {
        setDynamicHeight() {
            // Get elements
            const header = document.querySelector('header');
            const main = document.querySelector('main');
            const footer = document.querySelector('footer');
            const card = document.getElementById('card-page-container');

            if (!card) return;

            // Get heights and padding
            const headerHeight = header ? header.offsetHeight : 0;
            const footerHeight = footer ? footer.offsetHeight : 0;

            // Get padding-top + padding-bottom dari main
            const mainStyles = main ? getComputedStyle(main) : null;
            const mainPaddingY = mainStyles
                ? parseFloat(mainStyles.paddingTop) + parseFloat(mainStyles.paddingBottom)
                : 0;

            // Calculate total offset
            const totalOffset = headerHeight + footerHeight + mainPaddingY;

            // Set min-height
            card.style.minHeight = `calc(100vh - ${totalOffset}px)`;

            // Debug
            // console.log('Header:', headerHeight);
            // console.log('Footer:', footerHeight);
            // console.log('Main Padding Y:', mainPaddingY);
            // console.log('Total Offset:', totalOffset);
        },
    },
};
</script>

<style lang="scss" scoped>
.card-page-container {
    background-color: rgba(255, 253, 247, 0.877);
}
</style>
