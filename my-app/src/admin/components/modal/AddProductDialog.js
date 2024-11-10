import * as React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, IconButton } from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';

export default function AddProductDialog({ open, onClose, onSave }) {
    const [productData, setProductData] = React.useState({
        productId: '',
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        colors: [] 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleColorChange = (index, field, value) => {
        const updatedColors = [...productData.colors];
        updatedColors[index] = { ...updatedColors[index], [field]: value };
        setProductData((prevData) => ({ ...prevData, colors: updatedColors }));
    };

    const handleAddColor = () => {
        setProductData((prevData) => ({
            ...prevData,
            colors: [...prevData.colors, { color: '', image: null }]
        }));
    };

    const handleRemoveColor = (index) => {
        const updatedColors = productData.colors.filter((_, i) => i !== index);
        setProductData((prevData) => ({ ...prevData, colors: updatedColors }));
    };

    const handleImageUpload = (index, file) => {
        const updatedColors = [...productData.colors];
        updatedColors[index].image = file;
        setProductData((prevData) => ({ ...prevData, colors: updatedColors }));
    };

    const handleSave = () => {
        if (isFormValid()) {
            onSave(productData);
            handleClose();
        }
    };

    const handleClose = () => {
        setProductData({
            productId: '',
            name: '',
            description: '',
            price: '',
            stockQuantity: '',
            colors: []
        });
        onClose();
    };

    const isFormValid = () => {
        const { productId, name, price, stockQuantity, colors } = productData;
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
            <DialogTitle>Thêm Sản Phẩm Mới</DialogTitle>
            <DialogContent>
                <TextField label="Product ID" name="productId" fullWidth margin="dense" value={productData.productId} onChange={handleChange} />
                <TextField label="Product Name" name="name" fullWidth margin="dense" value={productData.name} onChange={handleChange} />
                <TextField label="Description" name="description" fullWidth margin="dense" value={productData.description} onChange={handleChange} />
                <TextField label="Price" name="price" type="number" fullWidth margin="dense" value={productData.price} onChange={handleChange} />
                <TextField label="Stock Quantity" name="stockQuantity" type="number" fullWidth margin="dense" value={productData.stockQuantity} onChange={handleChange} />

                <div style={{ marginTop: '20px' }}>
                    <h4>Màu sắc và hình ảnh</h4>
                    {productData.colors.map((colorData, index) => (
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
                            {colorData.image && <span>{colorData.image.name}</span>}
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
