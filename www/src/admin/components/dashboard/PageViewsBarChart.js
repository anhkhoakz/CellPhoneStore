import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { BarChart } from "@mui/x-charts/BarChart";
import * as React from "react";

export default function TopSellingProductsChart() {
    const theme = useTheme();
    const colorPalette = [
        (theme.vars || theme).palette.primary.dark,
        (theme.vars || theme).palette.primary.main,
        (theme.vars || theme).palette.primary.light,
    ];

    return (
        <Card variant="outlined" sx={{ width: "100%" }}>
            <CardContent>
                <Typography component="h2" variant="subtitle2" gutterBottom>
                    Top 5 best selling products
                </Typography>
                <Stack sx={{ justifyContent: "space-between" }}>
                    <Stack
                        direction="row"
                        sx={{
                            alignContent: { xs: "center", sm: "flex-start" },
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <Typography variant="h4" component="p">
                            Total: 10,250
                        </Typography>
                        <Chip size="small" color="success" label="+15%" />
                    </Stack>
                    <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                    >
                        Number of sales in the past 6 months
                    </Typography>
                </Stack>
                <BarChart
                    borderRadius={8}
                    colors={colorPalette}
                    xAxis={[
                        {
                            scaleType: "band",
                            categoryGapRatio: 0.5,
                            data: [
                                "iPhone 14",
                                "Samsung Galaxy S23",
                                "Xiaomi Mi 13",
                                "Oppo Reno8",
                                "Vivo Y55",
                            ],
                        },
                    ]}
                    series={[
                        {
                            id: "sold-units",
                            label: "Số lượng bán ra",
                            data: [2230, 3400, 2900, 3100, 2750],
                            stack: "A",
                        },
                    ]}
                    height={250}
                    margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
                    grid={{ horizontal: true }}
                    slotProps={{
                        legend: {
                            hidden: true,
                        },
                    }}
                />
            </CardContent>
        </Card>
    );
}
