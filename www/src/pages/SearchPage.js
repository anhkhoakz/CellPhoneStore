import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
    Box,
    Grid,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import ProductCard from "../components/product/ProductCard";
import NoResult from "../components/NoResult";

const SearchPage = () => {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState([]);
    const [sort, setSort] = useState("default"); // Sắp xếp theo giá hoặc tên
    const [priceRange, setPriceRange] = useState(""); // Lọc theo giá
    const [category, setCategory] = useState(""); // Lọc theo category

    // Dữ liệu sản phẩm
    const products = [
        { id: 1, name: "Phone 1", price: 2999, image: "/image/ip16.jpg", category: "phone" },
        { id: 2, name: "Laptop 1", price: 3999, image: "/image/ip16.jpg", category: "laptop" },
        { id: 3, name: "Tablet 1", price: 1999, image: "/image/ip16.jpg", category: "tablet" },
        { id: 4, name: "Phone 2", price: 5999, image: "/image/ip16.jpg", category: "phone" },
        { id: 5, name: "Laptop 2", price: 10999, image: "/image/ip16.jpg", category: "laptop" },
        { id: 6, name: "Tablet 2", price: 1599, image: "/image/ip16.jpg", category: "tablet" },
    ];

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get("query");
        setSearchQuery(query);

        // Tìm kiếm theo tên và giá
        let filteredResults = products.filter((item) =>
            item.name.toLowerCase().includes(query?.toLowerCase())
        );

        // Lọc theo category
        if (category) {
            filteredResults = filteredResults.filter(
                (item) => item.category === category
            );
        }

        // Lọc theo giá
        if (priceRange) {
            if (priceRange === "below_3") {
                filteredResults = filteredResults.filter((item) => item.price < 3000);
            } else if (priceRange === "3_5") {
                filteredResults = filteredResults.filter((item) => item.price >= 3000 && item.price <= 5000);
            } else if (priceRange === "5_10") {
                filteredResults = filteredResults.filter((item) => item.price >= 5000 && item.price <= 10000);
            } else if (priceRange === "10_20") {
                filteredResults = filteredResults.filter((item) => item.price >= 10000 && item.price <= 20000);
            } else if (priceRange === "above_20") {
                filteredResults = filteredResults.filter((item) => item.price > 20000);
            }
        }

        // Sắp xếp kết quả
        if (sort === "price_asc") {
            filteredResults.sort((a, b) => a.price - b.price);
        } else if (sort === "price_desc") {
            filteredResults.sort((a, b) => b.price - a.price);
        } else if (sort === "name_asc") {
            filteredResults.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === "name_desc") {
            filteredResults.sort((a, b) => b.name.localeCompare(a.name));
        }

        setResults(filteredResults);
    }, [location.search, sort, priceRange, category]);

    return (
        <Box
            sx={{
                minHeight: "90vh",
                padding: 3,
                display: "flex",
                flexDirection: "column",
                marginTop: "4em",
            }}
        >
            <Typography
                variant="h5"
                sx={{ mb: 3, color: "primary.main", fontWeight: "bold" }}
            >
                Kết quả tìm kiếm cho: "{searchQuery}"
            </Typography>

            {/* Phần lọc theo category */}
            <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
                <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        label="Category"
                    >
                        <MenuItem value="">All Categories</MenuItem>
                        <MenuItem value="phone">Phone</MenuItem>
                        <MenuItem value="laptop">Laptop</MenuItem>
                        <MenuItem value="tablet">Tablet</MenuItem>
                    </Select>
                </FormControl>

                {/* Phần lọc theo giá */}
                <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                    <InputLabel>Price Range</InputLabel>
                    <Select
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        label="Price Range"
                    >
                        <MenuItem value="">All Prices</MenuItem>
                        <MenuItem value="below_3">Below 3M</MenuItem>
                        <MenuItem value="3_5">3M - 5M</MenuItem>
                        <MenuItem value="5_10">5M - 10M</MenuItem>
                        <MenuItem value="10_20">10M - 20M</MenuItem>
                        <MenuItem value="above_20">Above 20M</MenuItem>
                    </Select>
                </FormControl>
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
                <Grid
                    container
                    spacing={2}
                    sx={{
                        flex: "1 1 auto",
                        maxWidth: "80%",
                        margin: "1em auto 1em auto",
                    }}
                >
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
