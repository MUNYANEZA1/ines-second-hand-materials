import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddItemPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    photo: null,
  });

  const [error, setError] = useState("");

  const categories = [
    "Electronics",
    "Furniture",
    "Books",
    "Clothing",
    "Accessories",
    "Sports",
    "Others",
  ];

  const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      photo: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.category ||
      !formData.condition
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (isNaN(formData.price) || Number(formData.price) < 0) {
      setError("Price must be a positive number.");
      return;
    }

    try {
      const itemData = new FormData();
      itemData.append("title", formData.title);
      itemData.append("description", formData.description);
      itemData.append("price", formData.price);
      itemData.append("category", formData.category);
      itemData.append("condition", formData.condition);
      if (formData.photo) {
        itemData.append("photo", formData.photo);
      }

      await axios.post("/api/items", itemData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/"); // Redirect to home or item list after success
    } catch (err) {
      console.error(err);
      setError("Failed to add item. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Add New Item</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            rows="4"
            required
          ></textarea>
        </div>

        <div>
          <label className="block font-medium mb-1">Price (RWF)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Condition</label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">-- Select Condition --</option>
            {conditions.map((cond, idx) => (
              <option key={idx} value={cond}>
                {cond}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Photo (optional)</label>
          <input
            type="file"
            name="photo"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Add Item
        </button>
      </form>
    </div>
  );
};

export default AddItemPage;
