import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./admin.css";

const AdminLayout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="admin-logo">Re-Eat Admin</h2>

        <nav>
          <NavLink to="/admin/banners">Banners</NavLink>
          <NavLink to="/admin/categories">Categories</NavLink>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
        </nav>

        <button className="admin-logout" onClick={logout}>
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <header className="admin-topbar">
          <h1>Dashboard</h1>
        </header>

        <section className="admin-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;