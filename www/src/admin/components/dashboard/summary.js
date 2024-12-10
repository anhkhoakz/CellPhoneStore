import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

export function Summary({ amount, icon: Icon, title }) {
    return (
        <Card>
            <CardContent>
                <Stack
                    direction="row"
                    spacing={3}
                    sx={{ alignItems: "center" }}
                >
                    <Avatar
                        sx={{
                            "--Avatar-size": "48px",
                            bgcolor: "var(--mui-palette-background-paper)",
                            boxShadow: "var(--mui-shadows-8)",
                            color: "var(--mui-palette-text-primary)",
                        }}
                    >
                        <Icon fontSize="var(--icon-fontSize-lg)" />
                    </Avatar>
                    <div>
                        <Typography color="text.secondary" variant="body1">
                            {title}
                        </Typography>
                        <Typography variant="h3">
                            {new Intl.NumberFormat("vi-VN").format(amount)}
                        </Typography>
                    </div>
                </Stack>
            </CardContent>
        </Card>
    );
}
