import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MechanicOnboarding from "../pages/auth/MechanicOnboarding";
import MechanicHome from "../pages/mechanic/MechanicHome";
import PageNotFound from "../pages/auth/PageNotFound";


const MechanicRoute: React.FC = () => {
  return (
    <Routes>
      <Route path="/onboarding" element={<MechanicOnboarding/>} />
      <Route element={<ProtectedRoute requiredRoles={["mechanic"]} />}>
        <Route path="/" element={<MechanicHome />} />
        <Route path="*" element={<PageNotFound/>}/>
      </Route>
    </Routes>
  );
};

export default MechanicRoute;
