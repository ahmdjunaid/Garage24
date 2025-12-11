import { Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/admin/Dashboard";
import ProtectedRoute from "@/routes/ProtectedRoute";
import AdminUser from "@/pages/admin/AdminUsers";
import AdminGarages from "@/pages/admin/AdminGarages";
import PageNotFound from "@/pages/auth/PageNotFound";
import AdminPlans from "@/pages/admin/AdminPlans";

const AdminRoutes = () => {
  return (
    <div>
      <Routes>
        <Route element={<ProtectedRoute requiredRoles={["admin"]} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<AdminUser/>}/>
          <Route path="/garages" element={<AdminGarages/>}/>
          <Route path="/plans" element={<AdminPlans/>}/>
          <Route path="*" element={<PageNotFound/>}/>
        </Route>
      </Routes>
    </div>
  );
};

export default AdminRoutes;
