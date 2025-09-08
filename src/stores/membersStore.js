import { defineStore } from 'pinia';

export default defineStore('members', {
    state: () => ({
        members: [],
        filterKomisariat: '',
        filterStatus: 'active',
    }),
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
    persist: true, // Optional: if you want to persist filters between page reloads
});
