import * as React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, IconButton } from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';

export default function EditProductDialog({ open, onClose, onSave, productData }) {
    const [editedProductData, setEditedProductData] = React.useState({
        productId: '',
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        colors: []
    });

    // Update editedProductData when productData changes (e.g., when a different product is being edited)
    React.useEffect(() => {
        if (productData) {
            setEditedProductData({ ...productData });
        }
    }, [productData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedProductData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleColorChange = (index, field, value) => {
        const updatedColors = [...editedProductData.colors];
        updatedColors[index] = { ...updatedColors[index], [field]: value };
        setEditedProductData((prevData) => ({ ...prevData, colors: updatedColors }));
    };

    const handleAddColor = () => {
        setEditedProductData((prevData) => ({
            ...prevData,
            colors: [...prevData.colors, { color: '', image: null }]
        }));
    };

    const handleRemoveColor = (index) => {
        const updatedColors = editedProductData.colors.filter((_, i) => i !== index);
        setEditedProductData((prevData) => ({ ...prevData, colors: updatedColors }));
    };

    const handleImageUpload = (index, file) => {
        const updatedColors = [...editedProductData.colors];
        updatedColors[index].image = file;
        setEditedProductData((prevData) => ({ ...prevData, colors: updatedColors }));
    };

    const handleSave = () => {
        if (isFormValid()) {
            onSave(editedProductData); // Pass edited data back to the parent
            handleClose();
        }
    };

    const handleClose = () => {
        setEditedProductData(productData); // Reset to original product data
        onClose();
    };

    const isFormValid = () => {
        const { productId, name, price, stockQuantity, colors } = editedProductData;
        return (
            productId &&
            name &&
            price &&
            stockQuantity &&
            colors.every(colorData => colorData.color && colorData.image)
        );
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Chỉnh sửa Sản Phẩm</DialogTitle>
            <DialogContent>
                <TextField
                    label="Product ID"
                    name="productId"
                    fullWidth
                    margin="dense"
                    value={editedProductData.productId}
                    onChange={handleChange}
                    disabled // Product ID is typically not editable
                />
                <TextField
                    label="Product Name"
                    name="name"
                    fullWidth
                    margin="dense"
                    value={editedProductData.name}
                    onChange={handleChange}
                />
                <TextField
                    label="Description"
                    name="description"
                    fullWidth
                    margin="dense"
                    value={editedProductData.description}
                    onChange={handleChange}
                />
                <TextField
                    label="Price"
                    name="price"
                    type="number"
                    fullWidth
                    margin="dense"
                    value={editedProductData.price}
                    onChange={handleChange}
                />
                <TextField
                    label="Stock Quantity"
                    name="stockQuantity"
                    type="number"
                    fullWidth
                    margin="dense"
                    value={editedProductData.stockQuantity}
                    onChange={handleChange}
                />

                <div style={{ marginTop: '20px' }}>
                    <h4>Màu sắc và hình ảnh</h4>
                    {editedProductData.colors.map((colorData, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <TextField
                                label="Color"
                                name="color"
                                fullWidth
                                value={colorData.color}
                                onChange={(e) => handleColorChange(index, 'color', e.target.value)}
                            />
                            <Button
                                variant="outlined"
                                component="label"
                            >
                                Upload
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => handleImageUpload(index, e.target.files[0])}
                                />
                            </Button>
                            {colorData.image && <span>{colorData.image.name || 'Current Image'}</span>}
                            <IconButton color="error" onClick={() => handleRemoveColor(index)}>
                                <RemoveCircle />
                            </IconButton>
                        </div>
                    ))}
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<AddCircle />}
                        onClick={handleAddColor}
                    >
                        Add Color
                    </Button>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">Cancel</Button>
                <Button onClick={handleSave} color="primary" variant="contained" disabled={!isFormValid()}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
