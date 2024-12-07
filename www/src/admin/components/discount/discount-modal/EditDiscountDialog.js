import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import * as React from "react";

export default function EditDiscountDialog({
    open,
    onClose,
    onSave,
    discountData,
}) {
    const [formData, setFormData] = React.useState(discountData || {});

    React.useEffect(() => {
        if (discountData) {
            setFormData(discountData);
        }
    }, [discountData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Discount</DialogTitle>
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
                        value={formData[field] || ""}
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
