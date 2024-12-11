import {
    Box,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NoResult from "../components/NoResult";
import ProductCard from "../components/product/ProductCard";

const SearchPage = () => {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState([]);
    const [sort, setSort] = useState("default");
    const [priceRange, setPriceRange] = useState("");
    const [category, setCategory] = useState("");

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get("query");

        const queryParams = new URLSearchParams();
        if (query) queryParams.append("q", query);
        if (category) queryParams.append("category", category);
        if (priceRange === "below_3") queryParams.append("maxPrice", 3000);
        if (priceRange === "3_5") {
            queryParams.append("minPrice", 3000);
            queryParams.append("maxPrice", 5000);
        }
        if (priceRange === "5_10") {
            queryParams.append("minPrice", 5000);
            queryParams.append("maxPrice", 10000);
        }
        if (priceRange === "10_20") {
            queryParams.append("minPrice", 10000);
            queryParams.append("maxPrice", 20000);
        }
        if (priceRange === "above_20") queryParams.append("minPrice", 20000);
        if (sort) queryParams.append("sort", sort);

        const url = `${process.env.REACT_APP_BACKEND_URL}/api/v1/products/search?${queryParams.toString()}`;

        fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.success) setProducts(data.message);
            })
            .catch((error) => console.error("Error:", error));
    }, [location.search, sort, priceRange, category]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get("query");
        setSearchQuery(query);

        let filteredResults = products;

        if (query) {
            filteredResults = products.filter((item) =>
                item.name.toLowerCase().includes(query.toLowerCase()),
            );
        }

        // Lọc theo category
        if (category) {
            filteredResults = filteredResults.filter(
                (item) => item.category === category,
            );
        }

        // Lọc theo giá
        if (priceRange) {
            if (priceRange === "below_3") {
                filteredResults = filteredResults.filter(
                    (item) => item.price < 3000,
                );
            } else if (priceRange === "3_5") {
                filteredResults = filteredResults.filter(
                    (item) => item.price >= 3000 && item.price <= 5000,
                );
            } else if (priceRange === "5_10") {
                filteredResults = filteredResults.filter(
                    (item) => item.price >= 5000 && item.price <= 10000,
                );
            } else if (priceRange === "10_20") {
                filteredResults = filteredResults.filter(
                    (item) => item.price >= 10000 && item.price <= 20000,
                );
            } else if (priceRange === "above_20") {
                filteredResults = filteredResults.filter(
                    (item) => item.price > 20000,
                );
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
    }, [location.search, sort, priceRange, category, products]);

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
            {searchQuery && (
                <Typography
                    variant="h5"
                    sx={{ mb: 3, color: "primary.main", fontWeight: "bold" }}
                >
                    Kết quả tìm kiếm cho: "{searchQuery}"
                </Typography>
            )}

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
                        <MenuItem value="price_asc">
                            Price: Low to High
                        </MenuItem>
                        <MenuItem value="price_desc">
                            Price: High to Low
                        </MenuItem>
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
                        <Grid item key={product.productId}>
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
