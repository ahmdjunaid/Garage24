import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@assets/icons/Logo.png";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Logo" className="h-12" />
        </div>

        {/* Content */}
        <div className="text-center">
          <h1 className="text-7xl font-bold text-gray-900 mb-3">404</h1>
          <p className="text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.history.back()}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>

            <button
              onClick={() => navigate("/login")}
              className="flex-1 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors"
            >
              Login
            </button>
          </div>

          {/* Error Code */}
          <div className="mt-8 text-gray-400 text-sm">
            Error Code: 404
          </div>
        </div>
      </div>
    </div>
  );
}