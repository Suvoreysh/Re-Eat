import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
    return (
        <aside className="admin-sidebar">
            <h2>🍔 Re-Eat</h2>

            <NavLink to="/admin/banners">Banners</NavLink>
            <NavLink to="/admin/categories">Categories</NavLink>
            <NavLink to="/admin/products">Food Products</NavLink>
            <NavLink to="/admin/orders">Orders</NavLink>

        </aside>
    );
};

export default AdminSidebar;
