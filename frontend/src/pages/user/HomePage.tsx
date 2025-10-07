import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slice/userSlice";
import { logoutApi } from "../../services/auth";

const HomePage = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const result = await logoutApi();

    if (result.success) {
      dispatch(logout());
    }
  };

  return (
    <div>
      <p>This is user home page</p>
      <button className="bg-red-600 p-4" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default HomePage;
