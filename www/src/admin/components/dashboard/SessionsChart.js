import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { LineChart } from "@mui/x-charts/LineChart";
import * as React from "react";

function AreaGradient({ color, id }) {
    return (
        <defs>
            <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity={0.5} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
        </defs>
    );
}

const formatRevenueData = (trend) => {
    return trend
        .map((item) => {
            if (!item._id) {
                console.error("Missing _id in item:", item);
                return null; // Bỏ qua mục nếu không có _id
            }

            try {
                // Tách ngày, tháng, năm từ chuỗi _id (định dạng yyyy-MM-dd)
                const [year, month, day] = item._id.split("-").map(Number);
                const parsedDate = new Date(year, month - 1, day); // Chuyển đổi thành đối tượng Date

                if (isNaN(parsedDate)) {
                    console.error(`Invalid date: ${item._id}`);
                    return null; // Bỏ qua mục nếu ngày không hợp lệ
                }

                return {
                    date: parsedDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                    }), // Định dạng ngày thành "Dec 3"
                    revenue: item.dailyRevenue || 0, // Đảm bảo doanh thu không bị undefined
                };
            } catch (error) {
                console.error("Error processing date:", item._id, error);
                return null; // Xử lý lỗi không mong muốn
            }
        })
        .filter(Boolean); // Loại bỏ các mục null
};

export default function RevenueChart({ total, trend }) {
    console.log("Trend data:", trend);
    const formattedData = formatRevenueData(trend);
    const data = formattedData.map((item) => item.date);

    const theme = useTheme();
    const colorPalette = [
        theme.palette.primary.light,
        theme.palette.primary.main,
        theme.palette.primary.dark,
    ];

    return (
        <Card variant="outlined" sx={{ width: "100%" }}>
            <CardContent>
                <Typography component="h2" variant="subtitle2" gutterBottom>
                    Revenue
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
                            {new Intl.NumberFormat("vi-VI", {
                                style: "currency",
                                currency: "VND",
                            }).format(total)}
                        </Typography>
                    </Stack>
                    <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                    >
                        Daily revenue for the last 30 days
                    </Typography>
                </Stack>
                <LineChart
                    colors={colorPalette}
                    xAxis={[
                        {
                            scaleType: "point",
                            data: data, // Dữ liệu ngày đã được định dạng
                            tickInterval: (_index, i) => (i + 1) % 2 === 0, // Hiển thị ngày cách đều
                        },
                    ]}
                    series={[
                        {
                            id: "revenue",
                            label: "Revenue",
                            showMark: false,
                            curve: "linear",
                            stack: "total",
                            area: true,
                            stackOrder: "ascending",
                            data: formattedData.map((item) => item.revenue), // Doanh thu tương ứng
                        },
                    ]}
                    height={250}
                    margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
                    grid={{ horizontal: true }}
                    sx={{
                        "& .MuiAreaElement-series-revenue": {
                            fill: "url('#revenue')",
                        },
                    }}
                    slotProps={{
                        legend: {
                            hidden: true,
                        },
                    }}
                >
                    <AreaGradient
                        color={theme.palette.primary.dark}
                        id="revenue"
                    />
                </LineChart>
            </CardContent>
        </Card>
    );
}
