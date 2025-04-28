import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createItem, updateItem } from "../../services/itemService";
import { useNotification } from "../../hooks/useNotification";
import ErrorMessage from "../common/ErrorMessage";
import LoadingSpinner from "../common/LoadingSpinner";

const categories = [
  "Books",
  "Electronics",
  "Furniture",
  "Clothing",
  "Kitchen",
  "Stationery",
  "Other",
];

const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

const ItemForm = ({ existingItem = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    photo: null,
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { addNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (existingItem) {
      setFormData({
        title: existingItem.title || "",
        description: existingItem.description || "",
        price: existingItem.price || "",
        category: existingItem.category || "",
        condition: existingItem.condition || "",
        photo: null,
      });
      if (existingItem.photo) {
        setPreview(existingItem.photo);
      }
    }
  }, [existingItem]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo" && files && files[0]) {
      setFormData({ ...formData, photo: files[0] });

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.category ||
      !formData.condition
    ) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }
    if (!existingItem && !formData.photo) {
      setError("Please upload a photo");
      setLoading(false);
      return;
    }

    try {
      if (existingItem) {
        await updateItem(existingItem.id, formData);
        addNotification("Item updated successfully!", "success");
      } else {
        await createItem(formData);
        addNotification(
          "Item created successfully! It will be visible after admin approval.",
          "success"
        );
      }
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to save item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">
        {existingItem ? "Edit Item" : "Post New Item"}
      </h2>

      <ErrorMessage message={error} />
      {loading && <LoadingSpinner />}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title *
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description *
          </label>
          <textarea
            name="description"
            id="description"
            rows="4"
            required
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Price and Category */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price * ($)
            </label>
            <input
              type="number"
              name="price"
              id="price"
              min="0"
              step="0.01"
              required
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category *
            </label>
            <select
              name="category"
              id="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Condition */}
        <div>
          <label
            htmlFor="condition"
            className="block text-sm font-medium text-gray-700"
          >
            Condition *
          </label>
          <select
            name="condition"
            id="condition"
            required
            value={formData.condition}
            onChange={handleChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Select condition</option>
            {conditions.map((cond) => (
              <option key={cond} value={cond}>
                {cond}
              </option>
            ))}
          </select>
        </div>

        {/* Photo Upload */}
        <div>
          <label
            htmlFor="photo"
            className="block text-sm font-medium text-gray-700"
          >
            Photo {existingItem ? "" : "*"}
          </label>
          <input
            type="file"
            name="photo"
            id="photo"
            accept="image/*"
            onChange={handleChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-semibold file:bg-gray-50 hover:file:bg-gray-100"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-4 h-32 object-contain"
            />
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {existingItem ? "Update Item" : "Post Item"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemForm;
