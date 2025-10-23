import React from "react";
import Login from "../pages/auth/Login";
import { Route, Routes } from "react-router-dom";
import SignUp from "../pages/auth/SignUp";
import HomePage from "../pages/user/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import ForgotPassword from "../pages/auth/ForgotPassword";
import UnauthorizedPage from "../pages/auth/Unauthorized";

const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp role={'user'}/>} />
      <Route path="/forgot-password" element={<ForgotPassword/>} />
      <Route path="/unauthorized" element={<UnauthorizedPage/>} />
      <Route element={<ProtectedRoute requiredRoles={["user"]} />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;
