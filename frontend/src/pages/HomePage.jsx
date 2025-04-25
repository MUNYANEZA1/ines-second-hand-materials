// src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch data from the real backend API endpoints
        const [featuredResponse, categoriesResponse, recentResponse] =
          await Promise.all([
            axios.get(`${apiUrl}/items/featured`),
            axios.get(`${apiUrl}/categories`),
            axios.get(`${apiUrl}/items/recent`, { params: { limit: 4 } }),
          ]);

        setFeaturedItems(featuredResponse.data);
        setCategories(categoriesResponse.data);
        setRecentItems(recentResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-800 text-white py-16 rounded-lg mb-10">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            INES-Ruhengeri Second-Hand Materials
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Buy, sell, and exchange second-hand items within our academic
            community
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/items"
              className="bg-white text-blue-800 font-bold py-3 px-6 rounded-lg hover:bg-blue-100 transition"
            >
              Browse Items
            </Link>
            <Link
              to="/add-item"
              className="bg-transparent border-2 border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:text-blue-800 transition"
            >
              Sell an Item
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Featured Items */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Items</h2>
            <Link to="/items" className="text-blue-800 hover:underline">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : featuredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredItems.map((item) => (
                <Link
                  to={`/items/${item.id}`}
                  key={item.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <img
                    src={
                      item.images && item.images.length > 0
                        ? item.images[0]
                        : "/api/placeholder/300/200"
                    }
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 truncate">
                      {item.title}
                    </h3>
                    <p className="text-green-700 font-bold">
                      {item.price.toLocaleString()} RWF
                    </p>
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                      <span>{item.condition}</span>
                      <span>{item.category}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p>No featured items available at the moment.</p>
            </div>
          )}
        </section>

        {/* Recent Items Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recently Added</h2>
            <Link
              to="/items?sort=newest"
              className="text-blue-800 hover:underline"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : recentItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recentItems.map((item) => (
                <Link
                  to={`/items/${item.id}`}
                  key={item.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <img
                    src={
                      item.images && item.images.length > 0
                        ? item.images[0]
                        : "/api/placeholder/300/200"
                    }
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 truncate">
                      {item.title}
                    </h3>
                    <p className="text-green-700 font-bold">
                      {item.price.toLocaleString()} RWF
                    </p>
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                      <span>{item.condition}</span>
                      <span>{item.category}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Posted {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p>No recent items available at the moment.</p>
            </div>
          )}
        </section>

        {/* Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link
                  to={`/items?category=${category.name}`}
                  key={category.id}
                  className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition"
                >
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {category.count} {category.count === 1 ? "item" : "items"}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p>No categories available at the moment.</p>
            </div>
          )}
        </section>

        {/* How It Works */}
        <section className="mb-12 bg-gray-100 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-800 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Create an Account</h3>
              <p className="text-gray-600">
                Sign up with your INES-Ruhengeri email to access the platform.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-800 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Browse or List Items
              </h3>
              <p className="text-gray-600">
                Search for items you need or list items you want to sell.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-800 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Connect and Exchange
              </h3>
              <p className="text-gray-600">
                Use our messaging system to arrange meetups and complete
                exchanges on campus.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
