import Api from './Api';

class Auth extends Api {
    constructor() {
        super();
        this.defaultConfig();
    }

    /**
     * Melakukan login dengan kredensial yang diberikan.
     * @param {object} credentials - Objek kredensial login.
     * @param {string} credentials.login - Username atau email.
     * @param {string} credentials.password - Password.
     * @returns {Promise<any>} Promise yang menghasilkan data respons login.
     */
    async login({ login, password }) {
        const response = await this.fetchGuest(`login`, {
            method: 'POST',
            body: JSON.stringify({ login, password }),
        });
        return response.data || true;
    }

    /**
     * Melakukan logout.
     * @returns {Promise<any>} Promise yang menghasilkan data respons logout.
     */
    async logout() {
        const response = await this.fetchAuth(`logout`, {
            method: 'POST',
        });
        return response.data || true;
    }
}

export default new Auth();
