import Divider from "@mui/material/Divider";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import * as React from "react";
import MenuContent from "./MenuContent";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom"; // Thêm import này



export default function SideMenu() {
    const [cookies, removeCookie] = useCookies(); // Hook quản lý cookie
    const navigate = useNavigate(); // Hook điều hướng


    const drawerWidth = 240;

    const Drawer = styled(MuiDrawer)(() => ({
        width: drawerWidth,
        flexShrink: 0,
        boxSizing: "border-box",
        mt: 10,
        [`& .${drawerClasses.paper}`]: {
            width: drawerWidth,
            boxSizing: "border-box",
        },
    }));

    const handleLogout = () => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/logout`, {
            method: "DELETE",
            credentials: "include", // Đảm bảo cookie được gửi cùng request
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.message); // In ra thông báo từ server

                // Xóa cookies sau khi logout
                removeCookie("accessToken");
                removeCookie("_ga_QM7W25Wv18");
                removeCookie("userId");

                // Chuyển hướng về trang đăng nhập
                navigate("/"); // Điều hướng về trang login
            })
            .catch((err) => {
                console.error("Logout failed", err); // Xử lý lỗi nếu có
            });
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                display: { xs: "none", md: "block" },
                [`& .${drawerClasses.paper}`]: {
                    backgroundColor: "background.paper",
                },
            }}
        >
            <Divider />
            <MenuContent />
            <Stack
                direction="row"
                sx={{
                    p: 2,
                    gap: 1,
                    alignItems: 'center',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Avatar
                    sizes="small"
                    src="/static/images/avatar/7.jpg"
                    sx={{ width: 36, height: 36 }}
                />
                <Box sx={{ mr: 'auto' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
                        Admin
                    </Typography>
                </Box>
            </Stack>
            <Box sx={{ p: 2 }}>
                <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Box>
        </Drawer>
    );
}
