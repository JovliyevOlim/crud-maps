import {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useUsersStore} from "@/store/users.store";
import {useModalStore} from "@/store/modal.store";

export function DeleteConfirmModal() {
    const {deleteModalOpen, closeDeleteModal, editingUserId} = useModalStore();
    const {deleteUser} = useUsersStore();
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);


    const handleDelete = async () => {
        if (!editingUserId || !reason) return;

        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 1500));
        await deleteUser(editingUserId);
        closeDeleteModal();
        setLoading(false);
        setReason("");
    };

    return (
        <Dialog open={deleteModalOpen} onOpenChange={closeDeleteModal}>
            <DialogContent className="sm:max-w-md w-full">
                <DialogHeader>
                    <DialogTitle>Delete User</DialogTitle>
                    <DialogDescription>
                        Please provide a reason for deleting this user.
                    </DialogDescription>
                </DialogHeader>

                <textarea
                    className="w-full border p-2 rounded mt-2"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Type reason here..."
                />

                <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={closeDeleteModal}>
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} disabled={!reason || loading}>
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}