import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function AddDiscountDialog({ open, onClose, onSave }) {
    const [formData, setFormData] = React.useState({
        discountCode: "",
        description: "",
        discountValue: "",
        condition: "",
        expiryDate: "",
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
            condition: "",
            expiryDate: "",
            openQuantity: "",
            usedQuantity: "",
        });
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Discount</DialogTitle>
            <DialogContent>
                {[
                    "discountCode",
                    "description",
                    "discountValue",
                    "condition",
                    "expiryDate",
                    "openQuantity",
                    "usedQuantity",
                ].map((field) => (
                    <TextField
                        key={field}
                        margin="dense"
                        label={field
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        type="text"
                        name={field}
                        fullWidth
                        variant="standard"
                        onChange={handleChange}
                    />
                ))}
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
