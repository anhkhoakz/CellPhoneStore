import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";

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
	{ id: "productId", label: "Product ID", minWidth: 100 },
	{ id: "name", label: "Name", minWidth: 150 },
	{ id: "originalPrice", label: "Original Price", minWidth: 100, format: (value) => `$${value}` },
	{ id: "salePrice", label: "Sale Price", minWidth: 100, format: (value) => `$${value}` },
	{ id: "endTime", label: "Sale End Time", minWidth: 170 },
	{ id: "stockQuantity", label: "In Stock", minWidth: 100 }, // Added In Stock column
	{ id: "delete", label: "Delete", minWidth: 100 },
];

export default function SaleProductsTable({ rows, onDelete }) {
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
		<TableContainer sx={{ maxHeight: 440 }}>
			<Table stickyHeader aria-label="sale products table">
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
					{rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
						const isEven = index % 2 === 0;
						return (
							<StyledTableRow hover role="checkbox" tabIndex={-1} key={row.productId} isEven={isEven}>
								{columns.map((column) => {
									const value = row[column.id];
									return column.id === "delete" ? (
										<TableCell key={column.id} align="center">
											<IconButton
												aria-label="delete"
												color="error"
												onClick={() => onDelete(row.productId)}
											>
												<DeleteIcon />
											</IconButton>
										</TableCell>
									) : (
										<TableCell key={column.id} align="center">
											{column.format && typeof value === "number" ? column.format(value) : value}
										</TableCell>
									);
								})}
							</StyledTableRow>
						);
					})}
				</TableBody>
			</Table>
			<TablePagination
				rowsPerPageOptions={[10, 25, 100]}
				component="div"
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</TableContainer>
	);
}
