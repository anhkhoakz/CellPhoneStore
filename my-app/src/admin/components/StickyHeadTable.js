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
  { id: 'customerName', label: 'Customer Name', minWidth: 170 },
  { id: 'totalAmount', label: 'Total Amount', minWidth: 170 },
  { id: 'paymentMethod', label: 'Payment Method', minWidth: 170 },
  { id: 'orderStatus', label: 'Order Status', minWidth: 170 },
  { id: 'orderDate', label: 'Order Date', minWidth: 170 },
];

function createData(customerName, totalAmount, paymentMethod, orderStatus, orderDate) {
  return { customerName, totalAmount, paymentMethod, orderStatus, orderDate };
}

const rows = [
  createData('John Doe', 250, 'Credit Card', 'Pending', '2024-11-07'),
  createData('Jane Smith', 100, 'PayPal', 'Shipped', '2024-11-06'),
  createData('Alice Johnson', 450, 'Bank Transfer', 'Delivered', '2024-11-05'),
  createData('Bob Brown', 300, 'Credit Card', 'Pending', '2024-11-04'),
  createData('Charlie White', 150, 'Debit Card', 'Canceled', '2024-11-03'),
];

export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
                  align="center" // Ensure column headers are also centered
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
                  <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.customerName} isEven={isEven}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return column.id === 'orderStatus' ? (
                        <StatusTableCell key={column.id} align="center" status={value}>
                          {value}
                        </StatusTableCell>
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
