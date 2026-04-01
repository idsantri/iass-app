import Account from '@/models/Account';
import ArrayCrud from '@/models/ArrayCrud';
import { defineStore } from 'pinia';

export const useAccountsStore = defineStore('accounts', {
    state: () => ({
        accounts: [],
        isLoading: false,
    }),
    getters: {},
    actions: {
        async loadData({ lingkup, active = null }) {
            const params = { lingkup };
            if (active !== null) params.active = active;

            try {
                this.isLoading = true;
                const data = await Account.getAll(params);

                this.accounts = this.accounts.filter(
                    (a) => a.lingkup.toLowerCase() !== lingkup.toLowerCase(),
                );
                data.accounts?.forEach((account) => {
                    this.accounts = ArrayCrud.create(this.accounts, account);
                });

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
