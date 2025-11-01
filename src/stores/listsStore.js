import { defineStore } from 'pinia';
import listData from '@/stores/lists-data';
import ArrayCrud from '@/models/ArrayCrud';

function organizeData(data) {
    const organizedData = {};
    data.forEach((item) => {
        organizedData[item.key] = [];
    });

    return organizedData;
}

export default defineStore('lists-input', {
    state: () => {
        return organizeData(listData);
        // return {
        // 	domisili: [],
        // 	'hubungan-wali': [],
        // };
    },

    getters: {
        listData: () => listData,
    },

    actions: {
        checkState(key) {
            // Check if the state property exists
            if (Object.prototype.hasOwnProperty.call(this.$state, key)) {
                // Property exists
                return true;
            } else {
                // Property doesn't exist
                return false;
            }
        },

        getStateByKey(key, sort) {
            const result = this[key];
            return ArrayCrud.sort(result, 'val0', sort);
        },

        getStateByKey_Arr(key, sort) {
            const result = this[key].map((v) => v.val0);
            return ArrayCrud.sortPrimitiveArray(result, sort);
        },
    },

    persist: {
        storage: localStorage,
    },
});
