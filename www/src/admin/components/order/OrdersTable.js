import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import { Visibility } from "@mui/icons-material";
import { Select, MenuItem, FormControl } from "@mui/material";
import OrderBar from "./OrderBar";
import OrderDetailDialog from "../modal/order-modal/OrderDetailDialog";
import CanceledReasonDialog from "../modal/order-modal/CanceledReasonDialog";

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

const StatusTableCell = styled(TableCell)(({ theme, status }) => ({
    textAlign: "center",
    color:
        status === "Canceled"
            ? theme.palette.error.main
            : status === "Delivered"
              ? theme.palette.success.main
              : status === "Pending"
                ? "#FF9800"
                : theme.palette.text.primary,
    fontWeight: "bold",
    padding: "16px",
}));

const columns = [
    { id: "orderId", label: "Order ID", minWidth: 170 },
    { id: "customerName", label: "Customer Name", minWidth: 170 },
    { id: "totalAmount", label: "Total Amount", minWidth: 170 },
    { id: "orderStatus", label: "Order Status", minWidth: 170 },
    { id: "orderDate", label: "Order Date", minWidth: 170 },
    { id: "seeDetail", label: "See Detail", minWidth: 120 },
    { id: "changeStatus", label: "Change Status", minWidth: 170 },
];

const createData = (
    orderId,
    customerName,
    totalAmount,
    orderStatus,
    orderDate,
    note,
    items,
) => {
    return {
        orderId,
        customerName,
        totalAmount,
        orderStatus,
        orderDate,
        note,
        items,
    };
};

const initialRows = [
    createData("ORD123", "John Doe", 250, "Pending", "2024-11-07", "", [
        {
            name: "Product A",
            amount: 2,
            price: 50,
            image: "https://via.placeholder.com/100",
        },
        {
            name: "Product B",
            amount: 1,
            price: 150,
            image: "https://via.placeholder.com/100",
        },
    ]),
    createData("ORD124", "Jane Smith", 100, "Shipped", "2024-11-06", "", [
        {
            name: "Product C",
            amount: 1,
            price: 100,
            image: "https://via.placeholder.com/100",
        },
    ]),
    createData("ORD125", "Alice Johnson", 450, "Delivered", "2024-11-05", "", [
        {
            name: "Product D",
            amount: 3,
            price: 150,
            image: "https://via.placeholder.com/100",
        },
    ]),
    createData("ORD126", "Bob Brown", 300, "Pending", "2024-11-04", "", [
        {
            name: "Product E",
            amount: 2,
            price: 150,
            image: "https://via.placeholder.com/100",
        },
    ]),
    createData(
        "ORD127",
        "Charlie White",
        150,
        "Canceled",
        "2024-11-03",
        "Customer request",
        [
            {
                name: "Product F",
                amount: 1,
                price: 150,
                image: "https://via.placeholder.com/100",
            },
        ],
    ),
];

