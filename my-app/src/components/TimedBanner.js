import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

// Sample banner data
const bannerData = [
  {
    id: 1,
    image: 'https://via.placeholder.com/800x400?text=Banner+1',
    altText: 'Banner 1',
    displayDuration: 5000, // 5 seconds
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/800x400?text=Banner+2',
    altText: 'Banner 2',
    displayDuration: 7000, // 7 seconds
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/800x400?text=Banner+3',
    altText: 'Banner 3',
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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px auto',
        maxWidth: '80%',
        height: '400px',
        overflow: 'hidden',
      }}
    >
      <img
        src={currentBanner.image}
        alt={currentBanner.altText}
        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
      />
    </Box>
  );
};

export default TimedBanner;
