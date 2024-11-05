import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Grid, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ProductCard from '../components/ProductCard';
import NoResult from '../components/NoResult'; // Import NoResult

const SearchPage = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [filter, setFilter] = useState('all'); // Để lọc theo category hoặc giá
  const [sort, setSort] = useState('default'); // Để sắp xếp theo giá hoặc tên

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

    // Tìm kiếm theo tên và giá
    let filteredResults = products.filter(item => 
      item.name.toLowerCase().includes(query?.toLowerCase()) || 
      item.price.toString().includes(query) // Tìm kiếm theo giá
    );

    // Áp dụng lọc theo category (Product hoặc Price)
    if (filter === 'product') {
      filteredResults = filteredResults.filter(item =>
        item.name.toLowerCase().includes(query?.toLowerCase())
      );
    } else if (filter === 'price') {
      // Lọc các sản phẩm có giá chênh lệch không quá 10$
      if (filteredResults.length > 0) {
        const basePrice = filteredResults[0].price; // Giá của sản phẩm đầu tiên
        console.log(basePrice)
        filteredResults = filteredResults.filter(item =>
          Math.abs(item.price - basePrice) <= 10
        );
      }
    }

    // Sắp xếp kết quả
    if (sort === 'price_asc') {
      filteredResults.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      filteredResults.sort((a, b) => b.price - a.price);
    } else if (sort === 'name_asc') {
      filteredResults.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'name_desc') {
      filteredResults.sort((a, b) => b.name.localeCompare(a.name));
    }

    setResults(filteredResults);
  }, [location.search, filter, sort]);

  return (
    <Box sx={{ minHeight: '90vh', padding: 3, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
        Kết quả tìm kiếm cho: "{searchQuery}"
      </Typography>

      {/* Phần lọc và sắp xếp, căn giữa */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel>Filter by</InputLabel>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Filter by"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="product">Product</MenuItem>
            <MenuItem value="price">Price</MenuItem>
          </Select>
        </FormControl>

        {/* Phần sắp xếp */}
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            label="Sort by"
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="price_asc">Price: Low to High</MenuItem>
            <MenuItem value="price_desc">Price: High to Low</MenuItem>
            <MenuItem value="name_asc">Name: A to Z</MenuItem>
            <MenuItem value="name_desc">Name: Z to A</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Hiển thị kết quả tìm kiếm */}
      {results.length > 0 ? (
        <Grid container spacing={2} sx={{ flex: '1 1 auto', maxWidth: '80%' }}>
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
