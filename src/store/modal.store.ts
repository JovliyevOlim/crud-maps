import {create} from "zustand";

interface ModalState {
    formModalOpen: boolean;
    deleteModalOpen: boolean;
    editingUserId: number | null;

    openFormModal: (id?: number) => void;
    closeFormModal: () => void;

    openDeleteModal: (id?: number) => void;
    closeDeleteModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
    formModalOpen: false,
    deleteModalOpen: false,
    editingUserId: null,

    openFormModal: (id) => set({formModalOpen: true, editingUserId: id || null}),
    closeFormModal: () => set({formModalOpen: false, editingUserId: null}),

    openDeleteModal: (id) => set({deleteModalOpen: true, editingUserId: id}),
    closeDeleteModal: () => set({deleteModalOpen: false, editingUserId: null}),
}));