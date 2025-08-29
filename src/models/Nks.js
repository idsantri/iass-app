import ApiCrud from './ApiCrud';

class Nks extends ApiCrud {
    constructor(path) {
        super(path);
        this.path = 'nks';
    }
}
export default new Nks();
