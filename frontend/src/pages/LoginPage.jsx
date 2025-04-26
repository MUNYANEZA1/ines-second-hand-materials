// src/pages/LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      return setError("Please enter both email and password");
    }

    try {
      setError(""); // Clear previous errors
      setLoading(true); // Set loading state

      // Attempt login using the context's login function
      const result = await login(email, password);

      if (result.success) {
        const userRole = result.user?.role;

        // Redirect based on role
        if (userRole === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else if (userRole === "user") {
          navigate(from, { replace: true });
        } else {
          navigate("/", { replace: true }); // Fallback to homepage if no role
        }
      } else {
        // If login fails, show the error from the API response
        setError(
          result.message || "Failed to login. Please check your credentials."
        );
      }
    } catch (err) {
      console.error("Login error:", err);

      // Handle different types of errors
      if (err.response) {
        // API responded with an error
        setError(
          err.response.data.message || "An error occurred during login."
        );
      } else if (err.request) {
        // Network error or no response from the server
        setError("Network error. Please try again.");
      } else {
        // Generic error
        setError("Failed to login. Please try again.");
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
        Log In
      </h2>

      {/* Display error message if any */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Login form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring w-full"
            disabled={loading}
          >
            {loading ? "Please wait..." : "Log In"}
          </button>
        </div>
      </form>

      <div className="text-center mt-6">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-800 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
