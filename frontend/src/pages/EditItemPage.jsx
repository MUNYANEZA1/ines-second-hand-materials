// src/pages/EditItemPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ItemForm from "../components/items/ItemForm";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import { itemService } from "../services/itemService";
import { useAuth } from "../hooks/useAuth";
import { useNotification } from "../hooks/useNotification";

const EditItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const data = await itemService.getItemById(id);

        // Check if user is the owner
        if (user?.id !== data.user_id) {
          setError("You do not have permission to edit this item");
          navigate("/");
          return;
        }

        setItem(data);
      } catch (err) {
        setError("Failed to fetch item details. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchItem();
    } else {
      navigate("/login");
    }
  }, [id, user, navigate]);

  const handleSubmit = async (itemData, image) => {
    try {
      setSubmitting(true);
      const formData = new FormData();

      // Add item data to form
      Object.keys(itemData).forEach((key) => {
        formData.append(key, itemData[key]);
      });

      // Add image if exists
      if (image) {
        formData.append("photo", image);
      }

      await itemService.updateItem(id, formData);
      showNotification("Item updated successfully!", "success");
      navigate(`/item/${id}`);
    } catch (error) {
      showNotification(
        error.message || "Failed to update item. Please try again.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!item) return <ErrorMessage message="Item not found" />;

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
        Edit Item
      </motion.h1>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white shadow rounded-lg p-6">
          <ItemForm
            initialData={item}
            onSubmit={handleSubmit}
            loading={submitting}
            isEditing={true}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditItemPage;
