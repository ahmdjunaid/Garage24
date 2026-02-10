import Spinner from "@/components/common/Spinner";
import { mobileRegex, nameRegex, passwordRegex } from "@/constants/commonRegex";
import React, { useEffect, useRef, useState } from "react";

export interface ProfileDataUpdate {
  name?: string;
  image?: File;
  mobileNumber?: string;
}

interface CommonProfileProps {
  name?: string;
  email?: string;
  role?: string;
  mobileNumber?: string;
  imageUrl?: string;
  loading: boolean;
  onUpdateProfile: (data: ProfileDataUpdate) => void;
  onChangePassword: (data: {
    currentPassword: string;
    newPassword: string;
  }) => void;
}

export const CommonProfile: React.FC<CommonProfileProps> = ({
  name,
  email,
  role,
  mobileNumber,
  imageUrl,
  loading,
  onUpdateProfile,
  onChangePassword,
}) => {
  const [username, setUsername] = useState<string>(name ?? "");
  const [mobile_Number, setMobile_Number] = useState<string>(mobileNumber ?? "");
  const [preview, setPreview] = useState<string | null>(imageUrl || null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string>("");
  const [mobileError, setMobileError] = useState<string>("");

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUsername(name ?? "");
    setMobile_Number(mobileNumber ?? "");
    setPreview(imageUrl ?? null);
    setImageFile(null);
  }, [name, mobileNumber, imageUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const isProfileChanged =
    username !== name ||
    mobile_Number !== mobileNumber ||
    imageFile !== null;

  const handleProfileSave = () => {
    let hasError = false;

    if (!nameRegex.test(username)) {
      setNameError("Name must contain only letters and spaces.");
      hasError = true;
    }

    if (mobile_Number && !mobileRegex.test(mobile_Number)) {
      setMobileError("Please enter a valid mobile number.");
      hasError = true;
    }

    if (hasError) return;

    onUpdateProfile({
      name: username,
      mobileNumber: mobile_Number,
      image: imageFile || undefined,
    });
  };

  const handlePasswordChange = () => {
    let hasError = false;

    if (!passwordRegex.test(currentPassword)) {
      setPasswordError(
        "Password must be 8+ chars with uppercase, lowercase, number, and special character."
      );
      hasError = true;
    }

    if (!passwordRegex.test(newPassword)) {
      setPasswordError(
        "Password must be 8+ chars with uppercase, lowercase, number, and special character."
      );
      hasError = true;
    }

    if (hasError) return;

    onChangePassword({
      currentPassword,
      newPassword,
    });

    setCurrentPassword("");
    setNewPassword("");
    setPasswordError(null);
  };

  return (
    <div className="m-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Account Settings
        </h1>
        <p className="text-gray-400">
          Manage your profile and security preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-gray-800/50 to-black/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white mb-4">
              Profile Picture
            </h2>

            <div className="flex flex-col items-center gap-4">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white/10 shadow-xl">
                {preview ? (
                  <img
                    src={preview}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                    {username?.charAt(0) || "U"}
                  </div>
                )}
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

              <button
                onClick={() => fileRef.current?.click()}
                className="w-full px-4 py-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition border border-blue-500/30"
              >
                Change Image
              </button>

              <p className="text-xs text-gray-500 text-center">
                JPG, PNG Max size 500KB
              </p>
            </div>
          </div>
        </div>

        {/* Profile Info + Password */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <div className="bg-gradient-to-br from-gray-800/50 to-black/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white mb-6">
              Profile Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setNameError("");
                  }}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 transition"
                />
                {nameError && (
                  <p className="text-xs text-red-400 mt-1">{nameError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={mobile_Number}
                  onChange={(e) => {
                    setMobile_Number(e.target.value);
                    setMobileError("");
                  }}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 transition"
                />
                {mobileError && (
                  <p className="text-xs text-red-400 mt-1">{mobileError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Role
                </label>
                <div className="flex items-center h-[42px]">
                  <span className="px-4 py-2 rounded-lg bg-green-700/20 text-green-700 text-sm border border-green-700 font-medium">
                    {role}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleProfileSave}
                disabled={!isProfileChanged || loading}
                className="px-6 py-2.5 rounded-lg bg-red-700 hover:bg-red-700/70 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? <Spinner loading={loading} /> : null}
                Save Changes
              </button>
            </div>
          </div>

          {/* 🔒 Change Password (UNCHANGED) */}
          <div className="bg-gradient-to-br from-gray-800/50 to-black/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white mb-6">
              Security
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      setPasswordError(null);
                    }}
                    className={`w-full bg-black/50 border rounded-lg px-4 py-2.5 text-white pr-12
                    ${passwordError ? "border-red-500" : "border-white/10 focus:border-blue-500"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <i className={`fa-solid ${showCurrent ? "fa-eye-slash" : "fa-eye"}`} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError(null);
                    }}
                    className={`w-full bg-black/50 border rounded-lg px-4 py-2.5 text-white pr-12
                    ${passwordError ? "border-red-500" : "border-white/10 focus:border-blue-500"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <i className={`fa-solid ${showNew ? "fa-eye-slash" : "fa-eye"}`} />
                  </button>
                </div>
              </div>

              {passwordError && (
                <div className="bg-red-600/10 border border-red-600/30 rounded-lg px-4 py-2">
                  <p className="text-sm text-red-400">{passwordError}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handlePasswordChange}
                disabled={loading || !currentPassword || !newPassword}
                className="px-6 py-2.5 rounded-lg bg-red-700 hover:bg-red-700/70 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? <Spinner loading={loading} /> : null}
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
