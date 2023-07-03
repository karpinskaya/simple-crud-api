import IUser from './user.interface';

export default class UserModel {
    users: IUser[];

    constructor(users: IUser[]) {
        this.users = users;
    }

    findAll() {
        return this.users;
    }

    findById(id: string) {
        return this.users.find((u) => u.id === id);
    }

    create(newUser: IUser) {
        this.users.push(newUser);
    }

    update(id: string, updUser: IUser) {
        const index = this.users.findIndex((u) => u.id === id);
        this.users[index].username = updUser.username
            ? updUser.username
            : this.users[index].username;
        this.users[index].age = updUser.age
            ? updUser.age
            : this.users[index].age;
        this.users[index].hobbies = updUser.hobbies
            ? this.users[index].hobbies.concat(updUser.hobbies)
            : this.users[index].hobbies;
        return this.users[index];
    }

    delete(id: string) {
        const index = this.users.findIndex((u) => u.id === id);

        if (index === -1) {
            return -1;
        } else {
            this.users.splice(index, 1);
            return index;
        }
    }
}
