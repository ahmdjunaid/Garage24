import AdminSidebar from "@/components/common/AdminSidebar";
import AdminHeader from "@/components/common/AdminHeader";
import MechanicDashboard from "../../components/MechanicDashboard";

const MechanicHome = () => {

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <AdminSidebar role="mechanic" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader text={"Dashboard"} />
        <MechanicDashboard />
      </div>
    </div>
  );
};

export default MechanicHome;
