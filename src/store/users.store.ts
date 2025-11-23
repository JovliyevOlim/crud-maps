import {create} from "zustand";
import {db} from "@/db/indexedDB";
import type {User} from "@/db/indexedDB";
import {UserFormValues} from "@/types/user.types";

interface UsersState {
    users: User[];
    loading: boolean;
    error: string | null;

    loadUsers: () => Promise<void>;
    addUser: (data: User) => Promise<void>;
    updateUser: (id: number, data: User) => Promise<void>;
    deleteUser: (id: number) => Promise<void>;

    search: string;
    currentPage: number;
    pageSize: number;
    setSearch: (val: string) => void;
    setPage: (page: number) => void;
    filteredUsers: () => UserFormValues[];
    paginatedUsers: () => UserFormValues[];
}

export const useUsersStore = create<UsersState>((set, get) => ({
    users: [],
    loading: false,
    error: null,
    search: "",
    currentPage: 1,
    pageSize: 5,

    loadUsers: async () => {
        set({loading: true});
        try {
            const data = await db.users.toArray();
            set({users: data, loading: false});
        } catch (err) {
            set({error: "Failed to load users", loading: false});
        }
    },

    addUser: async (data) => {
        set({loading: true});
        await db.users.add(data);
        await get().loadUsers();
    },

    updateUser: async (id, data) => {
        set({loading: true});
        await db.users.update(id, data);
        await get().loadUsers();
    },

    deleteUser: async (id) => {
        set({loading: true});
        await db.users.delete(id);
        await get().loadUsers();
    },

    setSearch: (val) => set({search: val, currentPage: 1}),
    setPage: (page) => set({currentPage: page}),

    filteredUsers: () =>
        get().users.filter(
            (u) =>
                u.firstName.toLowerCase().includes(get().search.toLowerCase()) ||
                u.lastName.toLowerCase().includes(get().search.toLowerCase())
        ),

    paginatedUsers: () => {
        const start = (get().currentPage - 1) * get().pageSize;
        return get().filteredUsers().slice(start, start + get().pageSize);
    },
}));