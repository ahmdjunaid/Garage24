import React from "react";
import Login from "@features/auth/pages/Login";
import { Route, Routes } from "react-router-dom";
import SignUp from "@features/auth/pages/SignUp";
import ProtectedRoute from "./ProtectedRoute";
import ForgotPassword from "@features/auth/pages/ForgotPassword";
import UnauthorizedPage from "@features/auth/pages/Unauthorized";
import PageNotFound from "@features/auth/pages/PageNotFound";
import MyGarage from "@features/myGarage/pages/MyGarage";
import Appointment from "@features/appointments/pages/user/Appointment";
import Profile from "@features/profile/pages/UserProfile";
import MyAppointments from "@features/appointments/pages/user/MyAppointments";
import RescheduleAppointment from "@features/appointments/pages/user/RescheduleAppointment";
import AppointmentDetailsPage from "@features/appointments/pages/user/AppointmentDetailsPage";
import HomePage from "@features/home/pages/HomePage";

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
        <Route path="/appointment/:appointmentId/reschedule" element={<RescheduleAppointment />}/>
        <Route path="/appointment/:appointmentId" element={<AppointmentDetailsPage isUserView={true}/>}/>
        <Route path="/profile" element={<Profile />}/>
        <Route path="*" element={<PageNotFound/>}/>
      </Route>
    </Routes>
  );
};

export default UserRoutes;
