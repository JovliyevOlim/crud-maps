import {useEffect} from "react";
import {useUsersStore} from "@/store/users.store";
import {UserTable} from "@/components/users/UserTable";
import {Button} from "@/components/ui/button";
import {useModalStore} from "@/store/modal.store";
import {UserFormModal} from "@/components/users/UserFormModal";
import {DeleteConfirmModal} from "@/components/users/DeleteConfirmModal";

export default function Users() {
    const {loadUsers} = useUsersStore();
    const {openFormModal} = useModalStore();

    useEffect(() => {
        loadUsers();
    }, []);

    return (
        <div>
            <Button onClick={() => openFormModal()}>Create User</Button>
            <UserTable/>
            <UserFormModal/>
            <DeleteConfirmModal/>
        </div>
    );
}