import React, { useState, useRef, useEffect } from "react";
import logo from "@assets/icons/Logo.png";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import { errorToast, successToast } from "@/utils/notificationAudio";
import { onboardingMechanicApi } from "@/features/management/mechanic/services/mechanicServices";
import { useNavigate } from "react-router-dom";
import {
  mobileRegex,
  onlyString,
  passwordRegex,
} from "@/constants/commonRegex";
import { login } from "@/redux/slice/userSlice";
import type { User } from "@/types/UserTypes";

const MechanicOnboarding = () => {
  const [oneTimePassword, setOneTimePassword] = useState<string>("");
  const [oneTimePassError, setOneTimePassError] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordError, setNewPasswordError] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillsError, setSkillsError] = useState<string>("");
  const [newSkill, setNewSkill] = useState<string>("");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewError, setPreviewError] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [mobileError, setMobileError] = useState<string>("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user?.isOnboardingRequired) {
      navigate("/mechanic");
    }
  }, [user, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 500 * 1024) {
      errorToast("File size must be less than 500KB");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(selectedFile);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const addSkill = () => {
    setSkillsError("");
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      if (typeof newSkill !== "string" || !onlyString.test(newSkill.trim())) {
        setSkillsError("Skill must be valid.");
        return;
      }
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addSkill();
    }
  };

  const handleSubmit = async () => {
    let hasError = false;
    setOneTimePassError("");
    setNewPasswordError("");
    setSkillsError("");
    setPreviewError("");
    setMobileError("");

    if (!passwordRegex.test(oneTimePassword)) {
      setOneTimePassError(
        "Password must be 8+ chars with uppercase, lowercase, number, and special character."
      );
      hasError = true;
    }

    if (!passwordRegex.test(newPassword)) {
      setNewPasswordError(
        "Password must be 8+ chars with uppercase, lowercase, number, and special character."
      );
      hasError = true;
    }

    if (!mobileRegex.test(mobile)) {
      setMobileError("Enter a valid mobile number.");
      hasError = true;
    }

    if (!preview) {
      setPreviewError("Upload image");
      hasError = true;
    }

    if (skills.length < 1) {
      setSkillsError("Add some skills");
      hasError = true;
    }

    if (!hasError) {
      const formData = new FormData();

      formData.append("name", user?.name || "");
      formData.append("userId", user?._id || "");
      formData.append("mobile", mobile);
      formData.append("newPassword", newPassword);
      formData.append("password", oneTimePassword);
      skills.forEach((skill) => formData.append("skills", skill));

      if (file instanceof File) {
        formData.append("profile", file);
      }

      try {
        const response = await onboardingMechanicApi(formData);
        dispatch(
          login({
            user: {
              ...user,
              imageUrl: response.mechanic.imageUrl,
              isOnboardingRequired: false,
            } as User,
            token,
          })
        );
        successToast("Registration success");
        setTimeout(() => {
          navigate("/mechanic");
        }, 2000);
      } catch (error) {
        if (error instanceof Error) errorToast(error.message);
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center mb-6 sm:mb-8 w-50 sm:w-50 md:w-58">
          <img src={logo} alt="" />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center sm:text-right mb-8 sm:mb-12">
          One-Time Registration
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Left Column - Profile Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Profile Image */}
            <div
              onClick={handleImageClick}
              className="relative w-32 h-32 sm:w-40 sm:h-40 cursor-pointer group"
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <div className="w-full h-full rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 border border-gray-700 text-sm">
                  Click to upload
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
              {previewError ? (
                <p className="text-red-600 font-light text-sm ">
                  {previewError}
                </p>
              ) : (
                ""
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Name:</label>
              <div className="bg-gray-100 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base break-all">
                {user?.name || "Not Provided"}
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium mb-2">Skills:</label>

              {/* Skills Display */}
              <div className="bg-gray-100 rounded-lg px-3 sm:px-4 py-3 mb-2 min-h-[60px]">
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-white px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-gray-300"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => removeSkill(skill)}
                        className="text-red-600 hover:text-red-800 font-bold text-lg leading-none"
                        aria-label="Remove skill"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {skills.length === 0 && (
                    <span className="text-gray-400 text-sm">
                      No skills added yet
                    </span>
                  )}
                </div>
              </div>

              {/* Add Skill Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  maxLength={30}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a new skill"
                  className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <button
                  onClick={addSkill}
                  className="bg-red-600 text-white w-10 h-10 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center text-2xl font-bold"
                  aria-label="Add skill"
                >
                  +
                </button>
              </div>
              {skillsError ? (
                <p className="text-red-600 font-light text-sm ">
                  {skillsError}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>

          {/* Right Column - Info and Password Change */}
          <div className="space-y-4 sm:space-y-6">
            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Mobile Number:
              </label>
              <input
                type="text"
                className="bg-gray-100 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base 
             focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-0 w-130"
                onChange={(e) => setMobile(e.target.value)}
                maxLength={15}
              />
              {mobileError ? (
                <p className="text-red-600 font-light text-sm ">
                  {mobileError}
                </p>
              ) : (
                ""
              )}
            </div>

            {/* Email ID */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email ID:
              </label>
              <div className="bg-gray-100 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base break-all">
                {user?.email || "Not Provided"}
              </div>
            </div>

            {/* Password Change Section */}
            <div className="bg-gray-200 rounded-xl p-4 sm:p-6 mt-6 sm:mt-8">
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                Change Temporary Password
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Temporary Password
                  </label>
                  <input
                    type="password"
                    value={oneTimePassword}
                    onChange={(e) => setOneTimePassword(e.target.value)}
                    placeholder="Enter One-Time password (Provided by company)"
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  {oneTimePassError ? (
                    <p className="text-red-600 font-light text-sm ">
                      {oneTimePassError}
                    </p>
                  ) : (
                    ""
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter New password"
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  {newPasswordError ? (
                    <p className="text-red-600 font-light text-sm ">
                      {newPasswordError}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Registration Button */}
        <div className="mt-8 sm:mt-12 flex justify-center sm:justify-end">
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto bg-gray-900 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm sm:text-base"
          >
            COMPLETE REGISTRATION
          </button>
        </div>
      </div>
    </div>
  );
};

export default MechanicOnboarding;
