import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useRef } from "react";
import OrderItem from "../components/order/OrderItem";

const Invoice = () => {
    const invoiceRef = useRef(); // Reference to the invoice content

    const order = {
        items: [
            {
                name: "Product 1",
                price: 100,
                amount: 2,
                image: "/path/to/image1.jpg",
            },
            {
                name: "Product 2",
                price: 50,
                amount: 1,
                image: "/path/to/image2.jpg",
            },
        ],
    };

    const customer = {
        name: "John Doe",
        phone: "+1 234 567 890",
        email: "john.doe@example.com",
        address: "123 Main St, City A",
    };

    const total = 250; // Total amount
    const purchaseTime = Date.now(); // Purchase time

    const { name, phone, email, address } = customer;
    const { items } = order;

    const handleDownloadPDF = async () => {
        const element = invoiceRef.current;
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("invoice.pdf");
    };

    return (
        <Box sx={{ padding: 3, marginTop: "4em" }}>
            {/* Invoice Content */}
            <Paper elevation={3} sx={{ padding: 3 }} ref={invoiceRef}>
                <Typography
                    variant="h4"
                    align="center"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                >
                    Invoice
                </Typography>

                {/* Customer Information */}
                <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="h6">Customer Information</Typography>
                    <Typography>Name: {name}</Typography>
                    <Typography>Phone: {phone}</Typography>
                    <Typography>Email: {email}</Typography>
                    <Typography>Address: {address}</Typography>
                </Box>

                <Divider />

                {/* Purchase Information */}
                <Box sx={{ marginBottom: 2, marginTop: 2 }}>
                    <Typography variant="h6">Purchase Information</Typography>
                    <Typography>
                        Date: {new Date(purchaseTime).toLocaleString()}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Products Purchased:
                    </Typography>

                    {/* List of Purchased Items */}
                    {items.map((product, index) => (
                        <OrderItem key={index} product={product} />
                    ))}
                </Box>

                <Divider />

                {/* Total Price Section */}
                <Box sx={{ marginTop: 2, marginBottom: 2 }}>
                    <Grid container justifyContent="space-between">
                        <Grid item>
                            <Typography variant="h6">Total Amount</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6">
                                ${total.toFixed(2)}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            {/* Action Buttons */}
            <Box sx={{ marginTop: 2, textAlign: "center" }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDownloadPDF}
                >
                    Download PDF
                </Button>
            </Box>
        </Box>
    );
};

export default Invoice;
