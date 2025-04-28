// src/pages/ProfilePage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProfileView from "../components/profile/ProfileView";
import ProfileEdit from "../components/profile/ProfileEdit";
import UserItems from "../components/profile/UserItems";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import { userService } from "../services/userService";
import { itemService } from "../services/itemService";
import { useAuth } from "../hooks/useAuth";
import { useNotification } from "../hooks/useNotification";

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUserInfo } = useAuth();
  const { showNotification } = useNotification();

  const [profileData, setProfileData] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determine if viewing own profile or another user's
  const isOwnProfile = !id || (user && user.id.toString() === id);
  const profileId = isOwnProfile ? user?.id : id;

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!profileId) return;

      try {
        setLoading(true);

        // Fetch user profile
        const userData = await userService.getUserById(profileId);
        setProfileData(userData);

        // Fetch user's items
        const items = await itemService.getUserItems(profileId);
        setUserItems(items);
      } catch (err) {
        setError("Failed to load profile data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [profileId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (updatedData, profileImage) => {
    try {
      const formData = new FormData();

      // Add profile data
      Object.keys(updatedData).forEach((key) => {
        formData.append(key, updatedData[key]);
      });

      // Add profile image if provided
      if (profileImage) {
        formData.append("profilePhoto", profileImage);
      }

      const updatedUser = await userService.updateUser(user.id, formData);

      // Update context with new user info
      updateUserInfo(updatedUser);

      // Update local state
      setProfileData(updatedUser);
      setIsEditing(false);

      showNotification("Profile updated successfully!", "success");
    } catch (error) {
      showNotification(
        error.message || "Failed to update profile. Please try again.",
        "error"
      );
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!profileData) return <ErrorMessage message="Profile not found" />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        {isEditing ? (
          <ProfileEdit
            profile={profileData}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <ProfileView
            profile={profileData}
            isOwnProfile={isOwnProfile}
            onEdit={handleEdit}
          />
        )}
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">
          {isOwnProfile ? "My Items" : `${profileData.firstName}'s Items`}
        </h2>
        <UserItems items={userItems} isOwnProfile={isOwnProfile} />
      </motion.div>
    </motion.div>
  );
};

export default ProfilePage;
