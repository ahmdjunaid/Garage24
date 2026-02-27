import AdminSidebar from "@/components/common/AdminSidebar";
import AdminHeader from "@/components/common/AdminHeader";
import ChatGarage from "../../components/ChatGarage";

const ChatGaragePage = () => {

  

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <AdminSidebar role="garage" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader text={"Chats"} />
        <ChatGarage />
      </div>
    </div>
  );
};

export default ChatGaragePage;