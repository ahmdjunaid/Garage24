import AdminSidebar from "@/components/common/AdminSidebar";
import AdminHeader from "@/components/common/AdminHeader";
import ChatMechanic from "../../components/ChatMechanic";

const ChatMechanicPage = () => {

  

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <AdminSidebar role="mechanic" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader text={"Chats"} />
        <ChatMechanic />
      </div>
    </div>
  );
};

export default ChatMechanicPage;