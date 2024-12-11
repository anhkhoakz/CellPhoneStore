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
    const [sort, setSort] = useState(null);
    const [priceRange, setPriceRange] = useState("");
    const [category, setCategory] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            const params = new URLSearchParams(location.search);
            const query = params.get("query");

            const queryObj = {
                q: query || "",
                category: category || null,
            };

            if (priceRange === "below_3") queryObj.maxPrice = 3000;
            if (priceRange === "3_5") {
                queryObj.minPrice = 3000;
                queryObj.maxPrice = 5000;
            }
            if (priceRange === "5_10") {
                queryObj.minPrice = 5000;
                queryObj.maxPrice = 10000;
            }
            if (priceRange === "10_20") {
                queryObj.minPrice = 10000;
                queryObj.maxPrice = 20000;
            }
            if (priceRange === "above_20") queryObj.minPrice = 20000;

            if (sort) {
                queryObj.sort = sort;
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/products/search`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(queryObj),
                });

                const data = await response.json();
                if (response.ok) {
                    setResults(data.data || []);
                } else {
                    console.error("Error fetching products:", data.message);
                    setResults([]);
                }
            } catch (error) {
                console.error("Error performing search:", error);
                setResults([]);
            }
        };

        fetchProducts();
    }, [location.search, sort, priceRange, category]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get("query");
        setSearchQuery(query || "");
    }, [location.search]);

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
                    Search results for: "{searchQuery}"
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
                        <MenuItem value="">Default</MenuItem>
                        <MenuItem value="price_asc">Price: Low to High</MenuItem>
                        <MenuItem value="price_desc">Price: High to Low</MenuItem>
                        <MenuItem value="name_asc">Name: A to Z</MenuItem>
                        <MenuItem value="name_desc">Name: Z to A</MenuItem>
                    </Select>
                </FormControl>
            </Box>

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