import React from "react";
import { Box, Typography, Divider } from "@mui/material";

const ShowComment = ({ ShowComment }) => {
    const { username, comment, createAt } = ShowComment;

    return (
        <Box sx={{ marginBottom: 3 }}>
            <Typography
                variant="h6"
                color="textPrimary"
                sx={{ fontWeight: "bold" }}
            >
                {username}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                {new Date(createAt).toLocaleDateString()}
            </Typography>
            <Typography variant="body1" color="textPrimary">
                {comment}
            </Typography>
            <Divider sx={{ my: 2 }} />
        </Box>
    );
};

export default ShowComment;
