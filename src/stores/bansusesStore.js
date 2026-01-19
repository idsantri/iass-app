import ArrayCrud from '@/models/ArrayCrud';
import Bansus from '@/models/Bansus';
import { defineStore } from 'pinia';

export const useBansusesStore = defineStore('bansuses', {
    state: () => ({
        bansuses: [],
        isLoading: false,
    }),
    getters: {
        bansusesFlattened: (state) => {
            return ArrayCrud.flattenNestedKey(state.bansuses, 'member');
        },
    },
    actions: {
        async loadData() {
            try {
                this.isLoading = true;
                const data = await Bansus.getAll();
                this.bansuses = data.bansuses;
                return data;
            } catch (e) {
                console.error('Error loading data:', e);
            } finally {
                this.isLoading = false;
            }
        },

        async loadById(id) {
            try {
                this.isLoading = true;
                const data = await Bansus.getById(id);
                this.bansuses = ArrayCrud.updateOrCreate(this.bansuses, data.bansus, 'id');
                return data;
            } catch (e) {
                console.error('Error loading data:', e);
            } finally {
                this.isLoading = false;
            }
        },
    },
    persist: {
        storage: sessionStorage,
    },
});
