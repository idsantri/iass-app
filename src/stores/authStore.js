import { defineStore } from 'pinia';

const authStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
        roles: null,
    }),

    actions: {
        login({ user, token, roles }) {
            this.user = user;
            this.token = token;
            this.roles = roles;
        },

        setUser(userData) {
            this.user = {
                ...this.user,
                ...userData,
            };
        },

        logout() {
            this.user = null;
            this.token = null;
            this.roles = null;
        },
    },

    getters: {
        isLoggedIn: (state) => {
            return typeof state.token === 'string' && state.token.length >= 10;
        },
        mustChangePassword: (state) => {
            return !!state.user.must_change_password;
        },
    },

    persist: {
        storage: localStorage,
    },
});
export default authStore;
