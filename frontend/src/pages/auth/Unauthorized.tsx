import React from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/icons/Logo.png";



export default function UnauthorizedPage() {
const navigate = useNavigate()


  const handleLogin = () => {
    navigate("/login")
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 max-w-2xl w-full">
        {/* Logo */}
        <div className="flex items-center mb-6 sm:mb-8 w-50 sm:w-50 md:w-58">
          <img src={logo} alt="" />
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-50 rounded-full mb-6">
            <Lock className="w-12 h-12 text-red-500" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Unauthorized Access
          </h1>
          
          <p className="text-gray-600 text-lg mb-2">
            You don't have permission to access this page
          </p>
          
          <p className="text-gray-500">
            Please log in with proper credentials or contact your administrator
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={handleGoBack}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          
          <button
            onClick={handleLogin}
            className="flex-1 px-6 py-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors"
          >
            Login
          </button>
        </div>

        {/* Error Code */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          Error Code: 403
        </div>
      </div>
    </div>
  );
}