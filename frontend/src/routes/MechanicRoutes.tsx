import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MechanicOnboarding from "../pages/auth/MechanicOnboarding";
import MechanicHome from "../pages/mechanic/MechanicHome";


const MechanicRoute: React.FC = () => {
  return (
    <Routes>
      <Route path="/onboarding" element={<MechanicOnboarding/>} />
      <Route element={<ProtectedRoute requiredRoles={["mechanic"]} />}>
        <Route path="/" element={<MechanicHome />} />
      </Route>
    </Routes>
  );
};

export default MechanicRoute;
