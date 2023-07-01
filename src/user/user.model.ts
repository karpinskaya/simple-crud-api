import IUser from './user.interface';

export default class UserModel {
    users: IUser[];

    constructor(users: IUser[]) {
        this.users = users;
    }

    findAll() {
        return this.users;
    }

    findById() {
        //
    }

    create() {
        //
    }

    update() {
        //
    }

    delete() {
        //
    }
}
