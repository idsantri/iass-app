import ApiCrud from './ApiCrud';

class BansusPosition extends ApiCrud {
    constructor(path) {
        super(path);
        this.path = 'bansus-positions';
    }
}
export default new BansusPosition();
