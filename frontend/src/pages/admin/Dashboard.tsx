import AdminSidebar from "@components/layouts/admin/AdminSidebar";
import AdminHeader from "@components/layouts/admin/AdminHeader";

const Dashboard = () => {

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <AdminSidebar role="admin" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader text={"Dashboard"} />
      </div>
    </div>
  );
};

export default Dashboard;