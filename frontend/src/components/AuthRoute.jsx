import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthRoute() {

  const { user } = useAuth();
  const isAuthinticated = user && user.role === 'user'

  if(!isAuthinticated){
    return <Navigate to={"/login"} replace />
  }

  return <Outlet />;
}
