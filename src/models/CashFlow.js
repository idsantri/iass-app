import ApiCrud from './ApiCrud';

class CashFlow extends ApiCrud {
    constructor() {
        super('cash-flows');
    }
}
export default new CashFlow();
