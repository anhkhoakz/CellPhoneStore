import { Visibility } from "@mui/icons-material";
import { FormControl, MenuItem, Select } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import * as React from "react";
import OrderBar from "./OrderBar";
import CanceledReasonDialog from "./order-modal/CanceledReasonDialog";
import OrderDetailDialog from "./order-modal/OrderDetailDialog";
import ToastNoti from "../../../components/toast-noti/ToastNoti";

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
        status === "cancelled"
            ? theme.palette.error.main
            : status === "delivered"
            ? theme.palette.success.main
            : status === "pending"
            ? "#FF9800"
            : theme.palette.text.primary,
    fontWeight: "bold",
    padding: "16px",
}));

const columns = [
    { id: "_id", label: "Order ID", minWidth: 170 },
    { id: "name", label: "Customer Name", minWidth: 170 },
    { id: "totalAmount", label: "Total Amount", minWidth: 170 },
    { id: "status", label: "Order Status", minWidth: 170 },
    { id: "createdAt", label: "Order Date", minWidth: 170 },
    { id: "seeDetail", label: "See Detail", minWidth: 120 },
    { id: "changeStatus", label: "Change Status", minWidth: 170 },
];

export default function OrdersTable() {
    const [rows, setRows] = React.useState([]);
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

    const [toastMessage, setToastMessage] = React.useState("");
    const [toastType, setToastType] = React.useState("success");

    React.useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/orders`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data.message);
                setRows(data.message);
            });
    }, []);

    const handleChangePage = (_event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleChangeStatus = (event, orderId) => {
        const updatedRows = [...rows];
        const newStatus = event.target.value;

        if (newStatus === "cancelled") {
            setIsCanceledReasonDialogOpen(true);
            setSelectedOrderId(orderId);
        } else {
            updateStatus(updatedRows, orderId, newStatus);
        }
    };

    const updateStatus = (updatedRows, orderId, newStatus) => {
        const orderIndex = updatedRows.findIndex(
            (order) => order._id === orderId
        );
        if (orderIndex !== -1) {
            fetch(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/orders/${orderId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({ status: newStatus }),
                }
            )
                .then((res) => res.json())
                .then((data) => {
                    console.log(data.message);
                    if (data.success) {
                        updatedRows[orderIndex].status = newStatus;
                        setRows(updatedRows);

                        setToastType("success");
                        setToastMessage(data.message);
                    } else {
                        setToastType("error");
                        setToastMessage(data.message);
                    }
                });

            setTimeout(() => {
                setToastMessage("");
            }, 3000);
        }
    };

    const handleSaveCanceledReason = (reason) => {
        if (selectedOrderId) {
            const updatedRows = [...rows];
            const orderIndex = updatedRows.findIndex(
                (order) => order._id === selectedOrderId
            );
            if (orderIndex !== -1) {
                fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/api/v1/orders/cancel/${selectedOrderId}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ noted: reason }),
                    }
                )
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(data.message);
                        if (data.success) {
                            updatedRows[orderIndex].status = "cancelled";
                            setRows(updatedRows);

							setToastType("success");
							setToastMessage(data.message);
                        }
						else {
							setToastType("error");
							setToastMessage(data.message);
						}
                    });

					setTimeout(() => { setToastMessage(""); } , 3000);
            }
        }
        setIsCanceledReasonDialogOpen(false);
        setSelectedOrderId(null);
    };

    const _handleSearchChange = (value) => {
        setSearch(value);
    };

    const _handleStatusChange = (value) => {
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
        customEndDate
    ) => {
        return rows.filter((row) => {
            const matchesStatus = status === "all" || row.status === status;
            const matchesSearch =
                row.shippingAddress.name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                row._id.toLowerCase().includes(search.toLowerCase());

            let matchesDateRange = true;
            const orderDate = new Date(row.createdAt);

            if (dateRange === "all") {
                matchesDateRange = true;
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
        customEndDate
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
                    { value: "all", label: "All" },
                    { value: "pending", label: "Pending" },
                    { value: "shipping", label: "Shipping" },
                    { value: "delivered", label: "Delivered" },
                    { value: "cancelled", label: "Cancelled" },
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
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((row, index) => {
                                const isEven = index % 2 === 0;
                                return (
                                    <StyledTableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={row._id}
                                        isEven={isEven}
                                    >
                                        {columns.map((column) => {
                                            let value;
                                            if (column.id === "name") {
                                                value =
                                                    row.shippingAddress.name;
                                            } else {
                                                value = row[column.id];
                                            }
                                            return column.id === "status" ? (
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
                                                                row
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
                                                            labelId={`status-label-${row._id}`}
                                                            value={row.status}
                                                            onChange={(e) =>
                                                                handleChangeStatus(
                                                                    e,
                                                                    row._id
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
                                                            <MenuItem value="pending">
                                                                Pending
                                                            </MenuItem>

                                                            <MenuItem value="confirmed">
                                                                Confirmed
                                                            </MenuItem>
                                                            <MenuItem value="shipping">
                                                                Shipping
                                                            </MenuItem>
                                                            <MenuItem value="delivered">
                                                                Delivered
                                                            </MenuItem>
                                                            <MenuItem value="cancelled">
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

            {/* Display Toast Notification */}
            {toastMessage && (
                <ToastNoti
                    message={toastMessage}
                    type={toastType}
                    position="top-right"
                    autoClose={3000}
                />
            )}
        </Paper>
    );
}
