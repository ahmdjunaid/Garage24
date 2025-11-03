import AdminSidebar from "../../components/elements/AdminSidebar";
import AdminHeader from "../../components/elements/AdminHeader";

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