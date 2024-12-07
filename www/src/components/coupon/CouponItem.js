import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";

const CouponItem = ({ coupon, onReceive }) => {
    if (!coupon) return null;

    return (
        <Card
            variant="outlined"
            sx={{
                mb: 2,
                border: "1px solid #1976d2",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                },
            }}
        >
            <CardContent>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ gap: 2 }}
                >
                    <Box>
                        <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: 600 }}>
                            {coupon.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                            {coupon.description}
                        </Typography>
                        <Typography variant="body2" sx={{ fontStyle: "italic", color: "#616161" }}>
                            Expiry Date: {coupon.expiryDate}
                        </Typography>
                    </Box>
                    {onReceive && (
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            sx={{
                                textTransform: "none",
                                fontWeight: "bold",
                                backgroundColor: "#1976d2",
                                "&:hover": {
                                    backgroundColor: "#115293",
                                },
                            }}
                            onClick={() => onReceive(coupon.id)}
                        >
                            Receive
                        </Button>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default CouponItem;
