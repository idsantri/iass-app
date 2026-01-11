import { notifyError } from '@/utils/notify';
import ApiCrud from './ApiCrud';

class Member extends ApiCrud {
    constructor(path) {
        super(path);
        this.path = 'members';
    }

    async uploadAvatar(id, data) {
        try {
            const response = await fetch(`${this.BASE_URL}members/${id}/avatar`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `bearer ${this.getAccessToken()}`,
                    // Do not use 'Content-Type',
                },
                body: data,
            });
            const responseJson = await response.json();
            if (responseJson.error) {
                notifyError(responseJson.message);
                throw new Error(responseJson);
            }
            return responseJson.data;
        } catch (error) {
            notifyError('Tidak data terhubung ke server');
            throw error;
        }
    }

    /**
     * Get image URL untuk member
     * @param {string|number} id - ID member
     * @param {boolean} asBlob - Return sebagai Blob untuk preview
     * @returns {Promise} Promise dengan URL gambar atau Blob
     */
    async getAvatar(id, asBlob = false) {
        try {
            const response = await fetch(`${this.BASE_URL}members/${id}/avatar`, {
                method: 'GET',
                headers: {
                    Accept: 'image/*',
                    Authorization: `bearer ${this.getAccessToken()}`,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                // credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Gambar tidak ditemukan: ${response.status}`);
            }

            if (asBlob) {
                const blob = await response.blob();
                return URL.createObjectURL(blob);
            }

            // Jika ingin langsung embed di img tag
            const blob = await response.blob();
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Get image error:', error);
            throw error;
        }
    }
}
export default new Member();
