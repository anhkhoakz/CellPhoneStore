import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export default function AddDiscountDialog({ open, onClose, onSave }) {
    const [formData, setFormData] = React.useState({
        discountCode: "",
        description: "",
        discountValue: "",
        discountType: "", // Thêm kiểu giảm giá (percentage or fixed)
        minimumOrderValue: "",
        discountedProductType: "",
        expiryDate: null,
        openQuantity: "",
        usedQuantity: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onSave(formData);
        setFormData({
            discountCode: "",
            description: "",
            discountValue: "",
            discountType: "",
            minimumOrderValue: "",
            discountedProductType: "",
            expiryDate: null,
            openQuantity: "",
            usedQuantity: "",
        });
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Discount</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Discount Code"
                    type="text"
                    name="discountCode"
                    fullWidth
                    variant="standard"
                    onChange={handleChange}
                    inputProps={{
                        style: { textTransform: "uppercase" } 
                    }}
                />


                <TextField
                    margin="dense"
                    label="Description"
                    type="text"
                    name="description"
                    fullWidth
                    variant="standard"
                    onChange={handleChange}
                />

                <TextField
                    margin="dense"
                    label="Discount Type"
                    name="discountType"
                    select
                    value={formData.discountType}
                    onChange={handleChange}
                    fullWidth
                    variant="standard"
                    sx={{
                        borderRadius: "8px",
                        backgroundColor: "#f5f5f5",
                        "& .MuiSelect-icon": {
                            color: "#3f51b5",
                        },
                    }}
                >
                    <MenuItem value="percentage">Percentage</MenuItem>
                    <MenuItem value="fixed">Fixed Amount</MenuItem>
                </TextField>


                <TextField
                    margin="dense"
                    label="Discount Value"
                    type="number"
                    name="discountValue"
                    fullWidth
                    variant="standard"
                    onChange={handleChange}
                />

                <TextField
                    margin="dense"
                    label="Minimum Order Value"
                    type="number"
                    name="minimumOrderValue"
                    fullWidth
                    variant="standard"
                    onChange={handleChange}
                />

                <TextField
                    margin="dense"
                    label="Discounted Product Type"
                    name="discountedProductType"
                    select
                    multiple
                    value={formData.discountedProductType}
                    onChange={handleChange}
                    fullWidth
                    variant="standard"
                    sx={{
                        borderRadius: "8px",
                        backgroundColor: "#f5f5f5",
                        "& .MuiSelect-icon": {
                            color: "#3f51b5",
                        },
                    }}
                >
                    <MenuItem value="productType1">Phone</MenuItem>
                    <MenuItem value="productType2">Laptop</MenuItem>
                    <MenuItem value="productType3">Tablet</MenuItem>
                    {/* Thêm các giá trị sản phẩm khác ở đây */}
                </TextField>


                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box sx={{ marginTop: "16px" }}>
                        <DesktopDatePicker
                            label="Expiry Date"
                            inputFormat="MM/dd/yyyy"
                            value={formData.expiryDate}
                            onChange={(newValue) => setFormData({ ...formData, expiryDate: newValue })}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    margin="dense"
                                    variant="standard"
                                    fullWidth
                                />
                            )}
                        />
                    </Box>
                </LocalizationProvider>

                <TextField
                    margin="dense"
                    label="Open Quantity"
                    type="number"
                    name="openQuantity"
                    fullWidth
                    variant="standard"
                    onChange={handleChange}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
