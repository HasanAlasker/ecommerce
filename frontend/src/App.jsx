import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Register from "./pages/Register";
import AuthProvider from "./context/AuthProvider";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import AuthRoute from "./components/AuthRoute";
import AdminRoute from "./components/AdminRoute";
import CartProvider from "./context/CartProvider";
import OrderProvider from "./context/OrderProvider";
import { useState } from "react";
import Menu from "./components/Menu";
import ScrollToTop from "./components/ScrollToTop";
import Users from "./pages/Users";
import Profile from "./pages/Profile";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <BrowserRouter>
          <ScrollToTop />
            <Nav onMenuOpen={openMenu}></Nav>
            <Menu isOpen={isMenuOpen} onClose={closeMenu} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<AuthRoute />}>
                <Route path="/cart" element={<Cart />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              <Route element={<AdminRoute />}>
                <Route path="/orders" element={<Orders />} />
                <Route path="/users" element={<Users />} />
              </Route>
            </Routes>
            <Footer></Footer>
          </BrowserRouter>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
