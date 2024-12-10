import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import { Grid, IconButton, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import Confirm from "../Confirm"; // Import the Confirm component

const CartItem = ({ item, onQuantityChange, onRemoveItem }) => {
    const [isConfirmOpen, setConfirmOpen] = useState(false);

    const handleInputChange = (e) => {
        const newQuantity = parseInt(e.target.value, 10);
        if (newQuantity > 0) {
            onQuantityChange(item.id, newQuantity - item.quantity);
        } else {
            setConfirmOpen(true);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const handleRemoveClick = () => {
        if (item.quantity > 1) {
            onQuantityChange(item.id, -1);
        } else {
            setConfirmOpen(true);
        }
    };

    const handleConfirmRemove = () => {
        onRemoveItem(item.id);
        setConfirmOpen(false);
    };

    const handleCloseConfirm = () => {
        setConfirmOpen(false);
    };

    return (
        <>
            <Grid
                container
            
                spacing={2}
                margin={"auto"}
                alignItems="center"
                sx={{
                    marginBottom:  "1px solid #f0f0f0",
                    paddingBottom: 2,
                    flexDirection: { xs: "column", sm: "row" },
                    textAlign: { xs: "center", sm: "left" },
                }}
            >
                <Grid
                    item
                    xs={12}
                    sm={2}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <img
                        src={`${process.env.REACT_APP_BACKEND_URL}/images/${item.image}`}
                        alt={item.name}
                        style={{
                            marginTop: "1em",
                            maxWidth: "150px",
                            maxHeight: "150px",
                            borderRadius: "8px",
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={3}>
                    <Typography variant="body1" noWrap>
                        {item.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {item.category}
                    </Typography>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={3}
                    display="flex"
                    alignItems="center"
                    justifyContent={{ xs: "center", sm: "flex-start" }}
                >
                    <IconButton
                        onClick={handleRemoveClick}
                        aria-label="reduce quantity"
                    >
                        <RemoveIcon />
                    </IconButton>
                    <TextField
                        variant="outlined"
                        type="number"
                        value={item.quantity}
                        onChange={handleInputChange}
                        inputProps={{
                            min: 0,
                            style: { textAlign: "center", width: "50px" },
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                        }}
                        sx={{
                            "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                                {
                                    display: "none",
                                },
                            "& input[type=number]": {
                                MozAppearance: "textfield",
                            },
                        }}
                    />
                    <IconButton
                        onClick={() => onQuantityChange(item.id, 1)}
                        aria-label="increase quantity"
                    >
                        <AddIcon />
                    </IconButton>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={2}
                    sx={{ textAlign: { xs: "center", sm: "right" } }}
                >
                    <Typography variant="body1">
                        {formatPrice(item.price.toFixed(2))}
                    </Typography>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={1}
                    display="flex"
                    justifyContent={{ xs: "center", sm: "flex-end" }}
                >
                    <IconButton
                        onClick={() => setConfirmOpen(true)}
                        aria-label="remove item"
                        color="inherit"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Grid>
            </Grid>

            <Confirm
                open={isConfirmOpen}
                message={`Are you sure you want to delete the product "${item.name}"?`}
                onClose={handleCloseConfirm}
                onConfirm={handleConfirmRemove}
            />
        </>
    );
};

export default CartItem;
