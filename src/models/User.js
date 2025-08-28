import ApiCrud from './ApiCrud';

class User extends ApiCrud {
    constructor(path) {
        super(path);
        this.path = 'users';
    }

    async updateRole(userId, data) {
        this.setNotify(true);
        const response = await this.fetchAuth(`${this.path}/${userId}/role`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return response.data || true;
    }

    async me() {
        this.setNotifyGet();
        const response = await this.fetchAuth('user', {
            method: 'GET',
        });
        return response.data || true;
    }

    async updateMyPassword(data) {
        this.setNotify(true);
        const response = await this.fetchAuth('user/update-password', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return response.data || true;
    }
}
export default new User();
