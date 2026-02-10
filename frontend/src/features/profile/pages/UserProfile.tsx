import {
  CommonProfile,
  type ProfileDataUpdate,
} from "@/features/profile/components/ProfileOverview";
import UserFooter from "@/features/home/components/UserFooter";
import UserHeader from "@/features/home/components/UserHeader";
import { login } from "@/redux/slice/userSlice";
import type { RootState } from "@/redux/store/store";
import type { IUsersMappedData, User } from "@/types/UserTypes";
import { errorToast, successToast } from "@/utils/notificationAudio";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePasswordApi, getMeApi, updateProfileDataApi } from "../services/ProfileService";

const Profile = () => {
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
      setCurrentUser(res);
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
    }
  };

  const handlePasswordChange = async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    try {
      const response = await changePasswordApi(data);
      successToast(response);
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
    }
  };

  return (
    <>
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <UserHeader />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <CommonProfile
          loading={loading}
          name={currentUser?.name}
          email={currentUser?.email}
          role={currentUser?.role}
          mobileNumber={currentUser?.mobileNumber}
          imageUrl={currentUser?.imageUrl}
          onChangePassword={(data) => handlePasswordChange(data)}
          onUpdateProfile={(data) => handleProfileUpdate(data)}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <UserFooter />
      </motion.div>
    </>
  );
};

export default Profile;