export default function OrdersTable() {
    const [rows, setRows] = React.useState(initialRows);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [search, setSearch] = React.useState("");
    const [status, setStatus] = React.useState("all");
    const [dateRange, setDateRange] = React.useState("all");
    const [customStartDate, setCustomStartDate] = React.useState("");
    const [customEndDate, setCustomEndDate] = React.useState("");
    const [selectedOrder, setSelectedOrder] = React.useState(null);
    const [selectedOrderId, setSelectedOrderId] = React.useState(null);
    const [isOrderDetailDialogOpen, setIsOrderDetailDialogOpen] =
        React.useState(false);
    const [isCanceledReasonDialogOpen, setIsCanceledReasonDialogOpen] =
        React.useState(false);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleChangeStatus = (event, orderId) => {
        const updatedRows = [...rows];
        const newStatus = event.target.value;

        if (newStatus === "Canceled") {
            setIsCanceledReasonDialogOpen(true);
            setSelectedOrderId(orderId);
        } else {
            updateOrderStatus(updatedRows, orderId, newStatus);
        }
    };

    const updateOrderStatus = (updatedRows, orderId, newStatus) => {
        const orderIndex = updatedRows.findIndex(
            (order) => order.orderId === orderId,
        );
        if (orderIndex !== -1) {
            updatedRows[orderIndex].orderStatus = newStatus;
            setRows(updatedRows);
        }
    };

    const handleSaveCanceledReason = (reason) => {
        if (selectedOrderId) {
            const updatedRows = [...rows];
            updateOrderStatus(updatedRows, selectedOrderId, "Canceled");
            const orderIndex = updatedRows.findIndex(
                (order) => order.orderId === selectedOrderId,
            );
            if (orderIndex !== -1) {
                updatedRows[orderIndex].cancelReason = reason;
            }
            setRows(updatedRows);
        }
        setIsCanceledReasonDialogOpen(false);
        setSelectedOrderId(null);
    };

    const handleSearchChange = (value) => {
        setSearch(value);
    };

    const handleStatusChange = (value) => {
        setStatus(value);
    };

    const handleDateRangeChange = (value) => {
        setDateRange(value);
        if (value !== "custom") {
            setCustomStartDate("");
            setCustomEndDate("");
        }
    };

    const handleCustomDateChange = (value, type) => {
        if (type === "start") setCustomStartDate(value);
        if (type === "end") setCustomEndDate(value);
    };

    const handleOpenOrderDetailDialog = (order) => {
        setSelectedOrder(order);
        setIsOrderDetailDialogOpen(true);
    };

    const handleCloseOrderDetailDialog = () => {
        setIsOrderDetailDialogOpen(false);
        setSelectedOrder(null);
    };

    const filterRows = (
        rows,
        search,
        status,
        dateRange,
        customStartDate,
        customEndDate,
    ) => {
        return rows.filter((row) => {
            const matchesStatus =
                status === "all" || row.orderStatus === status;
            const matchesSearch =
                row.customerName.toLowerCase().includes(search.toLowerCase()) ||
                row.orderId.toLowerCase().includes(search.toLowerCase());

            let matchesDateRange = true;
            const orderDate = new Date(row.orderDate);

            if (dateRange === "all") {
            } else if (dateRange === "today") {
                const today = new Date();
                matchesDateRange =
                    orderDate.toDateString() === today.toDateString();
            } else if (dateRange === "yesterday") {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                matchesDateRange =
                    orderDate.toDateString() === yesterday.toDateString();
            } else if (dateRange === "thisWeek") {
                const today = new Date();
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay());
                matchesDateRange =
                    orderDate >= startOfWeek && orderDate <= today;
            } else if (dateRange === "thisMonth") {
                const today = new Date();
                matchesDateRange =
                    orderDate.getMonth() === today.getMonth() &&
                    orderDate.getFullYear() === today.getFullYear();
            } else if (
                dateRange === "custom" &&
                customStartDate &&
                customEndDate
            ) {
                const startDate = new Date(customStartDate);
                const endDate = new Date(customEndDate);
                matchesDateRange =
                    orderDate >= startDate && orderDate <= endDate;
            }

            return matchesStatus && matchesSearch && matchesDateRange;
        });
    };

    const filteredRows = filterRows(
        rows,
        search,
        status,
        dateRange,
        customStartDate,
        customEndDate,
    );

    return (
        <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
            <OrderBar
                search={search}
                onSearchChange={setSearch}
                status={status}
                onStatusChange={setStatus}
                dateRange={dateRange}
                onDateRangeChange={handleDateRangeChange}
                customStartDate={customStartDate}
                customEndDate={customEndDate}
                onCustomDateChange={handleCustomDateChange}
                statusOptions={[
                    { value: "all", label: "Tất cả" },
                    { value: "Pending", label: "Pending" },
                    { value: "Shipped", label: "Shipped" },
                    { value: "Delivered", label: "Delivered" },
                    { value: "Canceled", label: "Canceled" },
                ]}
            />
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
                        {filteredRows
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage,
                            )
                            .map((row, index) => {
                                const isEven = index % 2 === 0;
                                return (
                                    <StyledTableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={row.orderId}
                                        isEven={isEven}
                                    >
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return column.id ===
                                                "orderStatus" ? (
                                                <StatusTableCell
                                                    key={column.id}
                                                    align="center"
                                                    status={value}
                                                >
                                                    {value}
                                                </StatusTableCell>
                                            ) : column.id === "seeDetail" ? (
                                                <TableCell
                                                    key={column.id}
                                                    align="center"
                                                    style={{ padding: "16px" }}
                                                >
                                                    <Visibility
                                                        style={{
                                                            cursor: "pointer",
                                                            fontSize: 20,
                                                        }}
                                                        onClick={() =>
                                                            handleOpenOrderDetailDialog(
                                                                row,
                                                            )
                                                        }
                                                    />
                                                </TableCell>
                                            ) : column.id === "changeStatus" ? (
                                                <TableCell
                                                    key={column.id}
                                                    align="center"
                                                    style={{ padding: "16px" }}
                                                >
                                                    <FormControl fullWidth>
                                                        <Select
                                                            labelId={`status-label-${row.orderId}`}
                                                            value={
                                                                row.orderStatus
                                                            }
                                                            onChange={(e) =>
                                                                handleChangeStatus(
                                                                    e,
                                                                    row.orderId,
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
                                                            <MenuItem value="Pending">
                                                                Pending
                                                            </MenuItem>
                                                            <MenuItem value="Shipped">
                                                                Shipped
                                                            </MenuItem>
                                                            <MenuItem value="Delivered">
                                                                Delivered
                                                            </MenuItem>
                                                            <MenuItem value="Canceled">
                                                                Canceled
                                                            </MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                            ) : (
                                                <TableCell
                                                    key={column.id}
                                                    align="center"
                                                    style={{ padding: "16px" }}
                                                >
                                                    {column.format &&
                                                    typeof value === "number"
                                                        ? column.format(value)
                                                        : value}
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

            {selectedOrder && (
                <OrderDetailDialog
                    open={isOrderDetailDialogOpen}
                    onClose={handleCloseOrderDetailDialog}
                    order={selectedOrder}
                />
            )}

            <CanceledReasonDialog
                open={isCanceledReasonDialogOpen}
                onClose={() => setIsCanceledReasonDialogOpen(false)}
                onSave={handleSaveCanceledReason}
            />
        </Paper>
    );
}
