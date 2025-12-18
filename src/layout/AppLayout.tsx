// src/layout/AppLayout.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import CartSidebar from "../components/CartSidebar";
import AuthModal from "../components/AuthModal";

const AppLayout = () => {
  const [cartOpen, setCartOpen] = useState(false);
const [authOpen, setAuthOpen] = useState(false);
  return (
    <>
      <Header
        onCartOpen={() => setCartOpen(true)}
        onLoginOpen={() => setAuthOpen(true)}
      />
      <CartSidebar
        onLoginOpen={() => setAuthOpen(true)}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <Outlet />
    </>
  );
};

export default AppLayout;
