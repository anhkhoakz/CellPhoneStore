import PropTypes from "prop-types";
// src/admin/AdminLayout.js
import React from "react";

const AdminLayout = ({ children }) => {
    return (
        <div className="admin-layout">
            <div className="admin-content">{children}</div>
        </div>
    );
};
AdminLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AdminLayout;
