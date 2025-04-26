// src/pages/SearchResultsPage.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import ItemListing from "../components/ItemListing";
import axios from "axios";

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("q") || "";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    categories: [],
    conditions: [],
    priceMin: "",
    priceMax: "",
  });

  // Parse initial filters from URL if they exist
  useEffect(() => {
    const categoriesParam = queryParams.get("categories");
    const conditionsParam = queryParams.get("conditions");
    const priceMinParam = queryParams.get("priceMin");
    const priceMaxParam = queryParams.get("priceMax");

    setFilters({
      categories: categoriesParam ? categoriesParam.split(",") : [],
      conditions: conditionsParam ? conditionsParam.split(",") : [],
      priceMin: priceMinParam || "",
      priceMax: priceMaxParam || "",
    });
  }, [location.search]);

  // Fetch search results with applied filters
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError("");

        // Create search params
        let params = {};
        if (initialQuery) {
          params.q = initialQuery;
        }
        if (filters.categories.length > 0) {
          params.categories = filters.categories.join(",");
        }
        if (filters.conditions.length > 0) {
          params.conditions = filters.conditions.join(",");
        }
        if (filters.priceMin) {
          params.priceMin = filters.priceMin;
        }
        if (filters.priceMax) {
          params.priceMax = filters.priceMax;
        }

        // Make API call
        const response = await axios.get("/api/items/search", { params });
        setItems(response.data);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("Failed to load search results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [initialQuery, filters]);

  const handleApplyFilters = (newFilters) => {
    const updatedParams = new URLSearchParams(location.search);

    // Update URL with filter parameters
    if (newFilters.categories.length > 0) {
      updatedParams.set("categories", newFilters.categories.join(","));
    } else {
      updatedParams.delete("categories");
    }

    if (newFilters.conditions.length > 0) {
      updatedParams.set("conditions", newFilters.conditions.join(","));
    } else {
      updatedParams.delete("conditions");
    }

    if (newFilters.priceMin) {
      updatedParams.set("priceMin", newFilters.priceMin);
    } else {
      updatedParams.delete("priceMin");
    }

    if (newFilters.priceMax) {
      updatedParams.set("priceMax", newFilters.priceMax);
    } else {
      updatedParams.delete("priceMax");
    }

    // Navigate with updated parameters
    navigate(`/search?${updatedParams.toString()}`);
  };

  const handleResetFilters = () => {
    const updatedParams = new URLSearchParams();
    if (initialQuery) {
      updatedParams.set("q", initialQuery);
    }
    navigate(`/search?${updatedParams.toString()}`);
  };

  const sortItems = (sortBy) => {
    let sortedItems = [...items];
    switch (sortBy) {
      case "price-asc":
        sortedItems.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sortedItems.sort((a, b) => b.price - a.price);
        break;
      case "date-desc":
        sortedItems.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "date-asc":
        sortedItems.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      default:
        break;
    }
    setItems(sortedItems);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <SearchBar initialQuery={initialQuery} />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <FilterSidebar
            initialFilters={filters}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Search results */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {initialQuery ? `Results for "${initialQuery}"` : "All Items"}
            </h2>

            <select
              onChange={(e) => sortItems(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : items.length === 0 ? (
            <div className="bg-gray-100 p-6 rounded text-center">
              <p className="text-lg text-gray-600">
                No items found matching your criteria.
              </p>
              <p className="mt-2">
                Try adjusting your search terms or filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <ItemListing key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
