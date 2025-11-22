import React, { useEffect, useState } from "react";
import type { Role } from "../types/UserTypes";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store/store";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { fetchGarageStatusApi } from "../services/garageServices";
import Spinner from "../components/elements/Spinner";
import type { approvalStatus } from "../types/GarageTypes";

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

  const [approvalStatus, setApprovalStatus] = useState<approvalStatus | null>(
    null
  );
  const [hasActivePlan, setHasActivePlan] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyGarage = async () => {
      try {
        if (checkGarageApproval && user?.role === "garage") {
          const data = await fetchGarageStatusApi();
          setApprovalStatus(data.approvalStatus);
          setHasActivePlan(data.hasActivePlan);
        }
      } catch (err) {
        console.error("Error checking garage approval:", err);
        setApprovalStatus(null);
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
      role !== "garage" &&
      role !== "mechanic"
    ) {
      navigate(basePath, { replace: true });
    }
  }, [user, navigate]);

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role as Role;
  if (requiredRoles.length && !requiredRoles.includes(role)) {
    switch (role) {
      case "admin":
        return <Navigate to="/admin" replace />;
      case "garage":
        return <Navigate to="/garage" replace />;
      case "mechanic":
        return <Navigate to="/mechanic" replace />;
      case "user":
        return <Navigate to="/" replace />;
      default:
        return <Navigate to="/unauthorized" replace />;
    }
  }

  if (checkGarageApproval && user?.role === "garage") {
    if (loading) {
      return <Spinner loading={loading} />;
    }

    if (user.isOnboardingRequired === false && approvalStatus === "pending") {
      return <Navigate to="/garage/onboarding" replace />;
    }
  }

  // if (user?.role === "garage" && !hasActivePlan) {
  //   if (window.location.pathname !== "/garage/plans") {
  //     errorToast("You dont have a valid plan to proceed.")
  //     return <Navigate to="/garage/plans" replace />;
  //   }
  // }

  return <Outlet />;
};

export default ProtectedRoute;
