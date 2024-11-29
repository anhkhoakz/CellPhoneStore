// src/admin/AdminLayout.js
import React from "react";

const AdminLayout = ({ children }) => {
	return (
		<div className="admin-layout">
			<div className="admin-content">{children}</div>
		</div>
	);
};

export default AdminLayout;
