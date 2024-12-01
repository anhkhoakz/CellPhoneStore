import React from "react";
import { Box, Typography, Button } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { Link } from "react-router-dom";

const NoResult = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                mt: 5,
            }}
        >
            <SearchOffIcon
                sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                Không có sản phẩm nào phù hợp với tìm kiếm của bạn.
            </Typography>
            <Button variant="contained" color="primary" component={Link} to="/">
                Về trang chủ
            </Button>
        </Box>
    );
};

export default NoResult;
