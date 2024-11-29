import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { LineChart } from "@mui/x-charts/LineChart";

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

AreaGradient.propTypes = {
	color: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
};

function getDaysInMonth(month, year) {
	const date = new Date(year, month, 0);
	const monthName = date.toLocaleDateString("en-US", {
		month: "short",
	});
	const daysInMonth = date.getDate();
	const days = [];
	let i = 1;
	while (days.length < daysInMonth) {
		days.push(`${monthName} ${i}`);
		i += 1;
	}
	return days;
}

export default function RevenueChart() {
	const theme = useTheme();
	const data = getDaysInMonth(4, 2024);

	const colorPalette = [theme.palette.primary.light, theme.palette.primary.main, theme.palette.primary.dark];

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
							1,237,000,000 VND
						</Typography>
						<Chip size="small" color="success" label="+15%" />
					</Stack>
					<Typography variant="caption" sx={{ color: "text.secondary" }}>
						Daily revenue for the last 30 days
					</Typography>
				</Stack>
				<LineChart
					colors={colorPalette}
					xAxis={[
						{
							scaleType: "point",
							data,
							tickInterval: (index, i) => (i + 1) % 5 === 0,
						},
					]}
					series={[
						{
							id: "online",
							label: "Online",
							showMark: false,
							curve: "linear",
							stack: "total",
							area: true,
							stackOrder: "ascending",
							data: [
								1000000, 1500000, 2000000, 2500000, 3000000, 3500000, 4000000, 3700000, 4200000,
								4500000, 5000000, 5500000, 6000000, 6500000, 7000000, 7500000, 8000000, 8500000,
								9000000, 9500000, 10000000, 10500000, 11000000, 11500000, 12000000, 12500000, 13000000,
								13500000, 14000000, 14500000,
							],
						},
						{
							id: "cod",
							label: "Ship COD",
							showMark: false,
							curve: "linear",
							stack: "total",
							area: true,
							stackOrder: "ascending",
							data: [
								2000000, 2500000, 2200000, 2800000, 3000000, 3300000, 2900000, 3100000, 3300000,
								3500000, 3700000, 3900000, 4100000, 4300000, 4500000, 4700000, 4900000, 5100000,
								5300000, 5500000, 5700000, 5900000, 6100000, 6300000, 6500000, 6700000, 6900000,
								7100000, 7300000, 7500000,
							],
						},
					]}
					height={250}
					margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
					grid={{ horizontal: true }}
					sx={{
						"& .MuiAreaElement-series-online": {
							fill: "url('#online')",
						},
						"& .MuiAreaElement-series-instore": {
							fill: "url('#instore')",
						},
					}}
					slotProps={{
						legend: {
							hidden: true,
						},
					}}
				>
					<AreaGradient color={theme.palette.primary.dark} id="online" />
					<AreaGradient color={theme.palette.primary.main} id="instore" />
				</LineChart>
			</CardContent>
		</Card>
	);
}
