import Dexie from "dexie";
import type {Table} from "dexie";

export interface User {
    id?: number;
    firstName: string;
    lastName: string;
    gender: "male" | "female";
    birthdate: string;
}

class UsersDB extends Dexie {
    users!: Table<User, number>;

    constructor() {
        super("UsersDB");
        this.version(1).stores({
            users: "++id, firstName, lastName, gender, birthdate"
        });
    }
}

export const db = new UsersDB();