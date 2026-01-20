import ApiCrud from './ApiCrud';

class BansusStatus extends ApiCrud {
    constructor(path) {
        super(path);
        this.path = 'bansus-statuses';
    }
}
export default new BansusStatus();
