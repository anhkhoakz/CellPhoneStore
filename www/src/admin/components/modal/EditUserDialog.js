// EditUserDialog.js
import * as React from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
} from "@mui/material";

export default function EditUserDialog({ open, onClose, onSave, userData }) {
    const [name, setName] = React.useState(userData?.name || "");
    const [location, setLocation] = React.useState(userData?.location || "");
    const [note, setNote] = React.useState(userData?.note || "");

    React.useEffect(() => {
        if (userData) {
            setName(userData.name || "");
            setLocation(userData.location || "");
            setNote(userData.note || "");
        }
    }, [userData]);

    const handleSave = () => {
        const updatedUser = { ...userData, name, location, note };
        onSave(updatedUser);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Chỉnh Sửa Thông Tin Người Dùng</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Tên"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Địa điểm"
                    type="text"
                    fullWidth
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Ghi chú (Lý do khóa tài khoản)"
                    type="text"
                    fullWidth
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Hủy
                </Button>
                <Button
                    onClick={handleSave}
                    color="primary"
                    variant="contained"
                >
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );
}
