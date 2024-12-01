import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from "@mui/material";

const CanceledReasonDialog = ({ open, onClose, onSave }) => {
    const [note, setNote] = useState("");

    const handleSave = () => {
        onSave(note);
        setNote(""); // Clear the note input
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Enter Note for Cancellation</DialogTitle>
            <DialogContent>
                <TextField
                    label="Cancellation Note"
                    multiline
                    rows={4}
                    fullWidth
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    variant="outlined"
                    margin="dense"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    color="primary"
                    variant="contained"
                    disabled={!note.trim()}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CanceledReasonDialog;
