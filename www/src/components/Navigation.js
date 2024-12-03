import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCookies } from "react-cookie";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    InputBase,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
} from "@mui/material";
import {
    Search as SearchIcon,
    Menu as MenuIcon,
    Person as PersonIcon,
    ExitToApp as ExitToAppIcon,
} from "@mui/icons-material"; // Thêm các icon cần thiết

const Navigation = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [cookies] = useCookies([]);

    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    useEffect(() => {
        if (cookies.userId) {
            setIsLoggedIn(true);
        }
    }, [cookies]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery) {
            navigate(`/search?query=${searchQuery}`);
            setIsDrawerOpen(false);
        }
    };

    const toggleDrawer = (open) => (event) => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }
        setIsDrawerOpen(open);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/logout`, {
            method: "DELETE",
            credentials: "include",
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data.message);
        })


        setIsLoggedIn(false); // Đánh dấu người dùng đã đăng xuất
        setAnchorEl(null);
        // Điều hướng đến trang đăng nhập hoặc trang chủ
        navigate("/login");
    };

    return (
        <AppBar position="static" className="custom-navbar">
            <Toolbar>
                <IconButton
                    component={Link}
                    to="/"
                    edge="start"
                    color="inherit"
                    aria-label="logo"
                >
                    <img
                        src="/image/logo1.png"
                        alt="Logo"
                        width="300"
                        height="50"
                    />
                </IconButton>

                <Box
                    component="form"
                    onSubmit={handleSearch}
                    sx={{
                        display: { xs: "none", md: "flex" },
                        alignItems: "center",
                        mx: "auto",
                        width: "40%",
                    }}
                >
                    <InputBase
                        sx={{
                            flex: 1,
                            bgcolor: "background.paper",
                            borderRadius: 1,
                            padding: "0 8px",
                        }}
                        placeholder="What are you looking for?"
                        inputProps={{ "aria-label": "search" }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <IconButton
                        type="submit"
                        sx={{ p: "10px" }}
                        aria-label="search"
                    >
                        <SearchIcon />
                    </IconButton>
                </Box>

                <Box
                    sx={{
                        display: { xs: "none", md: "flex" },
                        alignItems: "center",
                    }}
                >
                    <IconButton
                        component={Link}
                        to="/orderManagement"
                        color="inherit"
                    >
                        <i className="bi bi-box-seam"></i>
                        <Typography variant="body2" sx={{ ml: 1 }}>
                            Orders
                        </Typography>
                    </IconButton>
                    <IconButton component={Link} to="/cart" color="inherit">
                        <i className="bi bi-cart"></i>
                        <Typography variant="body2" sx={{ ml: 1 }}>
                            Cart
                        </Typography>
                    </IconButton>

                    {/* Nếu đã đăng nhập thì hiển thị menu Profile */}
                    {isLoggedIn ? (
                        <div>
                            <IconButton
                                color="inherit"
                                onClick={handleMenuOpen}
                                sx={{ display: "flex", alignItems: "center" }}
                            >
                                <PersonIcon />
                                <Typography variant="body2" sx={{ ml: 1 }}>
                                    Profile
                                </Typography>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem
                                    component={Link}
                                    to="/profile"
                                    onClick={handleMenuClose}
                                >
                                    <PersonIcon sx={{ mr: 2 }} />{" "}
                                    {/* Thêm biểu tượng Profile */}
                                    Profile Manage
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    <ExitToAppIcon sx={{ mr: 2 }} />{" "}
                                    {/* Thêm biểu tượng Logout */}
                                    Logout
                                </MenuItem>
                            </Menu>
                        </div>
                    ) : (
                        <IconButton
                            component={Link}
                            to="/login"
                            color="inherit"
                        >
                            <i className="bi bi-person-circle"></i>
                            <Typography variant="body2" sx={{ ml: 1 }}>
                                Login
                            </Typography>
                        </IconButton>
                    )}
                </Box>

                <IconButton
                    color="inherit"
                    edge="end"
                    onClick={toggleDrawer(true)}
                    sx={{
                        display: { xs: "flex", md: "none" },
                        marginLeft: "auto",
                    }}
                >
                    <MenuIcon />
                </IconButton>

                <Drawer
                    anchor="right"
                    open={isDrawerOpen}
                    onClose={toggleDrawer(false)}
                >
                    <Box
                        sx={{ width: 250, padding: 2 }}
                        role="presentation"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                    >
                        <Box
                            component="form"
                            onSubmit={handleSearch}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 2,
                            }}
                        >
                            <InputBase
                                sx={{
                                    flex: 1,
                                    bgcolor: "background.paper",
                                    borderRadius: 1,
                                    padding: "0 8px",
                                }}
                                placeholder="Search..."
                                inputProps={{ "aria-label": "search" }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <IconButton
                                type="submit"
                                sx={{ p: "10px" }}
                                aria-label="search"
                            >
                                <SearchIcon />
                            </IconButton>
                        </Box>

                        <List>
                            <ListItem
                                button
                                component={Link}
                                to="/orderManagement"
                                onClick={toggleDrawer(false)}
                            >
                                <ListItemText primary="Orders" />
                            </ListItem>
                            <ListItem
                                button
                                component={Link}
                                to="/cart"
                                onClick={toggleDrawer(false)}
                            >
                                <ListItemText primary="Cart" />
                            </ListItem>
                            {isLoggedIn ? (
                                <ListItem button onClick={handleLogout}>
                                    <ExitToAppIcon sx={{ mr: 2 }} />{" "}
                                    {/* Biểu tượng Logout */}
                                    <ListItemText primary="Logout" />
                                </ListItem>
                            ) : (
                                <ListItem
                                    button
                                    component={Link}
                                    to="/login"
                                    onClick={toggleDrawer(false)}
                                >
                                    <PersonIcon sx={{ mr: 2 }} />{" "}
                                    {/* Biểu tượng Login */}
                                    <ListItemText primary="Login" />
                                </ListItem>
                            )}
                        </List>
                    </Box>
                </Drawer>
            </Toolbar>
        </AppBar>
    );
};

export default Navigation;
