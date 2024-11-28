import * as React from "react";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    IconButton,
    FormControl,
    Select,
    MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Edit } from "@mui/icons-material";
import SearchBar from "./SearchBar";
import AddUserDialog from "../components/modal/AddUserDialog";
import EditUserDialog from "../components/modal/EditUserDialog";
import LockReasonDialog from "../components/modal/LockReasonDialog"; // Import LockReasonDialog
import { useCookies } from "react-cookie";

import { useNavigate } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 600,
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    padding: "16px",
    textAlign: "center",
}));

const StyledTableRow = styled(TableRow)(({ theme, isEven }) => ({
    backgroundColor: isEven ? theme.palette.action.hover : "transparent",
    "&:hover": {
        backgroundColor: theme.palette.action.selected,
    },
}));

const columns = [
    { id: "userId", label: "User ID", minWidth: 150 },
    { id: "name", label: "Tên", minWidth: 150 },
    { id: "phoneNumber", label: "Số điện thoại", minWidth: 150 },
    { id: "location", label: "Địa điểm", minWidth: 150 },
    { id: "note", label: "Ghi chú (Lý do khóa tài khoản)", minWidth: 170 },
    { id: "accountCreationDate", label: "Ngày tạo tài khoản", minWidth: 150 },
    { id: "changeUserStatus", label: "Thay đổi trạng thái", minWidth: 150 },
    { id: "edit", label: "Chỉnh sửa", minWidth: 100 },
];

const createData = (
    userId,
    name,
    phoneNumber,
    location,
    note,
    accountCreationDate,
    userStatus
) => {
    return {
        userId,
        name,
        phoneNumber,
        location,
        note,
        accountCreationDate,
        userStatus,
    };
};

const initialRows = [
    createData(
        "USER123",
        "John Doe",
        "123-456-7890",
        "New York",
        "",
        "2024-01-15",
        "Hoạt động"
    ),
    createData(
        "USER124",
        "Jane Smith",
        "098-765-4321",
        "California",
        "Khóa tài khoản do hoạt động đáng ngờ",
        "2023-11-10",
        "Đã khóa"
    ),
    createData(
        "USER125",
        "Alice Johnson",
        "555-123-4567",
        "Texas",
        "",
        "2024-06-25",
        "Hoạt động"
    ),
    createData(
        "USER126",
        "Bob Brown",
        "777-888-9999",
        "Florida",
        "",
        "2023-08-13",
        "Hoạt động"
    ),
    createData(
        "USER127",
        "Charlie White",
        "222-333-4444",
        "Nevada",
        "Khóa tài khoản do lỗi thanh toán",
        "2024-02-20",
        "Đã khóa"
    ),
];

