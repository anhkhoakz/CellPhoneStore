// SearchBar.js
import * as React from "react";
import {
    Box,
    Button,
    FormControl,
    InputAdornment,
    OutlinedInput,
    Select,
    MenuItem,
    InputLabel,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

export default function SearchBar({
    search,
    onSearchChange,
    status,
    onStatusChange,
    onAddClick,
    addLabel = "Add",
    searchPlaceholder = "Search...",
    statusLabel = "Status",
    statusOptions = [],
}) {
    return (
        <Box display="flex" alignItems="center" gap={2} mb={2}>
            {/* Ô tìm kiếm */}
            <FormControl
                sx={{ width: { xs: "100%", md: "25ch" } }}
                variant="outlined"
            >
                <OutlinedInput
                    size="small"
                    id="search"
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    startAdornment={
                        <InputAdornment
                            position="start"
                            sx={{ color: "text.primary" }}
                        >
                            <SearchRoundedIcon fontSize="small" />
                        </InputAdornment>
                    }
                    inputProps={{
                        "aria-label": "search",
                    }}
                />
            </FormControl>

            {/* Bộ lọc trạng thái */}
            {statusOptions.length > 0 && (
                <FormControl
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: 120 }}
                >
                    <InputLabel id="status-label">{statusLabel}</InputLabel>
                    <Select
                        labelId="status-label"
                        id="status"
                        value={status}
                        onChange={(e) => onStatusChange(e.target.value)}
                        label={statusLabel}
                        sx={{ border: "none" }}
                    >
                        {statusOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            {/* Nút thêm */}
            <Button variant="contained" color="primary" onClick={onAddClick}>
                {addLabel}
            </Button>
        </Box>
    );
}
