import React from "react";
import Login from "../pages/auth/Login";
import { Route, Routes } from "react-router-dom";
import SignUp from "../pages/auth/SignUp";
import HomePage from "../pages/user/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import ForgotPassword from "../pages/auth/ForgotPassword";
import UnauthorizedPage from "../pages/auth/Unauthorized";
import PageNotFound from "../pages/auth/PageNotFound";
import MyGarage from "@/pages/user/MyGarage";
import Appointment from "@/pages/user/Appointment";
import Profile from "@/pages/user/Profile";
import MyAppointments from "@/pages/user/MyAppointments";

const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp role={'user'}/>} />
      <Route path="/forgot-password" element={<ForgotPassword/>} />
      <Route path="/unauthorized" element={<UnauthorizedPage/>} />
        <Route path="/" element={<HomePage />} />
      <Route element={<ProtectedRoute requiredRoles={["user"]} />}>
        <Route path="/my-garage" element={<MyGarage/>}/>
        <Route path="/appointment" element={<Appointment />}/>
        <Route path="/my-appointments" element={<MyAppointments />}/>
        <Route path="/profile" element={<Profile />}/>
        <Route path="*" element={<PageNotFound/>}/>
      </Route>
    </Routes>
  );
};

export default UserRoutes;
