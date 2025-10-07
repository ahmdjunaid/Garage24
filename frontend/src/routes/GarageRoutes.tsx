import React from "react";
import { Route, Routes } from "react-router-dom";
import SignUp from "../pages/auth/SignUp";
import Onboarding from "../pages/auth/GarageOnboarding";
import ProtectedRoute from "./ProtectedRoute";
import GarageHome from "../pages/garages/GarageHome";

const GarageRoutes = () => {
  return (
    <Routes>
      <Route path="/registration" element={<SignUp role={'garage'}/>} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route element={<ProtectedRoute requiredRoles={["garage"]} />}>
        <Route path="/" element={<GarageHome />} />
      </Route>
    </Routes>
  );
};

export default GarageRoutes;
