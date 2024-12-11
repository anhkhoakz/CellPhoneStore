import { Box, Button, Divider, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import TabletMacIcon from '@mui/icons-material/TabletMac';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import CategoryIcon from '@mui/icons-material/Category';

const categoryIcons = {
    phone: <PhoneAndroidIcon sx={{ fontSize: "1.5em" }} />,
    tablet: <TabletMacIcon sx={{ fontSize: "1.5em" }} />,
    laptop: <LaptopMacIcon sx={{ fontSize: "1.5em" }} />,
    headphone: <HeadphonesIcon sx={{ fontSize: "1.5em" }} />,
};

const Category = ({ categories }) => {
	return (
		<Box
			sx={{
				margin: "2em auto", // Tạo khoảng cách trên và dưới
				padding: "1em",
				// backgroundColor: "#f9f9f9",
				maxWidth: "100%",
				textAlign: "center", // Căn giữa nội dung bên trong Box
			}}
		>
			<Typography
				variant="h4"
				sx={{
					marginBottom: "0.5em",
					fontWeight: "bold",
					color: "#1977d3",
				}}
			>
				SHOP BY CATEGORY
			</Typography>
			<Box
				sx={{
					display: "flex",
					gap: "1em",
					flexWrap: "wrap",
					justifyContent: "center", // Căn giữa các button theo chiều ngang
					margin: "0 auto", // Căn giữa Box cha
					maxWidth: "100%", // Giới hạn chiều rộng của Box
					alignItems: "center", // Căn giữa các item theo chiều dọc nếu có nhiều hàng
					justifyItems: "center", // Giúp căn giữa các item nếu trong một hàng
				}}
			>
				{categories.map((category) => (
					<Link
						key={category.name}
						to={`/category/${category.name.toLowerCase()}`} // Điều hướng đến trang danh mục theo tên
						style={{ textDecoration: "none" }}
					>
						<Button
							variant="outlined"
							sx={{
								padding: "1em",
								width: "150px",
								"&:hover": {
									backgroundColor: "#1977d3", // Thêm màu nền khi hover
									color: "#fff", // Thay đổi màu chữ khi hover
									borderColor: "#1977d3", // Thêm viền khi hover
								},
							}}
						>
							{categoryIcons[category.name.toLowerCase()] || <CategoryIcon sx={{ fontSize: "1.5em" }} />}
                            {category.name}
						</Button>
					</Link>
				))}
			</Box>
			<Divider
				sx={{
					marginTop: 4,
					width: "80%",
					margin: "40px auto 0 auto",
					backgroundColor: "blue",
				}}
			/>
		</Box>
	);
};

export default Category;
