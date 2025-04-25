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

  // Filters
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

  // Pagination
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(9); // Fixed number of items per page

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Conditions options
  const conditionOptions = ["New", "Like New", "Good", "Fair", "Poor"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Prepare the parameters for the API request
        const params = {
          page: currentPage,
          limit: itemsPerPage,
        };

        // Add filter parameters if they exist
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory) params.category = selectedCategory;
        if (priceRange.min) params.minPrice = priceRange.min;
        if (priceRange.max) params.maxPrice = priceRange.max;
        if (condition) params.condition = condition;

        // Fetch items from the API with the applied filters
        const itemsResponse = await axios.get(`${apiUrl}/items`, { params });

        // Fetch categories for the filter dropdown
        const categoriesResponse = await axios.get(`${apiUrl}/categories`);

        // Update state with the response data
        setItems(itemsResponse.data.items);
        setTotalPages(itemsResponse.data.totalPages);
        setCategories(categoriesResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    apiUrl,
    currentPage,
    // Dependencies to reload data when filters change and are applied
    searchParams.toString(),
  ]);

  // Apply filters
  const applyFilters = () => {
    // Reset to first page when applying new filters
    setCurrentPage(1);

    // Set URL search params
    const params = new URLSearchParams();

    if (searchTerm) params.set("search", searchTerm);
    if (selectedCategory) params.set("category", selectedCategory);
    if (priceRange.min) params.set("minPrice", priceRange.min);
    if (priceRange.max) params.set("maxPrice", priceRange.max);
    if (condition) params.set("condition", condition);
    params.set("page", "1"); // Reset to page 1 when applying filters

    setSearchParams(params);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
    setCondition("");
    setCurrentPage(1);
    setSearchParams({ page: "1" });
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);

      // Update page in search params while preserving other params
      const params = new URLSearchParams(searchParams);
      params.set("page", newPage.toString());
      setSearchParams(params);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Browse Items</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Search
              </label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Category
              </label>
              <select
                className="w-full border rounded-md px-3 py-2"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Price Range (RWF)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  className="w-1/2 border rounded-md px-3 py-2"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                  }
                />
                <input
                  type="number"
                  className="w-1/2 border rounded-md px-3 py-2"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Condition
              </label>
              <select
                className="w-full border rounded-md px-3 py-2"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <option value="">Any Condition</option>
                {conditionOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-2">
              <button
                className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
                onClick={applyFilters}
              >
                Apply Filters
              </button>
              <button
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
                onClick={resetFilters}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      &laquo; Prev
                    </button>

                    {/* Page numbers */}
                    {[...Array(totalPages).keys()].map((number) => {
                      const pageNumber = number + 1;

                      // Only show a limited number of page buttons
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 &&
                          pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`relative inline-flex items-center px-4 py-2 border ${
                              currentPage === pageNumber
                                ? "bg-blue-800 text-white border-blue-800"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                            } text-sm font-medium`}
                          >
                            {pageNumber}
                          </button>
                        );
                      }

                      // Show ellipsis for gaps in page numbers
                      if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <span
                            key={`ellipsis-${pageNumber}`}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                          >
                            ...
                          </span>
                        );
                      }

                      return null;
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      Next &raquo;
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-md">
              No items found matching your criteria. Try adjusting your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemsPage;
