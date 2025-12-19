import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";

import FoodDeliveryApp from "./FoodDeliveryApp";
import MenuPage from "./MenuPage";
import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";
import CheckoutPage from "./CheckoutPage";
import MyOrdersPage from "./MyOrdersPage";
// Update this import based on where your file is located

// OR
// import OrderConfirmation from "./pages/OrderConfirmation"; // If file is in src/pages/

import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import Banners from "./admin/pages/Banners";
import Products from "./admin/pages/Products";
import Orders from "./admin/pages/Orders";
import CategoryManagement from "./admin/pages/CategoryManagement";

import { Toaster } from "react-hot-toast";
import { JSX } from "react";
import OrderConfirmation from "./OrderConfirmation";

/* ---------- ADMIN GUARD ---------- */
const AdminGuard = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/admin" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        {/* ================= PUBLIC SITE ================= */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<FoodDeliveryApp />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<MyOrdersPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        </Route>

        {/* ================= ADMIN LOGIN ================= */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* ================= ADMIN PANEL ================= */}
        <Route
          path="/admin/*"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route path="banners" element={<Banners />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;