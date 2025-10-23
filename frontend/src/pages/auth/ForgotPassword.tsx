import { useEffect, useState } from "react";
import logo from "../../assets/icons/Logo.png";
import banner from "../../assets/banner/LoginBanner.jpg";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/elements/Input";
import AuthButton from "../../components/elements/AuthButton";
import emailIcon from "../../assets/icons/email.svg";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import type { Role } from "../../types/UserTypes";
import Modal from "../../components/modal/Layout/Modal";
import passwordIcon from "../../assets/icons/password.svg"
import { forgotPasswordApi, verifyOtpApi, resendOtpApi, resetPasswordApi} from "../../services/auth";
import { errorToast, successToast } from "../../utils/notificationAudio";
import { OTP_VERIFIED } from "../../constants/messages";


const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false)
  const [seconds, setSeconds] = useState<number>(0)
  const [otpError, setOtpError] = useState<string>("")
  const [resendDisabled, setResendDisabled] = useState<boolean>(false)
  const [passwordError, setPasswordError] = useState<string>('')
  const [showReset, setShowReset] = useState<boolean>(false)
  const [password, setPassword] = useState<string>("")
  const [CPassword, setCPassword] = useState<string>("")
  const [token, setToken] = useState(null)

  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(()=>{
    if(seconds===0) return
    const timer = setInterval(()=>{
      setSeconds(prev => prev - 1)
    },1000)

    return () => clearInterval(timer)

  },[seconds])

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
    setEmailError("")
    setError("")
    setLoading(true)

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    const isValid = emailRegex.test(email)

    if(!isValid){
      setEmailError("Enter a valid email address.")
      setLoading(false)
      return
    }

    try {
      await forgotPasswordApi({email})
      setShowModal(true)
      setSeconds(120)
    } catch (error:any) {
      setError(error.message)
    }finally{
      setLoading(false)
    }

  };

  const handleResetPassword = async () => {
    let hasError = false
    setPasswordError("")

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

    if(!password.trim() || !CPassword.trim()){
      setPasswordError("Enter and confirm your password.")
      hasError = true
    }

    if(!passwordRegex.test(password)){
      setPasswordError("Password must be 8+ chars with uppercase, lowercase, number, and special character.")
      hasError = true
    }

    if(password !== CPassword){
      setPasswordError("Please make sure the passwords match.")
      hasError = true      
    }

    if(hasError) return

    try {
      if(token){
        const res = await resetPasswordApi({email, password},token)
        successToast(res.message || "Password reset successfull.")

        setTimeout(()=>{
          setShowReset(false)
          navigate('/login')
          setPassword('')
          setCPassword('')
        },2000)
      }
    } catch (error:any) {
      errorToast(error.message || "Password reset failed, Try again.")
    }
  }

  const handleOtp = async () => {
    try {
      const res = await verifyOtpApi({ email, otp })
      setToken(res.token)
      successToast(OTP_VERIFIED)
      
      
      setTimeout(()=>{
        setShowModal(!showModal);
        setShowReset(!showReset)
        setOtp("");
      },2000)
    } catch (error:any) {
      console.error("error on sending otp", error);
      setOtpError(error.message || "something went wrong");
    }
  }

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

          {/* OTP modal */}
          <Modal isOpen={showModal} onClose={() => setShowModal(!showModal)}>
            <div className="flex flex-col space-y-4">
              <p className="text-center text-black/50 font-bold">
                OTP Verification
              </p>
                {otpError && (
                  <div className="bg-red-100 border border-red-600 p-2 rounded-lg mb-2">
                      <p className="text-red-600 text-center text-sm">{otpError}</p>
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
                  className="text-center text-black/50 font-bold hover:text-red-500"
                  disabled={resendDisabled}
                >
                  {resendDisabled ? "Please wait..." : "Resend OTP"}
                </button>
              )}
            </div>
          </Modal>

          {/* Reset modal */}
          <Modal isOpen={showReset} onClose={() => setShowReset(!showReset)}>
            <div className="flex flex-col space-y-4">
              <p className="text-center text-black/50 font-bold">
                Reset password
              </p>
                {passwordError && (
                  <div className="bg-red-100 border border-red-600 p-2 rounded-lg mb-2">
                      <p className="text-red-600 text-center text-sm">{passwordError}</p>
                  </div>
                )}
              <Input
                icon={passwordIcon}
                placeholder="New password"
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                value={password}
              />
              <Input
                icon={passwordIcon}
                placeholder="Confirm password"
                onChange={(e) => setCPassword(e.target.value)}
                type="password"
                value={CPassword}
              />
              <AuthButton
                action={handleResetPassword}
                text={"Reset password"}
              />
            </div>
          </Modal>

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
