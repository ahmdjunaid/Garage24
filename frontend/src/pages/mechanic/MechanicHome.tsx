import React, { useState } from "react";
import AdminSidebar from "../../components/elements/AdminSidebar";
import AdminHeader from "../../components/elements/AdminHeader";

const MechanicHome = () => {
  const [searchQuery, setSearchQuery] = useState<string>("")

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <AdminSidebar role="mechanic" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader text={"Dashboard"} searchPlaceholder={"Search anything..."} setSearchQuery={setSearchQuery}/>
      </div>
    </div>
  );
};

export default MechanicHome;
