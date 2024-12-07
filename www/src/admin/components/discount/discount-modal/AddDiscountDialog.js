import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enGB } from 'date-fns/locale';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function AddDiscountDialog({ open, onClose, onSave }) {
    const [formData, setFormData] = React.useState({
        code: "",
        description: "",
        discount: "",
        type: "", // Thêm kiểu giảm giá (percentage or fixed)

        condition: {
            minOrderValue: "",
            applicableCategories: [], // Các loại sản phẩm đã chọn
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

    const handleCategoryChange = (event) => {
        const { value, checked } = event.target;
        const newCategories = checked
            ? [...formData.condition.applicableCategories, value]
            : formData.condition.applicableCategories.filter((category) => category !== value);

        setFormData({
            ...formData,
            condition: {
                ...formData.condition,
                applicableCategories: newCategories,
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

                <Box sx={{ marginTop: "16px" }}>
                    <label>Discounted Product Type</label>
                    <Box sx={{ display: 'flex', marginLeft: '1em', flexDirection: 'column' }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.condition.applicableCategories.includes("phone")}
                                    onChange={handleCategoryChange}
                                    value="phone"
                                />
                            }
                            label="Phone"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.condition.applicableCategories.includes("laptop")}
                                    onChange={handleCategoryChange}
                                    value="laptop"
                                />
                            }
                            label="Laptop"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.condition.applicableCategories.includes("ipad")}
                                    onChange={handleCategoryChange}
                                    value="ipad"
                                />
                            }
                            label="Tablet"
                        />
                    </Box>
                </Box>

                <LocalizationProvider dateAdapter={AdapterDateFns} locale={enGB}>
                    <Box sx={{margin: "1em 0 0.5em 0"}}>
                        <label>Discounted Product Type</label>
                        <Box>
                            <DesktopDatePicker
                                inputFormat="dd/MM/yyyy"
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
