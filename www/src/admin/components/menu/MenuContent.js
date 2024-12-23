import { DiscountOutlined } from "@mui/icons-material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import InventorySharpIcon from "@mui/icons-material/InventorySharp";
import PersonIcon from "@mui/icons-material/Person";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import * as React from "react";
import { Link, useLocation } from "react-router-dom";

const mainListItems = [
    { text: "Home", icon: <HomeRoundedIcon />, path: "/admin" },
    { text: "Users", icon: <PersonIcon />, path: "/admin/user" },
    {
        text: "Product",
        icon: <Inventory2OutlinedIcon />,
        path: "/admin/product",
    },
    { text: "Order", icon: <InventorySharpIcon />, path: "/admin/order" },
    { text: "Discount", icon: <DiscountOutlined />, path: "/admin/discount" },
];


function RenderListItems({ items, isMain }) {
    const location = useLocation();
    return (
        <List dense>
            {items.map((item, index) => (
                <ListItem key={index} disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                        component={isMain ? Link : "div"}
                        to={isMain ? item.path : undefined}
                        selected={isMain && location.pathname === item.path}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
}

export default function MenuContent() {
    return (
        <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
            <RenderListItems items={mainListItems} isMain />
        </Stack>
    );
}
