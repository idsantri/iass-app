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
}
export default new User();
