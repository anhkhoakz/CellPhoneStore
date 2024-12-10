import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import React from "react";

const CouponItem = ({ coupon, onReceive }) => {
    if (!coupon) return null;

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const options = { day: "2-digit", month: "2-digit", year: "numeric" };
        return date.toLocaleDateString("vi-VN", options); 
    };

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
                        <Typography
                            variant="h6"
                            sx={{ color: "#1976d2", fontWeight: 600 }}
                        >
                            {coupon.description}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ mb: 1 }}
                        >
                            {coupon.condition && (
                                <div>
                                    <strong style={{color: "black"}}>Condition:</strong>
                                    {Object.entries(coupon.condition).map(
                                        ([key, val], index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    marginLeft: "1em",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {key}: {val}
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ fontStyle: "italic", color: "#616161" }}
                        >
                            Expiry Date: {formatDate(coupon.expiryDate)}
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
                            onClick={() => onReceive(coupon.code)} // Trigger onReceive in the parent
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
