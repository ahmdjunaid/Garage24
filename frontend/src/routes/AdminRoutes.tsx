import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

const AdminRoutes = () => {
  return (
    <div>
      <Routes>
        <Route element={<ProtectedRoute requiredRoles={["admin"]} />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
      </Routes>
    </div>
  );
};

export default AdminRoutes;
