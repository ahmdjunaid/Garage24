import React, { useEffect, useState } from "react";
import type { Role } from "../types/UserTypes";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store/store";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { fetchGarageStatusApi } from "../services/garage";
import Spinner from "../components/elements/Spinner";

interface ProtectedRouteProps {
  requiredRoles: Role[];
  checkGarageApproval?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRoles,
  checkGarageApproval = false,
}) => {
  const { user, token, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();

  const [garageApproved, setGarageApproved] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyGarage = async () => {
      try {
        if (checkGarageApproval && user?.role === "garage") {
          const { data } = await fetchGarageStatusApi();
          setGarageApproved(data.isApproved);
        }
      } catch (err) {
        console.error("Error checking garage approval:", err);
        setGarageApproved(false);
      } finally {
        setLoading(false);
      }
    };

    verifyGarage();
  }, [checkGarageApproval, user]);

  useEffect(() => {
    if (!user) return;

    const role = user?.role?.toLowerCase();
    const onboardingPath = `/${role}/onboarding`;
    const basePath = `/${role}`;
    const currentPath = window.location.pathname;

    if (user.isOnboardingRequired && !currentPath.endsWith(onboardingPath)) {
      navigate(onboardingPath, { replace: true });
      return;
    }

    if (
      !user.isOnboardingRequired &&
      currentPath.endsWith(onboardingPath) &&
      (role !== "garage" || garageApproved === true)
    ) {
      navigate(basePath, { replace: true });
    }
  }, [user, navigate, garageApproved]);

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }


  const role = user?.role as Role;
  if (requiredRoles.length && !requiredRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (checkGarageApproval && user?.role === "garage") {
    if (loading) {
      return <Spinner loading={loading} />;
    }

    if (
      user.isOnboardingRequired === false &&
      garageApproved === false
    ) {
      return <Navigate to="/garage/onboarding" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
