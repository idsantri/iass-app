import { defineStore } from 'pinia';

export default defineStore('members', {
    state: () => ({
        members: [],
        filterKomisariat: '',
        filterStatus: 'active',
        filterAlamat: '',
        // DataTable pagination state
        datatablePagination: {
            displayStart: 0,
            pageLength: 10,
            currentPage: 1,
        },
    }),

    getters: {
        filteredMembers: (state) => {
            // First filter by komisariat
            const filteredByKomisariat = state.filterKomisariat
                ? state.members.filter(
                      (item) =>
                          item.komisariat?.toLowerCase() === state.filterKomisariat?.toLowerCase(),
                  )
                : state.members;
            // console.log('komisariat', state.filterKomisariat, filteredByKomisariat);

            // Then filter by status
            const filterByStatus = filteredByKomisariat.filter((item) => {
                if (state.filterStatus === 'all') return true;
                if (state.filterStatus === 'active')
                    return item.status_max?.toLowerCase() === 'aktif';
                if (state.filterStatus === 'non-active')
                    return item.status_max?.toLowerCase() !== 'aktif';
                return true;
            });
            // console.log('status', state.filterStatus, filterByStatus);
            const filterByAlamat = filterByStatus.filter((item) => {
                if (!state.filterAlamat) return true;
                const searchText = state.filterAlamat.toLowerCase();
                const alamat1 = item.alamat_singkat?.toLowerCase();
                const alamat2 = item.alamat_lengkap?.toLowerCase();
                return alamat1.includes(searchText) || alamat2.includes(searchText);
            });
            // console.log('alamat', state.filterAlamat, filterByAlamat);
            return filterByAlamat;
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

        // Getter untuk pagination state
        getPaginationState: (state) => state.datatablePagination,
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

        // Actions untuk DataTable pagination
        updatePagination(displayStart, pageLength) {
            const currentPage = Math.floor(displayStart / pageLength) + 1;
            this.datatablePagination = {
                displayStart,
                pageLength,
                currentPage,
                timestamp: new Date().toISOString(),
            };
            // console.log('DataTable pagination updated:', this.datatablePagination);
        },

        // Validasi dan adjustment pagination berdasarkan jumlah data
        validatePagination(totalRecords) {
            const { displayStart, pageLength } = this.datatablePagination;
            const totalPages = Math.ceil(totalRecords / pageLength);
            const currentPage = Math.floor(displayStart / pageLength) + 1;

            // Jika halaman saat ini melebihi total halaman yang tersedia
            if (currentPage > totalPages && totalPages > 0) {
                // Fallback ke halaman terakhir yang memungkinkan
                const lastPageStart = (totalPages - 1) * pageLength;
                // console.log(`Pagination adjusted: Page ${currentPage} -> Page ${totalPages} (${totalRecords} records)`);

                this.datatablePagination = {
                    displayStart: lastPageStart,
                    pageLength,
                    currentPage: totalPages,
                    timestamp: new Date().toISOString(),
                };

                return true; // Menandakan bahwa ada adjustment
            }

            return false; // Tidak ada adjustment
        },

        resetPagination() {
            this.datatablePagination = {
                displayStart: 0,
                pageLength: 10,
                currentPage: 1,
            };
            // console.log('DataTable pagination reset');
        },

        // Set pagination ke halaman tertentu
        setPage(pageNumber, pageLength = 10) {
            const displayStart = (pageNumber - 1) * pageLength;
            this.updatePagination(displayStart, pageLength);
        },
    },
    persist: {
        storage: sessionStorage,
    },
});
