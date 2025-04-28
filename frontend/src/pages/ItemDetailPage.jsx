// src/pages/ItemDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ItemDetail from "../components/items/ItemDetail";
import ContactSellerModal from "../components/modals/ContactSellerModal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import { itemService } from "../services/itemService";
import { useAuth } from "../hooks/useAuth";
import { useNotification } from "../hooks/useNotification";

const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const data = await itemService.getItemById(id);
        setItem(data);
      } catch (err) {
        setError("Failed to fetch item details. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleContactSeller = () => {
    if (!user) {
      showNotification("Please login to contact the seller", "info");
      navigate("/login");
      return;
    }
    setShowContactModal(true);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await itemService.deleteItem(id);
        showNotification("Item deleted successfully", "success");
        navigate("/profile");
      } catch (err) {
        showNotification("Failed to delete item", "error");
      }
    }
  };

  const handleMarkAsSold = async () => {
    try {
      await itemService.updateItemStatus(id, "sold");
      setItem((prev) => ({ ...prev, status: "sold" }));
      showNotification("Item marked as sold", "success");
    } catch (err) {
      showNotification("Failed to update item status", "error");
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
      <ItemDetail
        item={item}
        isOwner={user && item.user_id === user.id}
        onContactSeller={handleContactSeller}
        onDelete={handleDelete}
        onMarkAsSold={handleMarkAsSold}
      />

      {showContactModal && (
        <ContactSellerModal
          item={item}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </motion.div>
  );
};

export default ItemDetailPage;
