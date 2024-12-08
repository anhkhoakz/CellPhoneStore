import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
} from "@mui/material";
import * as React from "react";

import { AddCircle, Category, RemoveCircle } from "@mui/icons-material";

export default function AddProductDialog({ open, onClose, onSave }) {
    const categories = ["phone", "laptop", "tablet", "headphone"];

    const [productData, setProductData] = React.useState({
        category: "",
        name: "",
        description: "",
        price: "",
        stock: "",
        variants: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleColorChange = (index, field, value) => {
        const updatedvariants = [...productData.variants];
        updatedvariants[index] = { ...updatedvariants[index], [field]: value };
        setProductData((prevData) => ({
            ...prevData,
            variants: updatedvariants,
        }));
    };

    const handleAddColor = () => {
        setProductData((prevData) => ({
            ...prevData,
            variants: [
                ...prevData.variants,
                { name: "", image: null, price: prevData.price, quantity: "" },
            ],
        }));
    };

    const handleRemoveColor = (index) => {
        const updatedvariants = productData.variants.filter(
            (_, i) => i !== index,
        );
        setProductData((prevData) => ({
            ...prevData,
            variants: updatedvariants,
        }));
    };

    const handleImageUpload = (index, file) => {
        const updatedvariants = [...productData.variants];
        updatedvariants[index].image = file;
        setProductData((prevData) => ({
            ...prevData,
            variants: updatedvariants,
        }));
    };

    const handleSave = () => {
        if (isFormValid()) {
            const formData = new FormData();
            formData.append("name", productData.name);
            formData.append("price", productData.price);
            formData.append("description", productData.description);
            formData.append("category", productData.category);

            formData.append("stock", productData.stock);
            formData.append("image", productData.image);

            productData.variants.forEach((color, index) => {
                formData.append(`variants[${index}][name]`, color.name);
                formData.append(`variants[${index}][price]`, color.price);
                formData.append(`variants[${index}][stock]`, color.quantity);
                formData.append(`variants[${index}][image]`, color.image);
            });

            onSave(formData);
            handleClose();
        }
    };

    const handleClose = () => {
        setProductData({
            category: "",
            name: "",
            description: "",
            price: "",
            stock: "",
            variants: [],
        });
        onClose();
    };

    const isFormValid = () => {
        const { category, name, price, stock, variants, image } = productData;
        return (
            category &&
            name &&
            price &&
            stock &&
            image &&
            variants.every(
                (colorData) =>
                    colorData.name &&
                    colorData.image &&
                    colorData.price &&
                    colorData.quantity,
            )
        );
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Thêm Sản Phẩm Mới</DialogTitle>
            <DialogContent>
                <TextField
                    label="Product Name"
                    name="name"
                    fullWidth
                    margin="dense"
                    value={productData.name}
                    onChange={handleChange}
                />
                <TextField
                    label="Description"
                    name="description"
                    fullWidth
                    margin="dense"
                    value={productData.description}
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
                    value={productData.category}
                    onChange={(_event, newValue) => {
                        if (categories.includes(newValue)) {
                            setProductData((prevData) => ({
                                ...prevData,
                                category: newValue,
                            }));
                        } else {
                            setProductData((prevData) => ({
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
                    value={productData.price}
                    onChange={handleChange}
                />
                <TextField
                    label="Stock Quantity"
                    name="stock"
                    type="number"
                    fullWidth
                    margin="dense"
                    value={productData.stock}
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
                            setProductData((prevData) => ({
                                ...prevData,
                                image: e.target.files[0],
                            }))
                        }
                    />
                </Button>

                <div style={{ marginTop: "1.25em" }}>
                    <h4>Màu sắc và hình ảnh</h4>
                    {productData.variants.map((colorData, index) => (
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
                                value={colorData.color}
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
                                label="Quantity"
                                name="quantity"
                                type="number"
                                value={colorData.quantity || ""}
                                onChange={(e) =>
                                    handleColorChange(
                                        index,
                                        "quantity",
                                        e.target.value,
                                    )
                                }
                                inputProps={{ min: 0 }}
                                style={{ width: "100px" }}
                            />
                            <Button variant="outlined" component="label">
                                Upload
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
                            {colorData.image && (
                                <span>{colorData.image.name}</span>
                            )}
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