export default function UsersTable() {
    const [rows, setRows] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [search, setSearch] = React.useState("");
    const [status, setStatus] = React.useState("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
    const [isLockReasonDialogOpen, setIsLockReasonDialogOpen] =
        React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState(null);
    const [selectedUserIndex, setSelectedUserIndex] = React.useState(null);

    const navigate = useNavigate();

    const [cookies] = useCookies(["accessToken"]);

    React.useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users`, {
            method: "GET",
            credentials: 'include',
            headers: {
                Authorization: `Bearer ${cookies.accessToken}`,
            },
        })
            .then((response) => {   
                if (response.status === 403) {

                    navigate('/403');
                    return;
                }
                return response.json();
            })
            .then((data) => {

                console.log("Data:", data);
                console.log("Success:", data.users);

                
                if (data.status === 401) {
                    navigate('/login');
                    return;
                }
             

                
                // const rows = data.users;

                // setRows(rows);
                // console.log("Rows:", rows);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleChangeUserStatus = (event, index) => {
        const newStatus = event.target.value;
        const updatedRows = [...rows];

        if (
            newStatus === "Đã khóa" &&
            updatedRows[index].userStatus === "Hoạt động"
        ) {
            // Mở modal nhập lý do khóa
            setSelectedUserIndex(index);
            setIsLockReasonDialogOpen(true);
        } else {
            // Cập nhật trực tiếp nếu không cần nhập lý do
            updatedRows[index].userStatus = newStatus;
            setRows(updatedRows);
        }
    };

    const handleEditClick = (userId) => {
        const userToEdit = rows.find((row) => row.userId === userId);
        setSelectedUser(userToEdit);
        setIsEditDialogOpen(true);
    };

    const handleSearchChange = (value) => {
        setSearch(value);
    };

    const handleStatusChange = (value) => {
        setStatus(value);
    };

    const handleOpenAddDialog = () => {
        setIsAddDialogOpen(true);
    };

    const handleCloseAddDialog = () => {
        setIsAddDialogOpen(false);
    };

    const handleSaveNewUser = (newUser) => {
        setRows((prevRows) => [...prevRows, newUser]);
        handleCloseAddDialog();
    };

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
        setSelectedUser(null);
    };

    const handleSaveEditedUser = (updatedUser) => {
        setRows((prevRows) =>
            prevRows.map((row) =>
                row.userId === updatedUser.userId ? updatedUser : row
            )
        );
        handleCloseEditDialog();
    };

    const handleSaveLockReason = (reason) => {
        const updatedRows = [...rows];
        updatedRows[selectedUserIndex].userStatus = "Đã khóa";
        updatedRows[selectedUserIndex].note = reason;
        setRows(updatedRows);
        setIsLockReasonDialogOpen(false);
    };

    const handleCloseLockReasonDialog = () => {
        setIsLockReasonDialogOpen(false);
    };

    const filteredRows = rows.filter((row) => {
        const matchesSearch =
            row.name.toLowerCase().includes(search.toLowerCase()) ||
            row.userId.toLowerCase().includes(search.toLowerCase()) ||
            row.location.toLowerCase().includes(search.toLowerCase()) ||
            row.phoneNumber.includes(search);
        const matchesStatus = status === "all" || row.userStatus === status;
        return matchesSearch && matchesStatus;
    });

    return (
        <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
            <SearchBar
                search={search}
                onSearchChange={handleSearchChange}
                status={status}
                onStatusChange={handleStatusChange}
                onAddClick={handleOpenAddDialog}
                addLabel="Add User"
                searchPlaceholder="Tìm kiếm người dùng"
                statusLabel="Trạng thái"
                statusOptions={[
                    { value: "all", label: "Tất cả" },
                    { value: "Hoạt động", label: "Hoạt động" },
                    { value: "Đã khóa", label: "Đã khóa" },
                ]}
            />

            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <StyledTableCell
                                    key={column.id}
                                    align="center"
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRows
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((row, index) => {
                                const isEven = index % 2 === 0;
                                return (
                                    <StyledTableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={row.userId}
                                        isEven={isEven}
                                    >
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return column.id ===
                                                "changeUserStatus" ? (
                                                <TableCell
                                                    key={column.id}
                                                    align="center"
                                                    style={{ padding: "16px" }}
                                                >
                                                    <FormControl fullWidth>
                                                        <Select
                                                            labelId={`user-status-label-${index}`}
                                                            value={
                                                                row.userStatus
                                                            }
                                                            onChange={(e) =>
                                                                handleChangeUserStatus(
                                                                    e,
                                                                    index
                                                                )
                                                            }
                                                            sx={{
                                                                border: "none",
                                                                ".MuiSelect-select":
                                                                    {
                                                                        padding:
                                                                            "10px",
                                                                    },
                                                            }}
                                                        >
                                                            <MenuItem
                                                                value="Hoạt động"
                                                                sx={{
                                                                    color: "green",
                                                                    marginBottom:
                                                                        "4px",
                                                                }}
                                                            >
                                                                Hoạt động
                                                            </MenuItem>
                                                            <MenuItem
                                                                value="Đã khóa"
                                                                sx={{
                                                                    color: "red",
                                                                }}
                                                            >
                                                                Đã khóa
                                                            </MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                            ) : column.id === "edit" ? (
                                                <TableCell
                                                    key={column.id}
                                                    align="center"
                                                    style={{ padding: "16px" }}
                                                >
                                                    <IconButton
                                                        onClick={() =>
                                                            handleEditClick(
                                                                row.userId
                                                            )
                                                        }
                                                        color="primary"
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                </TableCell>
                                            ) : (
                                                <TableCell
                                                    key={column.id}
                                                    align="center"
                                                    style={{ padding: "16px" }}
                                                >
                                                    {value}
                                                </TableCell>
                                            );
                                        })}
                                    </StyledTableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <AddUserDialog
                open={isAddDialogOpen}
                onClose={handleCloseAddDialog}
                onSave={handleSaveNewUser}
            />

            <EditUserDialog
                open={isEditDialogOpen}
                onClose={handleCloseEditDialog}
                onSave={handleSaveEditedUser}
                userData={selectedUser}
            />

            <LockReasonDialog
                open={isLockReasonDialogOpen}
                onClose={handleCloseLockReasonDialog}
                onSave={handleSaveLockReason}
            />
        </Paper>
    );
}
