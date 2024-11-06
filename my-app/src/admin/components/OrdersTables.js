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

const StatusTableCell = styled(TableCell)(({ theme, status }) => ({
  textAlign: 'center',
  color:
    status === 'Canceled'
      ? theme.palette.error.main
      : status === 'Delivered'
        ? theme.palette.success.main
        : status === 'Pending'
          ? '#FF9800'
          : theme.palette.text.primary,
  fontWeight: 'bold',
  padding: '16px',
}));

const columns = [
  { id: 'orderId', label: 'Order ID', minWidth: 170 },
  { id: 'customerName', label: 'Customer Name', minWidth: 170 },
  { id: 'totalAmount', label: 'Total Amount', minWidth: 170 },
  { id: 'orderStatus', label: 'Order Status', minWidth: 170 },
  { id: 'orderDate', label: 'Order Date', minWidth: 170 },
  { id: 'seeDetail', label: 'See Detail', minWidth: 120 },
  { id: 'changeStatus', label: 'Change Status', minWidth: 170 },
];


// Khởi tạo dữ liệu
const createData = (orderId, customerName, totalAmount, orderStatus, orderDate) => {
  return { orderId, customerName, totalAmount, orderStatus, orderDate };
};

const initialRows = [
  createData('ORD123', 'John Doe', 250, 'Pending', '2024-11-07'),
  createData('ORD124', 'Jane Smith', 100, 'Shipped', '2024-11-06'),
  createData('ORD125', 'Alice Johnson', 450, 'Delivered', '2024-11-05'),
  createData('ORD126', 'Bob Brown', 300, 'Pending', '2024-11-04'),
  createData('ORD127', 'Charlie White', 150, 'Canceled', '2024-11-03'),
];


export default function StickyHeadTable() {
  const [rows, setRows] = React.useState(initialRows);  // Sử dụng useState để lưu trữ dữ liệu
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangeStatus = (event, index) => {
    // Thay đổi trạng thái trong mảng rows (trong state)
    const updatedRows = [...rows];
    updatedRows[index].orderStatus = event.target.value;
    setRows(updatedRows);  // Cập nhật lại state rows để re-render bảng
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
                  <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.orderId} isEven={isEven}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return column.id === 'orderStatus' ? (
                        <StatusTableCell key={column.id} align="center" status={value}>
                          {value}
                        </StatusTableCell>
                      ) : column.id === 'seeDetail' ? (
                        <TableCell key={column.id} align="center" style={{ padding: '16px' }}>
                          <Visibility style={{ cursor: 'pointer', fontSize: 20 }} />
                        </TableCell>
                      ) : column.id === 'changeStatus' ? (
                        <TableCell key={column.id} align="center" style={{ padding: '16px' }}>
                          <FormControl fullWidth>
                            <InputLabel id={`status-label-${index}`}>Status</InputLabel>
                            <Select
                              labelId={`status-label-${index}`}
                              value={row.orderStatus}
                              onChange={(e) => handleChangeStatus(e, index)}
                            >
                              <MenuItem value="Pending">Pending</MenuItem>
                              <MenuItem value="Shipped">Shipped</MenuItem>
                              <MenuItem value="Delivered">Delivered</MenuItem>
                              <MenuItem value="Canceled">Canceled</MenuItem>
                            </Select>
                          </FormControl>
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
