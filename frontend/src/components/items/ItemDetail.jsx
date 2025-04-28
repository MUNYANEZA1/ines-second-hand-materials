// src/components/items/ItemDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  fetchItemById,
  deleteItem,
  markItemAsSold,
} from "../../services/itemService";
import { useAuth } from "../../hooks/useAuth";
import { useNotification } from "../../hooks/useNotification";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";
import ContactSellerModal from "../modals/ContactSellerModal";

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [soldLoading, setSoldLoading] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const { currentUser } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const loadItem = async () => {
      setLoading(true);
      try {
        const data = await fetchItemById(id);
        setItem(data);
      } catch (err) {
        setError("Failed to load item details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id]);

  const isOwner = currentUser && item && currentUser.id === item.user_id;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    setDeleteLoading(true);
    try {
      await deleteItem(id);
      addNotification("Item deleted successfully!", "success");
      navigate("/");
    } catch (err) {
      addNotification(err.message, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleMarkAsSold = async () => {
    setSoldLoading(true);
    try {
      await markItemAsSold(id);
      setItem({ ...item, status: "sold" });
      addNotification("Item marked as sold successfully!", "success");
    } catch (err) {
      addNotification(err.message, "error");
    } finally {
      setSoldLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !item) {
    return <ErrorMessage message={error || "Item not found"} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="md:flex">
        <div className="md:flex-shrink-0 md:w-1/2">
          <img
            src={item.photo || "/placeholder-image.jpg"}
            alt={item.title}
            className="h-96 w-full object-cover object-center"
          />
        </div>
        <div className="p-8 md:w-1/2">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900">{item.title}</h2>
            {item.status === "sold" && (
              <span className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-bold">
                SOLD
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center">
            <span className="text-3xl font-bold text-blue-600">
              ${item.price}
            </span>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">Details</h3>
            <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Category</p>
                <p className="font-medium">{item.category}</p>
              </div>
              <div>
                <p className="text-gray-500">Condition</p>
                <p className="font-medium">{item.condition}</p>
              </div>
              <div>
                <p className="text-gray-500">Listed On</p>
                <p className="font-medium">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Seller</p>
                <p className="font-medium">{item.user_name || "Anonymous"}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">Description</h3>
            <p className="mt-2 text-gray-600 whitespace-pre-line">
              {item.description}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {!isOwner && item.status !== "sold" && (
              <button
                onClick={() => setShowContactModal(true)}
                className="flex-1 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Contact Seller
              </button>
            )}

            {isOwner && (
              <>
                {item.status !== "sold" && (
                  <>
                    <Link
                      to={`/items/${id}/edit`}
                      className="flex-1 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none text-center"
                    >
                      Edit Item
                    </Link>
                    <button
                      onClick={handleMarkAsSold}
                      disabled={soldLoading}
                      className="flex-1 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                    >
                      {soldLoading ? "Marking..." : "Mark as Sold"}
                    </button>
                  </>
                )}
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                >
                  {deleteLoading ? "Deleting..." : "Delete Item"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {showContactModal && (
        <ContactSellerModal
          item={item}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </div>
  );
};

export default ItemDetail;
