import { useEffect, useState } from "react";
import logo from "@assets/icons/Logo.png";
import banner from "@assets/banner/signUpBanner.jpg";
import { Link, useNavigate } from "react-router-dom";
import Input from "@components/elements/Input";
import AuthButton from "@components/elements/AuthButton";
import passwordIcon from "@assets/icons/password.svg";
import emailIcon from "@assets/icons/email.svg";
import userIcon from "@assets/icons/user.svg";
import companyIcon from "@assets/icons/company.svg";
import { googleLoginApi, signUpApi } from "@/services/authServices";
import Spinner from "@components/elements/Spinner";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import type { Role } from "@/types/UserTypes";
import { errorToast, successToast } from "@/utils/notificationAudio";
import { useGoogleLogin } from "@react-oauth/google";
import { login } from "@/redux/slice/userSlice";
import OtpModalLight from "@components/modal/OtpModalLight";
import { emailRegex, nameRegex, passwordRegex } from "@/constants/commonRegex";

type SignUpProps = {
  role: Role;
};

const SignUp: React.FC<SignUpProps> = ({ role }) => {
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (seconds === 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

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

  const handleSignup = async () => {
    setNameError("");
    setEmailError("");
    setPasswordError("");
    let hasError = false;

    if (!name || !email || !password) {
      errorToast("All fields are required");
      return;
    }

    if (!name.trim() || !nameRegex.test(name.trim())) {
      setNameError("Name must have at least 3 - 25 characters and only letters");
      hasError = true;
    }

    if (!email || !emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      hasError = true;
    }

    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be 8+ chars with uppercase, lowercase, number, and special character."
      );
      hasError = true;
    }

    if (hasError) return;

    try {
      setLoading(true);
      const data = await signUpApi({ name, email, password, role });
      if (data) {
        setShowModal(true);
      } else {
        errorToast("Signup Failed, Please try again.");
      }
    } catch (err) {
      if(err instanceof Error){
        errorToast(err.message);
      }else{
        errorToast("Signup Failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifiedOtp = () => {
    successToast("OTP has been Verified. Login with your credentials.");

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await googleLoginApi(tokenResponse);
        dispatch(login({ user: res.user, token: res.token }));

        if (res.user.role === "user") {
          navigate("/");
        } else {
          navigate(`/${user?.role}`);
        }
      } catch (error) {
        if(error instanceof Error){
          errorToast(error.message)
        }else{
          errorToast("Google login failed");
        }
      }
    },

    onError: () => {
      errorToast("Google login failed");
    },
  });

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
            <div className="mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                Welcome
              </h1>
              <p className="text-gray-600">
                We are glad to see you back with us
              </p>
            </div>

            <div className="space-y-4">
              <Input
                placeholder={role === "garage" ? "Company Name" : "Full Name"}
                onChange={(e) => setName(e.target.value)}
                type="text"
                value={name}
                icon={role === "garage" ? companyIcon : userIcon}
              />
              {nameError ? (
                <p className="text-red-600 font-light text-sm ">{nameError}</p>
              ) : (
                ""
              )}
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
              <Input
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                value={password}
                icon={passwordIcon}
              />
              {passwordError ? (
                <p className="text-red-600 font-light text-sm ">
                  {passwordError}
                </p>
              ) : (
                ""
              )}
              <AuthButton
                text={role === "garage" ? "Register Now" : "Sign Up"}
                action={handleSignup}
                loading={loading}
              />
            </div>

            {/* Loading spinner */}
            <Spinner loading={loading} />

            {/* OTP modal */}
            <OtpModalLight
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              context="register"
              email={email}
              onVerified={() => handleVerifiedOtp()}
            />

            {role === "garage" ? (
              ""
            ) : (
              <button
                onClick={() => handleGoogleLogin()}
                className="w-full border border-gray-300 py-3 px-4 mt-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                SignUp with google
              </button>
            )}

            {/* Sign up link */}
            <div className="text-center mt-6">
              <span className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to={"/login"}
                  className="text-gray-900 font-medium hover:text-red-500"
                >
                  Login
                </Link>
              </span>
            </div>
          </div>

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

export default SignUp;
