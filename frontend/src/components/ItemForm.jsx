// src/components/ItemForm.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "Books & Textbooks",
  "Electronics",
  "Furniture",
  "Clothing",
  "Sports Equipment",
  "Kitchen & Appliances",
  "Other",
];

const CONDITIONS = ["New", "Like New", "Good", "Fair", "Poor"];

const ItemForm = ({ item, onSubmit, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    photo: null,
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Initialize form if editing an existing item
  useEffect(() => {
    if (isEditing && item) {
      setFormData({
        title: item.title || "",
        description: item.description || "",
        price: item.price || "",
        category: item.category || "",
        condition: item.condition || "",
        photo: null,
      });
      if (item.photo) {
        setPreviewUrl(item.photo);
      }
    }
  }, [isEditing, item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file,
      }));

      // Create preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return false;
    }
    if (
      !formData.price ||
      isNaN(formData.price) ||
      parseFloat(formData.price) <= 0
    ) {
      setError("Please enter a valid price");
      return false;
    }
    if (!formData.category) {
      setError("Please select a category");
      return false;
    }
    if (!formData.condition) {
      setError("Please select a condition");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Format price to ensure it's a number
      const submissionData = {
        ...formData,
        price: parseFloat(formData.price),
      };

      await onSubmit(submissionData);
      navigate("/my-items");
    } catch (err) {
      console.error("Error submitting item:", err);
      setError(err.message || "Failed to save item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
        {isEditing ? "Edit Item" : "List a New Item"}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title"
          >
            Title*
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Description*
          </label>
          <textarea
            id="description"
            name="description"
            rows="5"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="price"
          >
            Price ($)*
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="category"
            >
              Category*
            </label>
            <select
              id="category"
              name="category"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="condition"
            >
              Condition*
            </label>
            <select
              id="condition"
              name="condition"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
              value={formData.condition}
              onChange={handleChange}
              required
            >
              <option value="">Select condition</option>
              {CONDITIONS.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="photo"
          >
            Photo
          </label>
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/*"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
            onChange={handleFileChange}
          />
          <p className="text-xs text-gray-500 mt-1">Max file size: 5MB</p>

          {previewUrl && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">Preview:</p>
              <img
                src={previewUrl}
                alt="Item preview"
                className="h-48 object-contain border rounded"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring"
            disabled={loading}
          >
            {loading ? "Saving..." : isEditing ? "Update Item" : "List Item"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemForm;
