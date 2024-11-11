import * as React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import SearchBar from './SearchBar';
import SaleProductsTable from './SaleProductsTable';
import Confirm from '../../components/Confirm';
import AddSaleProductDialog from './modal/AddSaleProductDialog';

// Define initialRows here
const initialRows = [
  { productId: 'PROD001', name: 'Smartphone', originalPrice: 599, salePrice: 499, endTime: '2024-12-31', stockQuantity: 100 },
  { productId: 'PROD002', name: 'Laptop', originalPrice: 1299, salePrice: 1099, endTime: '2024-12-15', stockQuantity: 50 },
  { productId: 'PROD003', name: 'Headphones', originalPrice: 199, salePrice: 149, endTime: '2024-11-20', stockQuantity: 200 },
];

export default function EditSaleProductList() {
  const [rows, setRows] = React.useState(initialRows);
  const [filteredRows, setFilteredRows] = React.useState(initialRows);
  const [search, setSearch] = React.useState('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    const updatedRows = rows.filter((row) => row.productId !== productToDelete);
    setRows(updatedRows);
    setFilteredRows(updatedRows.filter((row) => filterRows(row, search)));
    setIsConfirmDialogOpen(false);
    setProductToDelete(null);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setFilteredRows(rows.filter((row) => filterRows(row, value)));
  };

  const filterRows = (row, searchValue) => {
    return (
      row.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      row.productId.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  const handleAddProduct = (newProduct) => {
    const updatedRows = [...rows, newProduct];
    setRows(updatedRows);
    setFilteredRows(updatedRows.filter((row) => filterRows(row, search)));
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', padding: 2 }}>
      <Box mb={2}>
        <SearchBar
          search={search}
          onSearchChange={handleSearchChange}
          addLabel="Add Product"
          onAddClick={() => setIsAddDialogOpen(true)}
          searchPlaceholder="Search products..."
        />
      </Box>
      <SaleProductsTable rows={filteredRows} onDelete={handleDeleteClick} />

      <Confirm
        open={isConfirmDialogOpen}
        message="Are you sure you want to delete this product?"
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <AddSaleProductDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddProduct}
      />
    </Paper>
  );
}
