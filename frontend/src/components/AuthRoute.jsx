import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthRoute() {

  const { isAuthinticated } = useAuth();

  if(!isAuthinticated){
    return <Navigate to={"/login"} replace />
  }

  return <Outlet />;
}
