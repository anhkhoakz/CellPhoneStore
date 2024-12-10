import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import React, { useState } from "react";

const SearchBar = ({ onSearch, onStatusChange }) => {
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("All");

    const handleSearch = (e) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        onStatusChange(e.target.value);
    };

    return (
        <Box
            className="mb-4"
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ gap: 2 }}
        >
            <TextField
                variant="outlined"
                placeholder="Search orders..."
                value={query}
                onChange={handleSearch}
                fullWidth
                sx={{ maxWidth: "400px" }}
            />
            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                <InputLabel id="status-select-label">Status</InputLabel>
                <Select
                    labelId="status-select-label"
                    value={status}
                    onChange={handleStatusChange}
                    label="Status"
                >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="confirmed">Confirm</MenuItem>
                    <MenuItem value="shipping">Shipping</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>

                </Select>
            </FormControl>
        </Box>
    );
};

export default SearchBar;
