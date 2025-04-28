// src/pages/CreateItemPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ItemForm from "../components/items/ItemForm";
import { itemService } from "../services/itemService";
import { useAuth } from "../hooks/useAuth";
import { useNotification } from "../hooks/useNotification";

const CreateItemPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (itemData, image) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Add item data to form
      Object.keys(itemData).forEach((key) => {
        formData.append(key, itemData[key]);
      });

      // Add image if exists
      if (image) {
        formData.append("photo", image);
      }

      await itemService.createItem(formData);
      showNotification(
        "Item created successfully! It will be visible after approval.",
        "success"
      );
      navigate("/profile");
    } catch (error) {
      showNotification(
        error.message || "Failed to create item. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.h1
        className="text-3xl font-bold mb-6 text-center"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Post a New Item
      </motion.h1>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white shadow rounded-lg p-6">
          <ItemForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateItemPage;
