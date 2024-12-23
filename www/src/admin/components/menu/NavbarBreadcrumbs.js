import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { useLocation } from "react-router-dom";

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
    margin: theme.spacing(1, 0),
    [`& .${breadcrumbsClasses.separator}`]: {
        color: (theme.vars || theme).palette.action.disabled,
        margin: 1,
    },
    [`& .${breadcrumbsClasses.ol}`]: {
        alignItems: "center",
    },
}));

export default function NavbarBreadcrumbs() {
    const location = useLocation();

    const getBreadcrumbName = () => {
        const path = location.pathname;

        if (path.includes("/user")) {
            return "Users";
        } else if (path.includes("/product")) {
            return "Products";
        } else if (path.includes("/order")) {
            return "Orders";
        } else if (path.includes("/discount")) {
            return "Discounts";
        }
        return "Home";
    };

    return (
        <StyledBreadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextRoundedIcon fontSize="small" />}
        >
            <Typography variant="body1">Dashboard</Typography>
            <Typography
                variant="body1"
                sx={{ color: "text.primary", fontWeight: 600 }}
            >
                {getBreadcrumbName()}
            </Typography>
        </StyledBreadcrumbs>
    );
}
