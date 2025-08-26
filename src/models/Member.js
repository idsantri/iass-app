import ApiCrud from './ApiCrud';

class Member extends ApiCrud {
    constructor(path) {
        super(path);
        this.path = 'members';
    }
}
export default new Member();
