import ApiCrud from './ApiCrud';

class NksNote extends ApiCrud {
    constructor(path) {
        super(path);
        this.path = 'nks-notes';
    }
}
export default new NksNote();
