import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import AdminUser from "../pages/admin/AdminUser";
import AdminGarages from "../pages/admin/AdminGarages";
import PageNotFound from "../pages/auth/PageNotFound";

const AdminRoutes = () => {
  return (
    <div>
      <Routes>
        <Route element={<ProtectedRoute requiredRoles={["admin"]} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<AdminUser/>}/>
          <Route path="/garages" element={<AdminGarages/>}/>
          <Route path="*" element={<PageNotFound/>}/>
        </Route>
      </Routes>
    </div>
  );
};

export default AdminRoutes;
