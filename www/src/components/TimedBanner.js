import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

// Sample banner data
const bannerData = [
	{
		id: 1,
		image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/tecno-camon-30s-banner-home.jpg",
		altText: "Banner 1",
		displayDuration: 5000, // 5 seconds
	},
	{
		id: 2,
		image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/samsung-galaxy-s24-ultra-home-15-11.png",
		altText: "Banner 2",
		displayDuration: 7000, // 7 seconds
	},
	{
		id: 3,
		image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/tai-nghe-sony-wf-c510-home-18-11.png",
		altText: "Banner 3",
		displayDuration: 3000, // 3 seconds
	},
	// Add more banners as needed
];

const TimedBanner = () => {
	const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

	useEffect(() => {
		const currentBanner = bannerData[currentBannerIndex];
		const timer = setTimeout(() => {
			setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % bannerData.length);
		}, currentBanner.displayDuration);

		return () => clearTimeout(timer);
	}, [currentBannerIndex]);

	const currentBanner = bannerData[currentBannerIndex];

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				margin: "1.25em auto",
				maxWidth: "80%",
				height: "400px",
				overflow: "hidden",
			}}
		>
			<img
				src={currentBanner.image}
				alt={currentBanner.altText}
				style={{ width: "100%", height: "auto", objectFit: "cover" }}
			/>
		</Box>
	);
};

export default TimedBanner;
