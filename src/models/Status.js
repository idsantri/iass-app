import ApiCrud from './ApiCrud';

class Status extends ApiCrud {
    constructor(path) {
        super(path);
        this.path = 'statuses';
    }
}
export default new Status();
