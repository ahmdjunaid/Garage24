import React from "react";
import { Route, Routes } from "react-router-dom";
import SignUp from "../pages/auth/SignUp";
import Onboarding from "../pages/garages/GarageOnboarding";
import ProtectedRoute from "./ProtectedRoute";
import GarageHome from "../pages/garages/GarageHome";
import GarageMechanic from "../pages/garages/GarageMechanic";
import PageNotFound from "../pages/auth/PageNotFound";
import GaragePlans from "../pages/garages/GaragePlans";
import GarageServices from "@/pages/garages/GarageServices";
import GarageAppointments from "@/pages/garages/GarageAppointments";

const GarageRoutes = () => {
  return (
    <Routes>
      <Route path="/registration" element={<SignUp role={'garage'}/>} />
      <Route element={<ProtectedRoute requiredRoles={['garage']}/>} >
        <Route path="/onboarding" element={<Onboarding />} />
      </Route>
      <Route element={<ProtectedRoute requiredRoles={['garage']} checkGarageApproval={true} />}>
        <Route path="/" element={<GarageHome />} />
        <Route path="/mechanics" element={<GarageMechanic />} />
        <Route path="/services" element={<GarageServices />} />
        <Route path="/plans" element={<GaragePlans />} />
        <Route path="/appointments" element={<GarageAppointments />} />
        <Route path="*" element={<PageNotFound/>}/>
      </Route>
    </Routes>
  );
};

export default GarageRoutes;
