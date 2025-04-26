// src/pages/ItemsPage.jsx
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // State initialization with proper fallbacks
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get("minPrice") || "",
    max: searchParams.get("maxPrice") || "",
  });
  const [condition, setCondition] = useState(
    searchParams.get("condition") || ""
  );
  const [currentPage, setCurrentPage] = useState(
    Math.max(1, parseInt(searchParams.get("page")) || 1)
  );
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(9);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const conditionOptions = ["New", "Like New", "Good", "Fair", "Poor"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page: currentPage,
          limit: itemsPerPage,
          ...(searchTerm && { search: searchTerm }),
          ...(selectedCategory && { category: selectedCategory }),
          ...(priceRange.min && { minPrice: priceRange.min }),
          ...(priceRange.max && { maxPrice: priceRange.max }),
          ...(condition && { condition }),
        };

        const [itemsResponse, categoriesResponse] = await Promise.all([
          axios.get(`${apiUrl}/items`, { params }),
          axios.get(`${apiUrl}/categories`),
        ]);

        // Handle potential missing data structure from API
        setItems(itemsResponse.data?.items || []);
        setTotalPages(itemsResponse.data?.totalPages || 1);
        setCategories(categoriesResponse.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load items. Please try again later.");
        // Reset data on error
        setItems([]);
        setCategories([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, apiUrl, currentPage, itemsPerPage]);

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (searchTerm) params.set("search", searchTerm);
    if (selectedCategory) params.set("category", selectedCategory);
    if (priceRange.min) params.set("minPrice", priceRange.min);
    if (priceRange.max) params.set("maxPrice", priceRange.max);
    if (condition) params.set("condition", condition);
    params.set("page", "1");

    setSearchParams(params);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
    setCondition("");
    setSearchParams({ page: "1" });
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    const validatedPage = Math.max(1, Math.min(newPage, totalPages));
    if (validatedPage !== currentPage) {
      const params = new URLSearchParams(searchParams);
      params.set("page", validatedPage.toString());
      setSearchParams(params);
      setCurrentPage(validatedPage);
    }
  };

  // Safe price formatting
  const formatPrice = (price) => {
    try {
      return typeof price === "number"
        ? price.toLocaleString()
        : parseInt(price || 0).toLocaleString();
    } catch {
      return "0";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Items</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>

          {/* Search */}
          <div>
            <label className="block text-sm font-semibold mb-2">Search</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold mb-2">Category</label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Price Range (RWF)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                className="w-1/2 border rounded-md px-3 py-2"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                }
              />
              <input
                type="number"
                min="0"
                className="w-1/2 border rounded-md px-3 py-2"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Condition
            </label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              <option value="">Any Condition</option>
              {conditionOptions.map((opt, index) => (
                <option key={index} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={applyFilters}
              className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
            >
              Apply Filters
            </button>
            <button
              onClick={resetFilters}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 w-full"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Items Display */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (items?.length || 0) > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <Link
                    to={`/items/${item.id}`}
                    key={item.id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                  >
                    <img
                      src={item.images?.[0] || "/placeholder/300/200"}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder/300/200";
                      }}
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold truncate">
                        {item.title || "Untitled Item"}
                      </h3>
                      <p className="text-green-700 font-bold">
                        {formatPrice(item.price)} RWF
                      </p>
                      <div className="flex justify-between text-gray-600 text-sm mt-2">
                        <span>{item.condition || "N/A"}</span>
                        <span>{item.category || "Uncategorized"}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Posted{" "}
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : "Unknown date"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    &laquo; Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-md ${
                          page === currentPage
                            ? "bg-blue-800 text-white"
                            : "bg-white border border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    Next &raquo;
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500 mt-12">
              No items found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemsPage;
