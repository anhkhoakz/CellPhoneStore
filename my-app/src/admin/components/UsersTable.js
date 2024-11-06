import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import { Visibility } from '@mui/icons-material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 600,
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    padding: '16px',
    textAlign: 'center',
}));

const StyledTableRow = styled(TableRow)(({ theme, isEven }) => ({
    backgroundColor: isEven ? theme.palette.action.hover : 'transparent',
    '&:hover': {
        backgroundColor: theme.palette.action.selected,
    },
}));

const columns = [
    { id: 'userId', label: 'User ID', minWidth: 170 },
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'location', label: 'Location', minWidth: 170 },
    { id: 'note', label: 'Note (Reason for Account Lock)', minWidth: 170 },
    { id: 'accountCreationDate', label: 'Account Created', minWidth: 170 },
    { id: 'changeUserStatus', label: 'Change Status', minWidth: 170 },
];

// Khởi tạo dữ liệu
const createData = (userId, name, location, note, accountCreationDate, userStatus) => {
    return { userId, name, location, note, accountCreationDate, userStatus };
};

const initialRows = [
    createData('USER123', 'John Doe', 'New York', '', '2024-01-15', 'Active'),
    createData('USER124', 'Jane Smith', 'California', 'Account locked due to suspicious activity', '2023-11-10', 'Locked'),
    createData('USER125', 'Alice Johnson', 'Texas', '', '2024-06-25', 'Active'),
    createData('USER126', 'Bob Brown', 'Florida', '', '2023-08-13', 'Active'),
    createData('USER127', 'Charlie White', 'Nevada', 'Account locked due to payment failure', '2024-02-20', 'Locked'),
];

export default function UsersTable() {
    const [rows, setRows] = React.useState(initialRows); // Sử dụng useState để lưu trữ dữ liệu
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleChangeUserStatus = (event, index) => {
        // Thay đổi trạng thái người dùng trong mảng rows
        const updatedRows = [...rows];
        updatedRows[index].userStatus = event.target.value;
        setRows(updatedRows); // Cập nhật lại state rows để re-render bảng
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', padding: 2 }}>
            <TableContainer sx={{ maxHeight: 440 }}>
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
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                const isEven = index % 2 === 0;
                                return (
                                    <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.userId} isEven={isEven}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return column.id === 'accountCreationDate' ? (
                                                <TableCell key={column.id} align="center" style={{ padding: '16px' }}>
                                                    {value}
                                                </TableCell>
                                            ) : column.id === 'note' ? (
                                                <TableCell key={column.id} align="center" style={{ padding: '16px' }}>
                                                    {value}
                                                </TableCell>
                                            ) : column.id === 'changeUserStatus' ? (
                                                <TableCell key={column.id} align="center" style={{ padding: '16px' }}>
                                                    <FormControl fullWidth>
                                                        <InputLabel id={`user-status-label-${index}`}>User Status</InputLabel>
                                                        <Select
                                                            labelId={`user-status-label-${index}`}
                                                            value={row.userStatus}
                                                            onChange={(e) => handleChangeUserStatus(e, index)}
                                                        >
                                                            <MenuItem value="Active" sx={{ color: 'green' }}>Active</MenuItem> {/* Màu xanh cho Active */}
                                                            <MenuItem value="Locked" sx={{ color: 'red' }}>Locked</MenuItem> {/* Màu đỏ cho Locked */}
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>

                                            ) : column.id === 'seeDetail' ? (
                                                <TableCell key={column.id} align="center" style={{ padding: '16px' }}>
                                                    <Visibility style={{ cursor: 'pointer', fontSize: 20 }} />
                                                </TableCell>
                                            ) : (
                                                <TableCell key={column.id} align="center" style={{ padding: '16px' }}>
                                                    {column.format && typeof value === 'number' ? column.format(value) : value}
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
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
