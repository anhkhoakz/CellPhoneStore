import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Typography, InputBase, Box, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Search as SearchIcon, Menu as MenuIcon } from "@mui/icons-material";

const Navigation = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery) {
            navigate(`/search?query=${searchQuery}`);
            setIsDrawerOpen(false); 
        }
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsDrawerOpen(open);
    };

    return (
        <AppBar position="static" className="custom-navbar">
            <Toolbar>
                <IconButton component={Link} to="/" edge="start" color="inherit" aria-label="logo">
                    <img
                        src="/image/logo.png"
                        alt="Logo"
                        width="300"
                        height="50"
                    />
                </IconButton>

                <Box 
                    component="form" 
                    onSubmit={handleSearch} 
                    sx={{ 
                        display: { xs: 'none', md: 'flex' }, 
                        alignItems: 'center', 
                        mx: 'auto',
                        width: '40%' 
                    }}
                >
                    <InputBase
                        sx={{ 
                            flex: 1, 
                            bgcolor: 'background.paper', 
                            borderRadius: 1, 
                            padding: '0 8px' 
                        }}
                        placeholder="What are you looking for?"
                        inputProps={{ 'aria-label': 'search' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Box>

                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                    <IconButton component={Link} to="/orderManagement" color="inherit">
                        <i className="bi bi-box-seam"></i>
                        <Typography variant="body2" sx={{ ml: 1 }}>Orders</Typography>
                    </IconButton>
                    <IconButton component={Link} to="/cart" color="inherit">
                        <i className="bi bi-cart"></i>
                        <Typography variant="body2" sx={{ ml: 1 }}>Cart</Typography>
                    </IconButton>
                    <IconButton component={Link} to="/login" color="inherit">
                        <i className="bi bi-person-circle"></i>
                        <Typography variant="body2" sx={{ ml: 1 }}>Login</Typography>
                    </IconButton>
                </Box>

                <IconButton
                    color="inherit"
                    edge="end"
                    onClick={toggleDrawer(true)}
                    sx={{ display: { xs: 'flex', md: 'none' }, marginLeft: 'auto' }}
                >
                    <MenuIcon />
                </IconButton>

                <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
                    <Box
                        sx={{ width: 250, padding: 2 }}
                        role="presentation"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                    >
                        <Box 
                            component="form" 
                            onSubmit={handleSearch} 
                            sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                        >
                            <InputBase
                                sx={{ 
                                    flex: 1, 
                                    bgcolor: 'background.paper', 
                                    borderRadius: 1, 
                                    padding: '0 8px' 
                                }}
                                placeholder="Search..."
                                inputProps={{ 'aria-label': 'search' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                                <SearchIcon />
                            </IconButton>
                        </Box>

                        <List>
                            <ListItem button component={Link} to="/orderManagement" onClick={toggleDrawer(false)}>
                                <ListItemText primary="Orders" />
                            </ListItem>
                            <ListItem button component={Link} to="/cart" onClick={toggleDrawer(false)}>
                                <ListItemText primary="Cart" />
                            </ListItem>
                            <ListItem button component={Link} to="/login" onClick={toggleDrawer(false)}>
                                <ListItemText primary="Login" />
                            </ListItem>
                        </List>
                    </Box>
                </Drawer>
            </Toolbar>
        </AppBar>
    );
};

export default Navigation;
