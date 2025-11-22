import { useEffect, useState } from "react";
import logo from "../../assets/icons/Logo.png";
import banner from "../../assets/banner/LoginBanner.jpg";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/elements/Input";
import AuthButton from "../../components/elements/AuthButton";
import emailIcon from "../../assets/icons/email.svg";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import type { Role } from "../../types/UserTypes";
import { forgotPasswordApi } from "../../services/authServices";
import OtpModalLight from "../../components/modal/OtpModalLight";
import ResetPassModal from "../../components/modal/ResetPassModal";
import { emailRegex } from "../../constants/commonRegex";
import Spinner from "../../components/elements/Spinner";
import { setAccessToken } from "../../redux/slice/userSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showReset, setShowReset] = useState<boolean>(false);
  
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      const roleRoutes: Record<Role, string> = {
        user: "/",
        mechanic: "/mechanic",
        garage: "/garage",
        admin: "/admin",
      };

      navigate(roleRoutes[user?.role] || "/");
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async () => {
    setEmailError("");
    setError("");
    setLoading(true);

    const isValid = emailRegex.test(email);

    if (!isValid) {
      setEmailError("Enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      await forgotPasswordApi({ email });
      setShowModal(true);
    } catch (error) {
      if(error instanceof Error){
        setError(error.message)
      }else{
        setError("Something went wrong.")
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Left side - Login Form */}
          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center relative">
            {/* Logo */}
            <div className="mb-8">
              <img
                src={logo}
                alt="GARAGE24"
                className="w-30 sm:w-35 md:w-40 lg:w-48 xl:w-56"
              />
            </div>

            {/* Welcome text */}
            <div className="mb-4">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Forgot your password ?
              </h1>
              <p className="text-gray-600">
                Let’s continue where you left off.
              </p>
            </div>

            {/* Error div */}
            {error && (
              <div className="bg-red-100 border border-red-600 p-2 rounded-lg mb-2">
                <p className="text-center text-red-600">{error}</p>
              </div>
            )}

            {/* LoginForm */}
            <div className="space-y-4">
              <Input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                value={email}
                icon={emailIcon}
              />
              {emailError ? (
                <p className="text-red-600 font-light text-sm ">{emailError}</p>
              ) : (
                ""
              )}
              <AuthButton
                text={loading ? "LOADING..." : "RESET PASSWORD"}
                action={handleSubmit}
                loading={loading}
              />
            </div>

            {/* Login link */}
            <div className="text-center mt-6">
              <span className="text-sm text-gray-600">
                Back to login?{" "}
                <Link
                  to={"/login"}
                  className="text-gray-900 font-medium hover:text-red-500"
                >
                  Login
                </Link>
              </span>
            </div>

            {/* Sign up link */}
            <div className="text-center mt-6">
              <span className="text-sm text-gray-600">
                New here?{" "}
                <Link
                  to={"/signup"}
                  className="text-gray-900 font-medium hover:text-red-500"
                >
                  Create an account
                </Link>
              </span>
            </div>
          </div>

          <Spinner loading={loading} />

          {/* OTP Modal */}
          <OtpModalLight
            isOpen={showModal}
            onClose={()=>setShowModal(false)}
            context="other"
            email={email}
            onVerified={(accessToken)=>{
              dispatch(setAccessToken(accessToken))
              setShowReset(true)
            }}
          />

          {/* Reset password modal */}
          <ResetPassModal
            isOpen={showReset}
            onClose={()=>setShowReset(false)}
            email={email}
          />

          {/* Right side - Image */}
          <div className="lg:w-1/2 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-opacity-30"></div>
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${banner})`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
