import AdminHeader from "@/components/layouts/admin/AdminHeader";
import AdminSidebar from "@/components/layouts/admin/AdminSidebar";
import { CommonProfile, type ProfileDataUpdate } from "@/components/layouts/common/ProfileOverview";
import { getMeApi } from "@/services/authServices";
import type { IUsersMappedData, Role } from "@/types/UserTypes";
import { errorToast } from "@/utils/notificationAudio";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const [user, setUser] = useState<IUsersMappedData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await getMeApi();
      setUser(res);
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (data:ProfileDataUpdate) => {
    
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
      <AdminSidebar role={user?.role as Role} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader text={"Profile"} />

        <div className="flex-1 bg-gradient-to-br from-gray-950 via-gray-900 to-black p-8 overflow-auto">
          <CommonProfile
            loading={loading}
            name={user?.name}
            email={user?.email}
            role={user?.role}
            mobileNumber={user?.mobileNumber}
            imageUrl={user?.imageUrl}
            onChangePassword={(data) => console.log(dta)}
            onUpdateProfile={(data) => handleProfileUpdate(data)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
