import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slice/userSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button className="bg-red-600 p-4" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
