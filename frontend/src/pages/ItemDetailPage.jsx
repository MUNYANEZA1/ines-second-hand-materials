// src/pages/ItemDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const ItemDetailPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);

        // Connect to the real backend API to fetch item data
        const response = await axios.get(`${apiUrl}/items/${id}`);
        setItem(response.data);
      } catch (err) {
        console.error("Error fetching item:", err);
        setError("Failed to load item details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, apiUrl]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/items/${id}` } } });
      return;
    }

    if (!messageText.trim()) {
      return;
    }

    try {
      // Send message to the backend API
      await axios.post(
        `${apiUrl}/messages`,
        {
          recipientId: item.seller.id,
          itemId: item.id,
          message: messageText,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessageText("");
      setMessageSent(true);

      setTimeout(() => {
        setMessageSent(false);
      }, 3000);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again later.");
    }
  };

  const handleDeleteItem = async () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`${apiUrl}/items/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        navigate("/profile", {
          state: { message: "Item deleted successfully" },
        });
      } catch (err) {
        console.error("Error deleting item:", err);
        setError("Failed to delete item. Please try again later.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error || "Item not found"}
      </div>
    );
  }

  const isOwner = currentUser?.id === item.seller.id;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Breadcrumb */}
      <div className="bg-gray-100 px-6 py-3">
        <nav className="text-sm">
          <Link to="/" className="text-blue-800 hover:underline">
            Home
          </Link>
          <span className="mx-2">›</span>
          <Link to="/items" className="text-blue-800 hover:underline">
            Items
          </Link>
          <span className="mx-2">›</span>
          <span className="text-gray-600">{item.title}</span>
        </nav>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            {item.images && item.images.length > 0 ? (
              <>
                <div className="mb-4">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-auto rounded-lg"
                  />
                </div>

                {item.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {item.images.slice(1).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${item.title} ${index + 2}`}
                        className="w-full h-20 object-cover rounded-md cursor-pointer"
                        onClick={() => {
                          // In a real implementation, this would switch the main image
                          const newImages = [...item.images];
                          const temp = newImages[0];
                          newImages[0] = newImages[index + 1];
                          newImages[index + 1] = temp;
                          setItem({ ...item, images: newImages });
                        }}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-200 w-full h-64 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
          </div>

          {/* Item Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
            <p className="text-2xl text-green-700 font-bold mb-4">
              {item.price.toLocaleString()} RWF
            </p>

            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Condition</p>
                  <p className="font-medium">{item.condition}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Category</p>
                  <p className="font-medium">{item.category}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Location</p>
                  <p className="font-medium">{item.location}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Posted On</p>
                  <p className="font-medium">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{item.description}</p>
            </div>

            {/* Seller Information */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h2 className="text-lg font-semibold mb-2">Seller Information</h2>
              <div className="flex items-center">
                <img
                  src={item.seller.profileImage || "/api/placeholder/50/50"}
                  alt={`${item.seller.firstName} ${item.seller.lastName}`}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">
                    {item.seller.firstName} {item.seller.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {item.seller.department}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form or Owner Actions */}
            <div>
              {isOwner ? (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">
                    Manage Your Listing
                  </h2>
                  <p className="mb-4">
                    This is your listing. You can edit or delete it from here.
                  </p>
                  <div className="flex space-x-4">
                    <Link
                      to={`/items/${id}/edit`}
                      className="inline-block bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Edit Listing
                    </Link>
                    <button
                      onClick={handleDeleteItem}
                      className="inline-block bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    >
                      Delete Listing
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-2">Contact Seller</h2>

                  {messageSent && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                      Message sent successfully! The seller will get back to you
                      soon.
                    </div>
                  )}

                  <form onSubmit={handleSendMessage}>
                    <textarea
                      className="w-full border rounded-md px-3 py-2 mb-2"
                      rows="4"
                      placeholder="Write your message to the seller..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      required
                    ></textarea>
                    <button
                      type="submit"
                      className="bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                      disabled={!isAuthenticated}
                    >
                      Send Message
                    </button>
                    {!isAuthenticated && (
                      <p className="text-sm text-gray-600 mt-2">
                        You need to{" "}
                        <Link
                          to="/login"
                          className="text-blue-800 hover:underline"
                        >
                          log in
                        </Link>{" "}
                        to contact the seller
                      </p>
                    )}
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Related Items section could go here */}
      </div>
    </div>
  );
};

export default ItemDetailPage;
