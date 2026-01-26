import AdminHeader from "@/components/layouts/admin/AdminHeader";
import AdminSidebar from "@/components/layouts/admin/AdminSidebar";
import {
  CommonProfile,
  type ProfileDataUpdate,
} from "@/components/layouts/common/ProfileOverview";
import { login } from "@/redux/slice/userSlice";
import type { RootState } from "@/redux/store/store";
import { getMeApi, updateProfileDataApi } from "@/services/authServices";
import type { IUsersMappedData, Role, User } from "@/types/UserTypes";
import { errorToast, successToast } from "@/utils/notificationAudio";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ProfilePage = () => {
  const [currentUser, setCurrentUser] = useState<IUsersMappedData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await getMeApi();
      setCurrentUser(res);
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (data: ProfileDataUpdate) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name!);
      formData.append("mobileNumber", data.mobileNumber!);

      if (data.image) {
        formData.append("profile", data.image);
      }

      const res = await updateProfileDataApi(formData);
      dispatch(
        login({
          user: res as User,
          token,
        }),
      );
      successToast("Profile Updated");
      setCurrentUser(res)
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
    }
  };

  // const handlePasswordChange = async () => {
  //   try {
      
  //   } catch (error) {
      
  //   }
  // }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
      <AdminSidebar role={currentUser?.role as Role} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader text={"Profile"} />

        <div className="flex-1 bg-gradient-to-br from-gray-950 via-gray-900 to-black p-8 overflow-auto">
          <CommonProfile
            loading={loading}
            name={currentUser?.name}
            email={currentUser?.email}
            role={currentUser?.role}
            mobileNumber={currentUser?.mobileNumber}
            imageUrl={currentUser?.imageUrl}
            onChangePassword={(data) => console.log(data)}
            onUpdateProfile={(data) => handleProfileUpdate(data)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
