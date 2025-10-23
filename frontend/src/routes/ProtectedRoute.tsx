import React from "react";
import type { Role } from "../types/UserTypes";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store/store";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  requiredRoles: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRoles }) => {
  const { user, token, isAuthenticated } = useSelector((state: RootState) => state.auth);
  console.log(user, token);
  

  if (!token || !isAuthenticated) {
    return <Navigate to={"/login"} replace />;
  }

  if (requiredRoles && !requiredRoles.includes(user?.role as Role)) {
    return <Navigate to={"/unauthorized"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
