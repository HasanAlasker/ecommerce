import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Nav from "./components/Nav";
import Register from "./pages/Register";
import AuthProvider from "./context/AuthProvider";


function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
    <Nav></Nav>
      <Routes >
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
    
  );
}

export default App;
