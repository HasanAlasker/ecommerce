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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav></Nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<AuthRoute />}>
            <Route path="/cart" element={<Cart />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/orders" element={<Orders />} />
          </Route>
        </Routes>
        <Footer></Footer>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
