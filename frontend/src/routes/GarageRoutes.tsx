import React from "react";
import { Route, Routes } from "react-router-dom";
import SignUp from "../pages/auth/SignUp";
import Onboarding from "../pages/auth/GarageOnboarding";
import ProtectedRoute from "./ProtectedRoute";
import GarageHome from "../pages/garages/GarageHome";
import GarageMechanic from "../pages/garages/GarageMechanic";
import PageNotFound from "../pages/auth/PageNotFound";

const GarageRoutes = () => {
  return (
    <Routes>
      <Route path="/registration" element={<SignUp role={'garage'}/>} />
      <Route element={<ProtectedRoute requiredRoles={["garage"]} />}>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<GarageHome />} />
        <Route path="/mechanics" element={<GarageMechanic />} />
        <Route path="*" element={<PageNotFound/>}/>
      </Route>
    </Routes>
  );
};

export default GarageRoutes;
