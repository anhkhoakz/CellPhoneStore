import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ExitToApp as ExitToAppIcon,
    Menu as MenuIcon,
    Person as PersonIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import {
    AppBar,
    Box,
    Drawer,
    IconButton,
    InputBase,
    List,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    Badge
} from "@mui/material";
import { useCookies } from "react-cookie";

const Navigation = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);

    // Số lượng sản phẩm trong giỏ hàng
    const [cartCount, setCartCount] = useState(5); // Mock số lượng sản phẩm là 5


    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    useEffect(() => {
        if (cookies.userId) {
            setIsLoggedIn(true);
        }
    }, [cookies.userId]); // Chỉ cập nhật khi userId thay đổi

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
            });

        // Xóa cookie khi logout và cập nhật trạng thái
        removeCookie("userId");
        setIsLoggedIn(false); // Cập nhật trạng thái đăng xuất
        setAnchorEl(null);
        navigate("/login"); // Điều hướng đến trang đăng nhập
    };

    return (
        <AppBar position="fixed" className="custom-navbar">
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
                    {isLoggedIn && (
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
                    )}

                    <IconButton component={Link} to="/cart" color="inherit">
                        <Badge badgeContent={cartCount} color="error">
                            <i className="bi bi-cart"></i>
                        </Badge>
                        <Typography variant="body2" sx={{ ml: 1 }}>
                            Cart
                        </Typography>
                    </IconButton>


                    {isLoggedIn && (
                        <IconButton
                            component={Link}
                            to="/coupon"
                            color="inherit"
                        >
                            <i className="bi bi-gift"></i>
                            <Typography variant="body2" sx={{ ml: 1 }}>
                                Coupon
                            </Typography>
                        </IconButton>
                    )}

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
                                    <PersonIcon sx={{ mr: 2 }} />
                                    Profile Manage
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    <ExitToAppIcon sx={{ mr: 2 }} />
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
                                    <ExitToAppIcon sx={{ mr: 2 }} />
                                    <ListItemText primary="Logout" />
                                </ListItem>
                            ) : (
                                <ListItem
                                    button
                                    component={Link}
                                    to="/login"
                                    onClick={toggleDrawer(false)}
                                >
                                    <PersonIcon sx={{ mr: 2 }} />
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
