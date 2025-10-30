import Api from './Api';

class Auth extends Api {
    login(credentials, fetchOptions = {}) {
        return this.createFetch('auth/login', {
            method: 'POST',
            body: credentials,
            immediate: false,
            ...fetchOptions,
        });
    }

    register(userData, fetchOptions = {}) {
        return this.createFetch('auth/register', {
            method: 'POST',
            body: userData,
            immediate: false,
            ...fetchOptions,
        });
    }
}

export default new Auth();
