import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { enGB } from "date-fns/locale";
import * as React from "react";

export default function AddDiscountDialog({ open, onClose, onSave }) {
    const [formData, setFormData] = React.useState({
        code: "",
        description: "",
        discount: "",
        type: "", // Thêm kiểu giảm giá (percentage or fixed)

        condition: {
            minOrderValue: "",
            applicableCategories: [],
        },

        expiryDate: null,
        quantity: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name in formData.condition) {
            setFormData({
                ...formData,
                condition: {
                    ...formData.condition,
                    [name]: value,
                },
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleCategoriesChange = (event) => {
        const {
            target: { value },
        } = event;

        setFormData({
            ...formData,
            condition: {
                ...formData.condition,
                applicableCategories:
                    typeof value === "string" ? value.split(",") : value,
            },
        });
    };

    const handleSave = () => {
        onSave(formData);
        setFormData({
            code: "",
            description: "",
            discount: "",
            type: "",
            condition: {
                minOrderValue: "",
                applicableCategories: [],
            },
            expiryDate: null,
            quantity: "",
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
                    name="code"
                    fullWidth
                    variant="standard"
                    onChange={handleChange}
                    inputProps={{
                        style: { textTransform: "uppercase" },
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
                    name="type"
                    select
                    value={formData.type}
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
                    name="discount"
                    fullWidth
                    variant="standard"
                    onChange={handleChange}
                />

                <TextField
                    margin="dense"
                    label="Minimum Order Value"
                    type="number"
                    name="minOrderValue"
                    fullWidth
                    variant="standard"
                    value={formData.condition.minOrderValue}
                    onChange={handleChange}
                />

                <TextField
                    margin="dense"
                    label="Discounted Product Type"
                    name="applicableCategories"
                    select
                    multiple
                    value={formData.condition.applicableCategories || []}
                    onChange={handleCategoriesChange}
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
                    <MenuItem value="phone">Phone</MenuItem>
                    <MenuItem value="laptop">Laptop</MenuItem>
                    <MenuItem value="ipad">Tablet</MenuItem>
                    {/* Thêm các giá trị sản phẩm khác ở đây */}
                </TextField>

                <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    locale={enGB}
                >
                    <Box sx={{ marginTop: "16px" }}>
                        <DesktopDatePicker
                            label="Expiry Date"
                            inputFormat="dd/MM/yyyy"
                            value={formData.expiryDate}
                            onChange={(newValue) =>
                                setFormData({
                                    ...formData,
                                    expiryDate: newValue,
                                })
                            }
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
                    name="quantity"
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
