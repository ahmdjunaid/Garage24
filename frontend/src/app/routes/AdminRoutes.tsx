import { Routes, Route } from "react-router-dom";
import Dashboard from "@/features/dashboards/pages/admin/Dashboard";
import ProtectedRoute from "@/app/routes/ProtectedRoute";
import AdminUser from "@features/management/admin/pages/AdminUsers";
import AdminGarages from "@features/management/admin/pages/AdminGarages";
import PageNotFound from "@features/auth/pages/PageNotFound";
import AdminPlans from "@features/subscription/pages/AdminPlans";
import ProfilePage from "@features/profile/pages/Profile";
import AppointnmentReportAdmin from "@/features/reports/pages/admin/AppointnmentReportAdmin";

const AdminRoutes = () => {
  return (
    <div>
      <Routes>
        <Route element={<ProtectedRoute requiredRoles={["admin"]} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<AdminUser/>}/>
          <Route path="/garages" element={<AdminGarages/>}/>
          <Route path="/plans" element={<AdminPlans/>}/>
          <Route path="/profile" element={<ProfilePage />}/>
          <Route path="/reports" element={<AppointnmentReportAdmin />} />
          <Route path="*" element={<PageNotFound/>}/>
        </Route>
      </Routes>
    </div>
  );
};

export default AdminRoutes;
