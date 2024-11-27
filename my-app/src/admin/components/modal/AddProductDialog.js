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
import { AddCircle, Category, RemoveCircle } from "@mui/icons-material";

export default function AddProductDialog({ open, onClose, onSave }) {
    const [productData, setProductData] = React.useState({
        category: "",
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        colors: [],
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
            colors: [...prevData.colors, { color: "", image: null }],
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
            const formData = new FormData();
            formData.append("name", productData.name);
            formData.append("price", productData.price);
            formData.append("description", productData.description);
            formData.append("category", productData.category);

            formData.append("stockQuantity", productData.stockQuantity);
            formData.append("image", productData.image);
            productData.colors.forEach((color, index) => {
                formData.append(`colors[${index}][color]`, color.color);
                formData.append(`colors[${index}][image]`, color.image);
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
            stockQuantity: "",
            colors: [],
        });
        onClose();
    };

    const isFormValid = () => {
        const { category, name, price, stockQuantity, colors, image } = productData;
        return (
            category &&
            name &&
            price &&
            stockQuantity &&
            image &&
            colors.every((colorData) => colorData.color && colorData.image)
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
                <TextField
                    label="Category"
                    name="category"
                    fullWidth
                    margin="dense"
                    value={productData.category}
                    onChange={handleChange}
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
                    name="stockQuantity"
                    type="number"
                    fullWidth
                    margin="dense"
                    value={productData.stockQuantity}
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

                <div style={{ marginTop: "20px" }}>
                    <h4>Màu sắc và hình ảnh</h4>
                    {productData.colors.map((colorData, index) => (
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
                                name="color"
                                value={colorData.color}
                                onChange={(e) =>
                                    handleColorChange(
                                        index,
                                        "color",
                                        e.target.value
                                    )
                                }
                            />
                            <TextField
                                label="Quantity"
                                name="quantity"
                                type="number"
                                value={colorData.quantity || ""}
                                onChange={(e) =>
                                    handleColorChange(index, "quantity", e.target.value)
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
                                            e.target.files[0]
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
