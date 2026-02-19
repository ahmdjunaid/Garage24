import { Route, Routes, useLocation } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
import GarageRoutes from "./routes/GarageRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import MechanicRoute from "./routes/MechanicRoutes";
import { useEffect, useState } from "react";
import Spinner from "@components/common/Spinner";

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {loading && <Spinner loading={loading} />}

      <Routes>
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/garage/*" element={<GarageRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/mechanic/*" element={<MechanicRoute />} />
      </Routes>
    </>
  );
}

export default App;
