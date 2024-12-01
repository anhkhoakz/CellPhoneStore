import * as React from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    IconButton,
} from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { Autocomplete } from "@mui/material";

export default function EditProductDialog({
    open,
    onClose,
    onSave,
    productData,
}) {
    const categories = ["phone", "laptop", "ipad"];

    const [editedProductData, setEditedProductData] = React.useState({
        productId: "",
        name: "",
        description: "",
        price: "",
        stock: "",
        variants: [],
    });

    // Update editedProductData when productData changes (e.g., when a different product is being edited)
    React.useEffect(() => {
        if (productData && productData.productId) {
            setEditedProductData({ ...productData });
        }
    }, [productData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedProductData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleColorChange = (index, field, value) => {
        const updatedvariants = [...editedProductData.variants];
        updatedvariants[index] = { ...updatedvariants[index], [field]: value };
        setEditedProductData((prevData) => ({
            ...prevData,
            variants: updatedvariants,
        }));
    };

    const handleAddColor = () => {
        setEditedProductData((prevData) => ({
            ...prevData,
            variants: [
                ...prevData.variants,
                { name: "", image: null, price: prevData.price, quantity: "" },
            ],
        }));
    };

    const handleRemoveColor = (index) => {
        const updatedvariants = editedProductData.variants.filter(
            (_, i) => i !== index,
        );
        setEditedProductData((prevData) => ({
            ...prevData,
            variants: updatedvariants,
        }));
    };

    const handleImageUpload = (index, file) => {
        const updatedvariants = [...editedProductData.variants];
        updatedvariants[index].image = file;
        setEditedProductData((prevData) => ({
            ...prevData,
            variants: updatedvariants,
        }));
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
        const { productId, name, price, stock, variants } = editedProductData;
        return (
            productId &&
            name &&
            price &&
            stock &&
            variants.every(
                (colorData) =>
                    colorData.name && colorData.image && colorData.price,
            )
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

                <Autocomplete
                    options={categories}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Category"
                            name="category"
                            fullWidth
                            margin="dense"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: <></>, // Remove the clear and close buttons
                            }}
                        />
                    )}
                    value={editedProductData.category}
                    onChange={(event, newValue) => {
                        if (categories.includes(newValue)) {
                            setEditedProductData((prevData) => ({
                                ...prevData,
                                category: newValue,
                            }));
                        } else {
                            setEditedProductData((prevData) => ({
                                ...prevData,
                                category: "",
                            }));
                        }
                    }}
                    isOptionEqualToValue={(option, value) => option === value} // Ensure equality is based on value matching
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
                    name="stock"
                    type="number"
                    fullWidth
                    margin="dense"
                    value={editedProductData.stock}
                    onChange={handleChange}
                />

                <Button variant="outlined" component="label">
                    Main Image
                    <input
                        name="image"
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) =>
                            setEditedProductData((prevData) => ({
                                ...prevData,
                                image: e.target.files[0],
                            }))
                        }
                    />
                </Button>

                <div style={{ marginTop: "1.25em" }}>
                    <h4>Màu sắc và hình ảnh</h4>
                    {editedProductData.variants.map((colorData, index) => (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                marginBottom: "10px",
                            }}
                        >
                            <TextField
                                label="Color"
                                name="name"
                                fullWidth
                                value={colorData.name || ""}
                                onChange={(e) =>
                                    handleColorChange(
                                        index,
                                        "name",
                                        e.target.value,
                                    )
                                }
                            />

                            <TextField
                                label="Price"
                                name="price"
                                type="number"
                                value={colorData.price || ""}
                                onChange={(e) =>
                                    handleColorChange(
                                        index,
                                        "price",
                                        e.target.value,
                                    )
                                }
                            />

                            <TextField
                                label="Stock Quantity"
                                name="stock"
                                type="number"
                                value={colorData.stock || ""}
                                onChange={(e) =>
                                    handleColorChange(
                                        index,
                                        "stock",
                                        e.target.value,
                                    )
                                }
                            />
                            <Button variant="outlined" component="label">
                                Image
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) =>
                                        handleImageUpload(
                                            index,
                                            e.target.files[0],
                                        )
                                    }
                                />
                            </Button>
                            <IconButton
                                color="error"
                                onClick={() => handleRemoveColor(index)}
                            >
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
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    color="primary"
                    variant="contained"
                    disabled={!isFormValid()}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
