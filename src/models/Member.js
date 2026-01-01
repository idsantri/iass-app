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
}
export default new Member();
