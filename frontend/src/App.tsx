import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
import GarageRoutes from "./routes/GarageRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { GoogleOAuthProvider } from "@react-oauth/google";
import MechanicRoute from "./routes/MechanicRoutes";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <>
      <GoogleOAuthProvider clientId={googleClientId}>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<UserRoutes />} />
            <Route path="/garage/*" element={<GarageRoutes />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/mechanic/*" element={<MechanicRoute/>} />
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
