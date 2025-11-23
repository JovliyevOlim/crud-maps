import {useUsersStore} from "@/store/users.store";
import {useModalStore} from "@/store/modal.store";
import {Button} from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Input} from "@/components/ui/input";
import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";

export function UserTable() {
    const {paginatedUsers, filteredUsers, search, setSearch, currentPage, pageSize, setPage, loading} = useUsersStore();

    const totalPages = Math.ceil(filteredUsers().length / pageSize);


    const {openFormModal, openDeleteModal} = useModalStore();
    const pages = Array.from({length: totalPages}, (_, i) => i + 1);


    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-4">
            <Input
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm my-2"
            />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Birthdate</TableHead>
                        <TableHead className={'w-[200px]'}>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedUsers().map((u) => (
                        <TableRow key={u.id} className={'text-start'}>
                            <TableCell>{u.firstName}</TableCell>
                            <TableCell>{u.lastName}</TableCell>
                            <TableCell>{u.gender}</TableCell>
                            <TableCell>{u.birthdate}</TableCell>
                            <TableCell className="flex gap-2">
                                <Button size="sm" onClick={() => openFormModal(u.id)}>
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => openDeleteModal(u.id)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-between items-center">
                <Pagination>
                    <PaginationContent>
                        {/* Previous */}
                        <PaginationItem>
                            <PaginationPrevious
                                isActive={currentPage === 1}
                                onClick={() => setPage(currentPage - 1)}
                                className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}/>
                        </PaginationItem>

                        {/* Page numbers */}
                        {pages.map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    href="#"
                                    className={page === currentPage ? "bg-primary text-white" : ""}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setPage(page);
                                    }}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        {/* Ellipsis if many pages */}
                        {totalPages > 5 && <PaginationItem><PaginationEllipsis/></PaginationItem>}

                        {/* Next */}
                        <PaginationItem>
                            <PaginationNext
                                isActive={currentPage === totalPages}
                                onClick={() => setPage(currentPage + 1)}
                                className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}/>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}