import { Payment as PaymentIcon } from "@mui/icons-material";
import {
    Box,
    Button,
    Container,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
} from "@mui/material";
import React from "react";

const PaymentGuide = () => {
    return (
        <Container maxWidth="md" sx={{ marginTop: "5em", marginBottom: "3em" }}>
            <Typography variant="h3" align="center" gutterBottom>
                Payment Guide
            </Typography>

            <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Payment Methods
                </Typography>

                <List>
                    <ListItem>
                        <ListItemText
                            primary="Credit Card Payment"
                            secondary="We accept payments via popular credit cards such as Visa, MasterCard, and American Express."
                        />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText
                            primary="E-Wallet Payment"
                            secondary="You can pay via e-wallets such as PayPal, Momo, ZaloPay."
                        />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText
                            primary="Bank Transfer"
                            secondary="Transfer directly to our bank account to complete the transaction."
                        />
                    </ListItem>
                </List>

                <Box sx={{ marginTop: 1 }}>
                    <Typography variant="h6" gutterBottom>
                        Payment Steps
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText
                                primary="Step 1: Select Payment Method"
                                secondary="Choose the payment method that suits you."
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Step 2: Enter Payment Information"
                                secondary="Provide payment details such as card number, expiration date, or e-wallet information."
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Step 3: Confirm and Pay"
                                secondary="Review your payment information and confirm the transaction."
                            />
                        </ListItem>
                    </List>
                </Box>

                <Box sx={{ marginTop: 4 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PaymentIcon />}
                        fullWidth
                        sx={{ padding: 2 }}
                    >
                        Proceed to Payment
                    </Button>
                </Box>
            </Paper>

            <Box sx={{ marginTop: 5 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={2} sx={{ padding: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Additional Information
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                If you encounter any issues during the payment
                                process, please contact us via the phone number
                                or email below.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={2} sx={{ padding: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Contact Support
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Email: support@example.com
                                <br />
                                Phone: 1800-1234
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default PaymentGuide;
