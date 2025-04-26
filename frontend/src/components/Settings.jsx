// src/pages/admin/Settings.jsx
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Settings = () => {
  const { currentUser, logout } = useAuth();

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    // TODO: Send API request to update admin profile
    console.log("Updating profile with data:", profileData);
    alert("Profile updated successfully (simulation)");
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }

    // TODO: Send API request to update admin password
    console.log("Updating password with data:", passwordData);
    alert("Password updated successfully (simulation)");
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Settings</h1>

      {/* Profile Update Form */}
      <form onSubmit={handleProfileUpdate} className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleProfileChange}
            className="w-full border p-2 rounded mt-1"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleProfileChange}
            className="w-full border p-2 rounded mt-1"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>

      {/* Password Update Form */}
      <form onSubmit={handlePasswordUpdate}>
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        <div className="mb-4">
          <label className="block text-gray-700">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            className="w-full border p-2 rounded mt-1"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            className="w-full border p-2 rounded mt-1"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">Confirm New Password</label>
          <input
            type="password"
            name="confirmNewPassword"
            value={passwordData.confirmNewPassword}
            onChange={handlePasswordChange}
            className="w-full border p-2 rounded mt-1"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700"
        >
          Update Password
        </button>
      </form>

      {/* Optionally: Logout button */}
      <div className="mt-10 text-center">
        <button
          onClick={logout}
          className="bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;
