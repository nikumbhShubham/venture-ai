import React from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  const { token } = useAuthStore();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
