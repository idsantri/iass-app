import ApiCrud from './ApiCrud';

class Note extends ApiCrud {
    constructor() {
        super('notes');
    }
}

export default new Note();
