import AdminSidebar from "@/components/common/AdminSidebar";
import AdminHeader from "@/components/common/AdminHeader";
import AdminDashboard from "../../components/AdminDashboard";

const Dashboard = () => {

  

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <AdminSidebar role="admin" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader text={"Dashboard"} />
        <AdminDashboard />
      </div>
    </div>
  );
};

export default Dashboard;