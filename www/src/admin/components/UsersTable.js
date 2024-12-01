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
import LockReasonDialog from "../components/modal/LockReasonDialog";
import { useCookies } from "react-cookie";

import { useNavigate } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	fontWeight: 600,
	backgroundColor: theme.palette.primary.light,
	color: theme.palette.primary.contrastText,
	padding: "1em",
	textAlign: "center",
}));

const StyledTableRow = styled(TableRow)(({ theme, isEven }) => ({
	backgroundColor: isEven ? theme.palette.action.hover : "transparent",
	"&:hover": {
		backgroundColor: theme.palette.action.selected,
	},
}));

const columns = [
	{ id: "_id", label: "User ID", minWidth: 150 },
	{ id: "username", label: "Tên", minWidth: 150 },
	{ id: "email", label: "Email", minWidth: 150 },
	{ id: "phone", label: "Số điện thoại", minWidth: 150 },
	{ id: "note", label: "Ghi chú (Lý do khóa tài khoản)", minWidth: 170 },
	{ id: "createAt", label: "Ngày tạo tài khoản", minWidth: 150 },
	{ id: "status", label: "Thay đổi trạng thái", minWidth: 150 },
	{ id: "edit", label: "Chỉnh sửa", minWidth: 100 },
];

export default function UsersTable() {
	const [rows, setRows] = React.useState([]);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [search, setSearch] = React.useState("");
	const [status, setStatus] = React.useState("all");
	const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
	const [isLockReasonDialogOpen, setIsLockReasonDialogOpen] = React.useState(false);
	const [selectedUser, setSelectedUser] = React.useState(null);
	const [selectedUserIndex, setSelectedUserIndex] = React.useState(null);

	const navigate = useNavigate();

	const [cookies] = useCookies(["accessToken"]);

	React.useEffect(() => {
		console.log("cookies.accessToken:", cookies.accessToken);
		fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users`, {
			method: "GET",
			credentials: "include",
			headers: {
				Authorization: `Bearer ${cookies.accessToken}`,
			},
		})
			.then((response) => {
				if (response.status === 403) {
					navigate("/403");
					return;
				}
				return response.json();
			})
			.then((data) => {
				if (data.status === 401) {
					navigate("/login");
					return;
				}

				console.log("Data:", data.users);

				const rows = data.users;
				setRows(rows);
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

		if (newStatus === "Đã khóa" && updatedRows[index].userStatus === "Hoạt động") {
			setSelectedUserIndex(index);
			setIsLockReasonDialogOpen(true);
		} else {
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
		setRows((prevRows) => prevRows.map((row) => (row.userId === updatedUser.userId ? updatedUser : row)));
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
			row.username?.toLowerCase().includes(search.toLowerCase()) ||
			row._id?.toLowerCase().includes(search.toLowerCase()) ||
			row.phone?.includes(search);
		const matchesStatus = status === "all" || row.status === status;
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
					{ value: "active", label: "Hoạt động" },
					{ value: "inactive", label: "Đã khóa" },
				]}
			/>

			<TableContainer>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<StyledTableCell key={column.id} align="center" style={{ minWidth: column.minWidth }}>
									{column.label}
								</StyledTableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
							const isEven = index % 2 === 0;
							return (
								<StyledTableRow hover tabIndex={-1} key={row.userId} isEven={isEven}>
									<TableCell padding="checkbox">
										<input type="checkbox" />
									</TableCell>
									{columns.map((column) => {
										const value = row[column.id];
										return column.id === "changeUserStatus" ? (
											<TableCell key={column.id} align="center" style={{ padding: "1em" }}>
												<FormControl fullWidth>
													<Select
														labelId={`user-status-label-${index}`}
														value={row.userStatus}
														onChange={(e) => handleChangeUserStatus(e, index)}
														sx={{
															border: "none",
															".MuiSelect-select": {
																padding: "10px",
															},
														}}
													>
														<MenuItem
															value="Hoạt động"
															sx={{
																color: "green",
																marginBottom: "4px",
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
											<TableCell key={column.id} align="center" style={{ padding: "1em" }}>
												<IconButton onClick={() => handleEditClick(row.userId)} color="primary">
													<Edit />
												</IconButton>
											</TableCell>
										) : (
											<TableCell key={column.id} align="center" style={{ padding: "1em" }}>
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

			<AddUserDialog open={isAddDialogOpen} onClose={handleCloseAddDialog} onSave={handleSaveNewUser} />

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
