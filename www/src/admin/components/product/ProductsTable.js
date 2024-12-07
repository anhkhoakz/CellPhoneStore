import { Delete, Edit } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
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
import Confirm from "../../../components/Confirm";
import SearchBar from "../header/SearchBar";
import AddProductDialog from "./product-modal/AddProductDialog";
import EditProductDialog from "./product-modal/EditProductDialog";

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
    { id: "productId", label: "#", minWidth: 150 },
    { id: "image", label: "Image", minWidth: 100 },
    { id: "name", label: "Product Name", minWidth: 150 },
    { id: "description", label: "Description", minWidth: 200 },
    { id: "price", label: "Price", minWidth: 100 },
    { id: "stock", label: "Stock Quantity", minWidth: 150 },
    { id: "sold", label: "Sold Quantity", minWidth: 150 },
    { id: "actions", label: "Actions", minWidth: 150 },
];

export default function ProductsTable() {
    const [rows, setRows] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [search, setSearch] = React.useState("");
    const [status, setStatus] = React.useState("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState(null);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false); // State for confirm dialog
    const [productToDelete, setProductToDelete] = React.useState(null); // Product selected for deletion

    React.useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/products`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data.products);

                const rows = data.products;

                const sortedRows = rows.sort(
                    (a, b) => a.productId - b.productId,
                );

                setRows(rows);
                console.log("Rows:", sortedRows);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, []);

    const handleDelete = () => {
        setRows(
            rows.filter((row) => row.productId !== productToDelete.productId),
        );
        setIsConfirmDialogOpen(false);
        setProductToDelete(null);
    };

    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setIsConfirmDialogOpen(true); // Open confirm dialog
    };

    const handleChangePage = (_event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleSearchChange = (value) => {
        setSearch(value);
    };

    const handleStatusChange = (value) => {
        setStatus(value);
    };

    const handleAddProduct = (newProduct) => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/products`, {
            method: "POST",
            body: newProduct,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);

                setRows((prevRows) => [...prevRows, data.product]);
                setIsAddDialogOpen(false);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const handleEditClick = (productId) => {
        const product = rows.find((row) => row.productId === productId);

        if (product) {
            setSelectedProduct(product);
            setIsEditDialogOpen(true);
        } else {
            alert("Product not found for productId:", productId);
        }
    };

    const handleEditProduct = (updatedProduct) => {
        const formData = new FormData();
        formData.append("name", updatedProduct.name);
        formData.append("description", updatedProduct.description);
        formData.append("category", updatedProduct.category);
        formData.append("price", updatedProduct.price);
        formData.append("stock", updatedProduct.stock);
        formData.append("image", updatedProduct.image);

        updatedProduct.variants.forEach((variant, index) => {
            formData.append(`variants[${index}][name]`, variant.name);
            formData.append(`variants[${index}][price]`, variant.price);
            formData.append(`variants[${index}][stock]`, variant.stock);
            formData.append(`variants[${index}][image]`, variant.image);
        });

        fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/products/${updatedProduct.productId}`,
            {
                method: "PATCH",
                body: formData,
            },
        )
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);

                setRows((prevRows) =>
                    prevRows.map((row) =>
                        row.productId === updatedProduct.productId
                            ? updatedProduct
                            : row,
                    ),
                );
                setIsEditDialogOpen(false);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const filteredRows = rows.filter((row) => {
        const matchesStatus =
            status === "all" ||
            (status === "inStock" && row.stock > 0) ||
            (status === "outOfStock" && row.stock === 0);

        const matchesSearch =
            row.name?.toLowerCase().includes(search.toLowerCase()) ||
            row.productId?.toString().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
            <SearchBar
                search={search}
                onSearchChange={handleSearchChange}
                status={status}
                onStatusChange={handleStatusChange}
                addLabel="Add Product"
                onAddClick={() => setIsAddDialogOpen(true)}
                searchPlaceholder="Search by Product ID or Name"
                statusLabel="Stock Status"
                statusOptions={[
                    { value: "all", label: "All" },
                    { value: "inStock", label: "In Stock" },
                    { value: "outOfStock", label: "Out of Stock" },
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
                                page * rowsPerPage + rowsPerPage,
                            )
                            .map((row, index) => {
                                const isEven = index % 2 === 0;
                                return (
                                    <StyledTableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={row.productId}
                                        isEven={isEven}
                                    >
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return column.id === "price" ? (
                                                <TableCell
                                                    key={column.id}
                                                    align="center"
                                                    style={{ padding: "1em" }}
                                                >
                                                    ${value}
                                                </TableCell>
                                            ) : column.id === "image" ? (
                                                <TableCell
                                                    key={column.id}
                                                    align="center"
                                                    style={{ padding: "1em" }}
                                                >
                                                    <img
                                                        src={`${process.env.REACT_APP_BACKEND_URL}/images/${row.image}`}
                                                        alt={row.name}
                                                        style={{
                                                            width: "50px",
                                                            height: "50px",
                                                        }}
                                                    />
                                                </TableCell>
                                            ) : column.id === "actions" ? (
                                                <TableCell
                                                    key={column.id}
                                                    align="center"
                                                    style={{ padding: "1em" }}
                                                >
                                                    <IconButton
                                                        aria-label="edit"
                                                        color="primary"
                                                        onClick={() =>
                                                            handleEditClick(
                                                                row.productId,
                                                            )
                                                        }
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                    <IconButton
                                                        aria-label="delete"
                                                        color="error"
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                row,
                                                            )
                                                        }
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </TableCell>
                                            ) : (
                                                <TableCell
                                                    key={column.id}
                                                    align="center"
                                                    style={{ padding: "1em" }}
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
            <AddProductDialog
                open={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                onSave={handleAddProduct}
            />
            <EditProductDialog
                open={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                onSave={handleEditProduct}
                productData={selectedProduct}
            />
            <Confirm
                open={isConfirmDialogOpen}
                message="Are you sure you want to delete this product?"
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
