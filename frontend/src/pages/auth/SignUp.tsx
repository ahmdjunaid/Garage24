import { useEffect, useState } from "react";
import logo from "../../assets/icons/Logo.png";
import banner from "../../assets/banner/signUpBanner.jpg";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/elements/Input";
import AuthButton from "../../components/elements/AuthButton";
import passwordIcon from "../../assets/icons/password.svg";
import emailIcon from "../../assets/icons/email.svg";
import userIcon from "../../assets/icons/user.svg";
import companyIcon from "../../assets/icons/company.svg";
import {
  googleLoginApi,
  resendOtpApi,
  SignUpApi,
  verifyOtpApi,
} from "../../services/auth";
import Modal from "../../components/modal/Modal";
import Spinner from "../../components/elements/Spinner";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import type { Role } from "../../types/UserTypes";
import { errorToast, successToast } from "../../utils/notificationAudio";
import { useGoogleLogin } from "@react-oauth/google";
import { login } from "../../redux/slice/userSlice";

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
  const [Cpassword, setCPassword] = useState<string>("");
  const [CpasswordError, setCPasswordError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);
  const [otpError, setOtpError] = useState<string>("");
  const [resendDisabled, setResendDisabled] = useState<boolean>(false)

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
    if (isAuthenticated && user?.role && user.isVerified) {
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
    setCPasswordError("");
    let hasError = false;

    if (!name || !email || !password || !Cpassword) {
      errorToast("All fields are required");
      return;
    }

    const nameRegex = /^[A-Za-z]{3,}(?: [A-Za-z]+)*$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

    if (!name.trim() || !nameRegex.test(name.trim())) {
      setNameError("Name must have at least 3 characters and only letters");
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

    if (Cpassword !== password) {
      setCPasswordError("Passwords do not match.");
      hasError = true;
    }

    if (hasError) return;

    try {
      setLoading(true);
      const data = await SignUpApi({ name, email, password, role });
      if (data) {
        setShowModal(true);
        setSeconds(120);
      } else {
        errorToast("Signup Failed, Please try again.");
      }
    } catch (err: any) {
      const error = err as Error;
      errorToast(error.message || "SignUp Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtp = async () => {
    setOtpError("")
    try {

      const otpRegex = /^\d{6}$/;

      if(!otpRegex.test(otp)){
        setOtpError("OTP must be a 6-digit number.")
        return
      }

      await verifyOtpApi({ email, otp });

      successToast("OTP has been Verified. Login with your credentials.");
      
      setTimeout(() => {
        setShowModal(!showModal);
        setOtp("");
        navigate("/login");
      }, 2000);

    } catch (error: any) {
      console.error("error on verifying Otp", error.message);
      setOtpError(error.message || "something went wrong");
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendDisabled(true)
      await resendOtpApi({ email });
      setSeconds(120);

      successToast("OTP has been resent successfully.");

      setTimeout(()=>{
        setResendDisabled(false)
      },10000)

    } catch (error: any) {
      console.error(error);
      setOtpError(error.message || "Error while resend OTP.");
    }
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
      } catch (error: any) {
        errorToast(error.message || "Google login failed");
      }
    },

    onError: () => {
      errorToast("Google login failed");
    },
  });

  const handleError = ()=>{
    setOtp("")
    setOtpError("")
  }

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
              <Input
                placeholder="Confirm Password"
                onChange={(e) => setCPassword(e.target.value)}
                type="password"
                value={Cpassword}
                icon={passwordIcon}
              />
              {CpasswordError ? (
                <p className="text-red-600 font-light text-sm ">
                  {CpasswordError}
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
            <Modal
              isOpen={showModal}
              onClose={() => setShowModal(!showModal)}
              handleError={() =>handleError()}
            >
              <div className="flex flex-col space-y-4">
                <p className="text-center text-black/50 font-bold">
                  OTP Verification
                </p>
                {otpError && (
                  <div className="bg-red-100 border border-red-600 p-2 rounded-lg mb-2">
                    <p className="text-red-600 text-center text-sm">
                      {otpError}
                    </p>
                  </div>
                )}
                <Input
                  icon={passwordIcon}
                  placeholder="Enter OTP"
                  onChange={(e) => setOtp(e.target.value)}
                  type="text"
                  value={otp}
                />
                <AuthButton
                  action={handleOtp}
                  text={"Verify OTP"}
                  loading={seconds > 0 ? false : true}
                />
                {seconds > 0 ? (
                  <p className="text-center text-black/50 font-light">
                    {seconds} Seconds Left
                  </p>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    disabled={resendDisabled}
                    className="text-center text-black/50 font-bold hover:text-red-500"
                  >
                    {resendDisabled ? "Please wait..." : "Resend OTP"}
                  </button>
                )}
              </div>
            </Modal>

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
