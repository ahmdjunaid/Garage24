import { Route, Routes } from "react-router-dom";
import SignUp from "@features/auth/pages/SignUp";
import Onboarding from "@features/management/garage/pages/GarageOnboarding";
import ProtectedRoute from "./ProtectedRoute";
import GarageHome from "@/features/dashboards/pages/garage/GarageHome";
import GarageMechanic from "@features/management/garage/pages/GarageMechanic";
import PageNotFound from "@features/auth/pages/PageNotFound";
import GaragePlans from "@features/subscription/pages/GaragePlans";
import GarageServices from "@features/management/garage/pages/GarageServices";
import GarageAppointments from "@features/appointments/pages/garage/GarageAppointments";
import ProfilePage from "@features/profile/pages/Profile";

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
        <Route path="/profile" element={<ProfilePage />}/>
        <Route path="*" element={<PageNotFound/>}/>
      </Route>
    </Routes>
  );
};

export default GarageRoutes;
