// src/pages/RegisterPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: "user", // default role
    profilePhoto: null, // file
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePhoto") {
      setFormData((prev) => ({
        ...prev,
        profilePhoto: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill all required fields");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setError("");
      setLoading(true);

      const formPayload = new FormData();
      for (const key in formData) {
        if (key !== "confirmPassword" && formData[key] !== null) {
          formPayload.append(key, formData[key]);
        }
      }

      const result = await register(formPayload); // Make sure your register function supports FormData

      if (result.success) {
        navigate("/login", {
          state: { message: "Registration successful! Please log in." },
        });
      } else {
        setError(result.message || "Failed to register");
      }
    } catch (err) {
      setError("Failed to register");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
        Create an Account
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* First Name */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="firstName"
            >
              First Name*
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="lastName"
            >
              Last Name*
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email*
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="shadow appearance-none border rounded w-full py-2 px-3"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="phoneNumber"
          >
            Phone Number
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            className="shadow appearance-none border rounded w-full py-2 px-3"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        {/* Role (Optional - hidden or selectable) */}
        <input type="hidden" name="role" value="user" />

        {/* Profile Photo */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="profilePhoto"
          >
            Profile Photo
          </label>
          <input
            id="profilePhoto"
            name="profilePhoto"
            type="file"
            accept="image/*"
            className="w-full"
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password*
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="shadow appearance-none border rounded w-full py-2 px-3"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Must be at least 6 characters
          </p>
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="confirmPassword"
          >
            Confirm Password*
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="shadow appearance-none border rounded w-full py-2 px-3"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            disabled={loading}
          >
            {loading ? "Please wait..." : "Register"}
          </button>
        </div>
      </form>

      {/* Login Redirect */}
      <div className="text-center mt-6">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-800 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
