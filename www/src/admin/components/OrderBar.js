import * as React from "react";
import {
	Box,
	FormControl,
	InputAdornment,
	OutlinedInput,
	Select,
	MenuItem,
	InputLabel,
	TextField,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

export default function OrderBar({
	search,
	onSearchChange,
	status,
	onStatusChange,
	dateRange,
	onDateRangeChange,
	customStartDate,
	customEndDate,
	onCustomDateChange,
	searchPlaceholder = "Search...",
	statusLabel = "Status",
	statusOptions = [],
}) {
	return (
		<Box display="flex" alignItems="center" gap={2} mb={2}>
			{/* Search Input */}
			<FormControl sx={{ width: { xs: "100%", md: "25ch" } }} variant="outlined">
				<OutlinedInput
					size="small"
					id="search"
					placeholder={searchPlaceholder}
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					startAdornment={
						<InputAdornment position="start" sx={{ color: "text.primary" }}>
							<SearchRoundedIcon fontSize="small" />
						</InputAdornment>
					}
					inputProps={{
						"aria-label": "search",
					}}
				/>
			</FormControl>

			{/* Status Filter */}
			{statusOptions.length > 0 && (
				<FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
					<InputLabel id="status-label">{statusLabel}</InputLabel>
					<Select
						labelId="status-label"
						id="status"
						value={status}
						onChange={(e) => onStatusChange(e.target.value)}
						label={statusLabel}
					>
						{statusOptions.map((option) => (
							<MenuItem key={option.value} value={option.value}>
								{option.label}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			)}

			{/* Date Range Filter */}
			<FormControl variant="outlined" size="small" sx={{ minWidth: 160 }}>
				<InputLabel id="date-range-label">Date Range</InputLabel>
				<Select
					labelId="date-range-label"
					id="date-range"
					value={dateRange}
					onChange={(e) => onDateRangeChange(e.target.value)}
					label="Date Range"
				>
					<MenuItem value="all">All</MenuItem>
					<MenuItem value="today">Today</MenuItem>
					<MenuItem value="yesterday">Yesterday</MenuItem>
					<MenuItem value="thisWeek">This Week</MenuItem>
					<MenuItem value="thisMonth">This Month</MenuItem>
					<MenuItem value="custom">Custom Range</MenuItem>
				</Select>
			</FormControl>

			{/* Custom Date Range Inputs */}
			{dateRange === "custom" && (
				<>
					<TextField
						label="Start Date"
						type="date"
						size="small"
						InputLabelProps={{ shrink: true }}
						value={customStartDate}
						onChange={(e) => onCustomDateChange(e.target.value, "start")}
					/>
					<TextField
						label="End Date"
						type="date"
						size="small"
						InputLabelProps={{ shrink: true }}
						value={customEndDate}
						onChange={(e) => onCustomDateChange(e.target.value, "end")}
					/>
				</>
			)}
		</Box>
	);
}
