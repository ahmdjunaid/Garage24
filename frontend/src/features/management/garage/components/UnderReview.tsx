import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/icons/Logo.png";
import { useDispatch } from "react-redux";
import { fetchGarageStatusApi } from "@/features/subscription/services/subscriptionService";
import { errorToast, successToast } from "@/utils/notificationAudio";
import { logoutApi } from "@/features/auth/services/authServices";
import { logout } from "@/redux/slice/userSlice";

const UnderReview = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await fetchGarageStatusApi();
      if (data.isApproved) {
        successToast("Garage approved! Redirecting...");
        setTimeout(() => {
          navigate("/garage");
        }, 1000);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

    const handleLogout = async () => {
      try {
        await logoutApi();
        dispatch(logout())
        successToast("Logout successfull.")
      } catch (error) {
        if(error instanceof Error)
          errorToast(error.message)
          console.error(error);
      }
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
  <div className="bg-white p-5 rounded-2xl shadow-2xl text-center max-w-lg w-full transform transition-all duration-300 hover:scale-[1.01]">
    <div className="flex flex-col px-5">
      <img
        src={logo}
        alt="Garage24 Logo"
        className="w-28 h-28 object-contain"
      />
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Registration Under Review
      </h2>
      <p className="text-gray-600 leading-relaxed mb-8 text-[15px] px-3">
        Your garage registration request has been submitted successfully. <br />
        Our admin team is reviewing your details. You’ll be notified once your
        garage is approved.
      </p>
    </div>

    {/* Logout button */}
    <div className="flex justify-end pe-5">
      <button 
      onClick={handleLogout}
      className="bg-red-600 text-white px-6 py-2 rounded-md font-medium shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-200">
        Logout
      </button>
    </div>
  </div>
</div>

  );
};

export default UnderReview;
