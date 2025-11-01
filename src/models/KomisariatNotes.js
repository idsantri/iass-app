import ApiCrud from './ApiCrud';

class KomisariatNotes extends ApiCrud {
    constructor() {
        super('komisariat/notes');
    }
}
export default new KomisariatNotes();
