import React, { useEffect } from "react";
import type { Role } from "../types/UserTypes";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store/store";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  requiredRoles: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRoles }) => {
  const { user, token, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();

  console.log(user, "user");

  useEffect(() => {
    if (!user) return;

    const role = user?.role?.toLowerCase();
    const onboardingPath = `/${role}/onboarding`;
    const basePath = `/${role}`;
    const currentPath = window.location.pathname;

    if (user.isOnboardingRequired && !currentPath.endsWith(onboardingPath)) {
      navigate(onboardingPath, { replace: true });
    }

    if (!user.isOnboardingRequired && currentPath.endsWith(onboardingPath)) {
      navigate(basePath, { replace: true });
    }
  }, [user, navigate]);

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role as Role;
  if (requiredRoles.length && !requiredRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
