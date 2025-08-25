import { createPinia, setActivePinia } from 'pinia';
import { beforeEach } from 'vitest';

// Setup Pinia globally for all tests
beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
});

// Mock localStorage for testing (if needed)
Object.defineProperty(window, 'localStorage', {
    value: {
        store: {},
        getItem(key) {
            return this.store[key] || null;
        },
        setItem(key, value) {
            this.store[key] = String(value);
        },
        removeItem(key) {
            delete this.store[key];
        },
        clear() {
            this.store = {};
        },
    },
    writable: true,
});
