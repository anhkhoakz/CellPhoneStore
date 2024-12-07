import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";

// Sample banner data
const bannerData = [
    {
        id: 1,
        image: "/image/banner/banner1.jpg",
        altText: "Banner 1",
        displayDuration: 5000, // 5 seconds
    },
    {
        id: 2,
        image: "/image/banner/banner2.jpg",
        altText: "Banner 2",
        displayDuration: 7000, // 7 seconds
    },
    {
        id: 3,
        image: "/image/banner/banner3.jpg",
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
            setCurrentBannerIndex(
                (prevIndex) => (prevIndex + 1) % bannerData.length,
            );
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
                margin: "5em auto 2em auto",
                maxWidth: "70%",
                height: "auto",
                maxHeight: 400,
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
