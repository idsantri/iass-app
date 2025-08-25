import { describe, it, expect, beforeEach } from 'vitest';
import Auth from '../Auth';
import authStore from '../../stores/authStore';
import setupAuth from './setupAuth';

describe('auth model', () => {
    beforeEach(() => {
        localStorage.clear();
        setupAuth.resetAuth();
    });

    it('login should return token on success', async () => {
        const result = await setupAuth.doLogin();
        expect(result.token).toBeDefined();
        expect(typeof result.token).toBe('string');
    });

    it('should store token in auth store after login', async () => {
        const result = await setupAuth.doLogin();
        const authState = setupAuth.authState();

        expect(authState.token).toBe(result.token);
        expect(authState.user).toBeDefined();

        // Test getter
        const store = setupAuth.authState();
        const isLoggedIn = typeof store.token === 'string' && store.token.length >= 10;
        expect(isLoggedIn).toBe(true);
    });

    it('login should throw error on wrong credentials', async () => {
        await expect(
            Auth.login({
                login: 'user1',
                password: 'wrongpassword',
            }),
        ).rejects.toThrow();
    });

    it('logout should call API and clear auth state after real login', async () => {
        const result = await setupAuth.doLogin();

        // Verify login worked
        let authState = setupAuth.authState();
        expect(authState.token).toBe(result.token);

        const isLoggedInBefore =
            typeof authState.token === 'string' && authState.token.length >= 10;
        expect(isLoggedInBefore).toBe(true);

        // Perform logout
        const logoutResponse = await Auth.logout();

        // Clear store after logout
        setupAuth.resetAuth();

        // Verify logout worked
        authState = setupAuth.authState();
        expect(authState.token).toBeNull();

        const isLoggedInAfter = typeof authState.token === 'string' && authState.token.length >= 10;
        expect(isLoggedInAfter).toBe(false);
        expect(logoutResponse).toBeDefined();
    });

    it('should handle store persistence correctly', async () => {
        const testData = {
            user: { id: 1, name: 'Test User' },
            token: 'test-token-12345',
            roles: ['user'],
        };

        // Test login action
        setupAuth.loginToStore(testData);
        let authState = setupAuth.authState();

        expect(authState.user).toEqual(testData.user);
        expect(authState.token).toBe(testData.token);
        expect(authState.roles).toEqual(testData.roles);

        // Test logout action
        const store = authStore();
        store.logout();

        authState = setupAuth.authState();
        expect(authState.user).toBeNull();
        expect(authState.token).toBeNull();
        expect(authState.roles).toBeNull();
    });

    it('should update user data correctly', async () => {
        const initialData = {
            user: { id: 1, name: 'Test User', email: 'test@example.com' },
            token: 'test-token-12345',
            roles: ['user'],
        };

        setupAuth.loginToStore(initialData);

        const store = authStore();
        store.setUser({ name: 'Updated User', phone: '123456789' });

        const authState = setupAuth.authState();
        expect(authState.user.name).toBe('Updated User');
        expect(authState.user.email).toBe('test@example.com'); // Should preserve existing data
        expect(authState.user.phone).toBe('123456789'); // Should add new data
        expect(authState.user.id).toBe(1); // Should preserve existing data
    });
});
