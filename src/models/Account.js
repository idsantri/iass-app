import ApiCrud from './ApiCrud';

class Account extends ApiCrud {
    constructor() {
        super('accounts');
    }
}
export default new Account();
