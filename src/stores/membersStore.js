import { defineStore } from 'pinia';

export default defineStore('members', {
    state: () => ({
        members: [],
        filterKomisariat: '',
        filterStatus: 'active',
    }),

    /**
     * TODO:
     * remove console.log in getters
     */
    getters: {
        filteredMembers: (state) => {
            // First filter by komisariat
            const filteredByKomisariat = state.filterKomisariat
                ? state.members.filter(
                      (item) =>
                          item.komisariat?.toLowerCase() === state.filterKomisariat?.toLowerCase(),
                  )
                : state.members;
            console.log('komisariat', state.filterKomisariat, filteredByKomisariat);

            // Then filter by status
            const filterByStatus = filteredByKomisariat.filter((item) => {
                if (state.filterStatus === 'all') return true;
                if (state.filterStatus === 'active')
                    return item.status_max?.toLowerCase() === 'aktif';
                if (state.filterStatus === 'non-active')
                    return item.status_max?.toLowerCase() !== 'aktif';
                return true;
            });
            console.log('status', state.filterStatus, filterByStatus);
            return filterByStatus;
        },

        komisariatOptions: (state) => {
            const _set = new Set();
            state.members.forEach((item) => {
                if (item.komisariat) {
                    _set.add(item.komisariat);
                }
            });
            return Array.from(_set).sort((a, b) => a.localeCompare(b));
        },
    },

    actions: {
        setMembers(members) {
            this.members = members;
        },
        setKomisariat(value) {
            this.filterKomisariat = value;
        },
        setStatus(value) {
            this.filterStatus = value;
        },
    },
    persist: {
        storage: sessionStorage,
    },
});
