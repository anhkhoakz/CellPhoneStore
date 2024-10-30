import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Grid, Typography } from '@mui/material';
import ProductCard from '../components/ProductCard';
import NoResult from '../components/NoResult'; // Import NoResult

const SearchPage = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);

  // Dữ liệu sản phẩm
  const products = [
    {
      id: 1,
      name: "Product 1",
      price: 29.99,
      image: "/image/ip16.jpg",
    },
    {
      id: 2,
      name: "Product 2",
      price: 39.99,
      image: "/image/ip16.jpg",
    },
    {
      id: 3,
      name: "Product 3",
      price: 19.99,
      image: "/image/ip16.jpg",
    },
    {
      id: 4,
      name: "Product 4",
      price: 19.99,
      image: "/image/ip16.jpg",
    },
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query');
    setSearchQuery(query);

    const filteredResults = products.filter(item =>
      item.name.toLowerCase().includes(query?.toLowerCase())
    );

    setResults(filteredResults);
  }, [location.search]);

  return (
    <Box sx={{ minHeight: '90vh', padding: 3, display: 'flex', flexDirection: 'column', }}>
      <Typography variant="h5" sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
        Kết quả tìm kiếm cho: "{searchQuery}"
      </Typography>
      
      {results.length > 0 ? (
        <Grid container spacing={2}  sx={{ flex: '1 1 auto', maxWidth: '80%' }}>
          {results.map((product) => (
            <Grid item key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <NoResult />  
      )}
    </Box>
  );
};

export default SearchPage;
