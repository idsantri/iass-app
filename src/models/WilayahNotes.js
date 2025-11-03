import ApiCrud from './ApiCrud';

class WilayahNotes extends ApiCrud {
    constructor() {
        super('wilayah/notes');
    }
}
export default new WilayahNotes();
