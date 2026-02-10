import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MechanicOnboarding from "@features/management/mechanic/pages/MechanicOnboarding";
import MechanicHome from "@features/management/mechanic/pages/MechanicHome";
import PageNotFound from "@features/auth/pages/PageNotFound";
import ProfilePage from "@features/profile/pages/Profile";
import MechanicAppointments from "@features/appointments/pages/mechanic/MechanicAppointment";

const MechanicRoute: React.FC = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute requiredRoles={["mechanic"]} />}>
        <Route path="/onboarding" element={<MechanicOnboarding />} />
        <Route path="/" element={<MechanicHome />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/appointments" element={<MechanicAppointments/>} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

export default MechanicRoute;
