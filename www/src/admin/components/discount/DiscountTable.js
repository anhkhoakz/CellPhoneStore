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
import { Edit, Delete } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import SearchBar from "../header/SearchBar";
import AddDiscountDialog from "./discount-modal/AddDiscountDialog";
import EditDiscountDialog from "./discount-modal/EditDiscountDialog";
import Confirm from "../../../components/Confirm";

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
    { id: "code", label: "Discount Code", minWidth: 150 },
    { id: "description", label: "Description", minWidth: 200 },
    { id: "type", label: "Discount Value", minWidth: 150 },
    { id: "condition", label: "Condition", minWidth: 200 },
    { id: "expiryDate", label: "Expiry Date", minWidth: 150 },
    { id: "quantity", label: "Open Quantity", minWidth: 150 },
    { id: "quantityUsed", label: "Used Quantity", minWidth: 150 },
    { id: "actions", label: "Actions", minWidth: 150 },
];

const createData = (
    code,
    description,
    discount,
    condition,
    expiryDate,
    quantity,
    quantityUsed
) => ({
    code,
    description,
    discount,
    condition,
    expiryDate,
    quantity,
    quantityUsed,
});

const initialRows = [
    createData(
        "DISC10",
        "10% off on orders over $50",
        "10%",
        "Order > $50",
        "2024-12-31",
        100,
        25
    ),
];

export default function DiscountsTable() {
    const [rows, setRows] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [search, setSearch] = React.useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
    const [selectedDiscount, setSelectedDiscount] = React.useState(null);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);
    const [discountToDelete, setDiscountToDelete] = React.useState(null);

    React.useEffect(() => {
        const fetchDiscounts = async () => {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/coupons`
            );
            const data = await response.json();

            console.log(data.data);

            setRows(data.data);
        };

        fetchDiscounts();
    }, []);

    const handleDelete = () => {
        setRows(rows.filter((row) => row.code !== discountToDelete.code));
        setIsConfirmDialogOpen(false);
        setDiscountToDelete(null);
    };

    const handleDeleteClick = (discount) => {
        setDiscountToDelete(discount);
        setIsConfirmDialogOpen(true);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleSearchChange = (value) => {
        setSearch(value);
    };

    const handleAddDiscount = (newDiscount) => {
        setRows((prevRows) => [...prevRows, newDiscount]);
        setIsAddDialogOpen(false);
    };

    const handleEditClick = (code) => {
        const discount = rows.find((row) => row.code === code);
        setSelectedDiscount(discount);
        setIsEditDialogOpen(true);
    };

    const handleEditDiscount = (updatedDiscount) => {
        setRows((prevRows) =>
            prevRows.map((row) =>
                row.code === updatedDiscount.code ? updatedDiscount : row
            )
        );
        setIsEditDialogOpen(false);
    };

    const filteredRows = rows.filter((row) => {
        return (
            row.code.toLowerCase().includes(search.toLowerCase()) ||
            row.description.toLowerCase().includes(search.toLowerCase())
        );
    });

    const renderTableCell = (column, value, row) => {
        if (column.id === "condition") {
            const formattedCondition = Object.entries(value || {})
                .map(([key, val]) => `${key}: ${val}`)
                .join(", ");

            return (
                <TableCell
                    key={column.id}
                    align="center"
                    style={{ padding: "1em" }}
                >
                    {formattedCondition || "N/A"}
                </TableCell>
            );
        }

        if (column.id === "expiryDate") {
            const formattedDate = new Date(value).toLocaleDateString(
                undefined,
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                }
            );

            return (
                <TableCell
                    key={column.id}
                    align="center"
                    style={{ padding: "1em" }}
                >
                    {`${formattedDate}`}
                </TableCell>
            );
        }

        if (column.id === "type") {
            return (
                <TableCell
                    key={column.id}
                    align="center"
                    style={{ padding: "1em" }}
                >
                    {value === "percentage"
                        ? `${row.discount}%`
                        : new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                          }).format(row.discount)}
                </TableCell>
            );
        }

        if (column.id === "discount" || column.id !== "actions") {
            return (
                <TableCell
                    key={column.id}
                    align="center"
                    style={{ padding: "1em" }}
                >
                    {value}
                </TableCell>
            );
        }
        return (
            <TableCell
                key={column.id}
                align="center"
                style={{ padding: "1em" }}
            >
                <IconButton
                    aria-label="edit"
                    color="primary"
                    onClick={() => handleEditClick(row.code)}
                >
                    <Edit />
                </IconButton>
                <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={() => handleDeleteClick(row)}
                >
                    <Delete />
                </IconButton>
            </TableCell>
        );
    };

    return (
        <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
            <SearchBar
                search={search}
                onSearchChange={handleSearchChange}
                addLabel="Add Discount"
                onAddClick={() => setIsAddDialogOpen(true)}
                searchPlaceholder="Search by Discount Code or Description"
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
                                        key={row.code}
                                        isEven={isEven}
                                    >
                                        {columns.map((column) =>
                                            renderTableCell(
                                                column,
                                                row[column.id],
                                                row
                                            )
                                        )}
                                    </StyledTableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <AddDiscountDialog
                open={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                onSave={handleAddDiscount}
            />
            <EditDiscountDialog
                open={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                onSave={handleEditDiscount}
                discountData={selectedDiscount}
            />
            <Confirm
                open={isConfirmDialogOpen}
                message="Are you sure you want to delete this discount?"
                onClose={() => setIsConfirmDialogOpen(false)}
                onConfirm={handleDelete}
            />
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
