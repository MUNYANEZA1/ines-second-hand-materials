// src/components/FilterSidebar.jsx
import { useState, useEffect } from "react";

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

const FilterSidebar = ({
  initialFilters = {},
  onApplyFilters,
  onResetFilters,
}) => {
  const [filters, setFilters] = useState({
    categories: initialFilters.categories || [],
    conditions: initialFilters.conditions || [],
    priceMin: initialFilters.priceMin || "",
    priceMax: initialFilters.priceMax || "",
  });

  useEffect(() => {
    setFilters({
      categories: initialFilters.categories || [],
      conditions: initialFilters.conditions || [],
      priceMin: initialFilters.priceMin || "",
      priceMax: initialFilters.priceMax || "",
    });
  }, [initialFilters]);

  const handleCategoryChange = (category) => {
    setFilters((prev) => {
      const updatedCategories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];

      return {
        ...prev,
        categories: updatedCategories,
      };
    });
  };

  const handleConditionChange = (condition) => {
    setFilters((prev) => {
      const updatedConditions = prev.conditions.includes(condition)
        ? prev.conditions.filter((c) => c !== condition)
        : [...prev.conditions, condition];

      return {
        ...prev,
        conditions: updatedConditions,
      };
    });
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    setFilters({
      categories: [],
      conditions: [],
      priceMin: "",
      priceMax: "",
    });
    onResetFilters();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-bold text-lg mb-4">Filters</h3>

      <div className="mb-6">
        <h4 className="font-semibold mb-2">Categories</h4>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <div key={category} className="flex items-center">
              <input
                type="checkbox"
                id={`category-${category}`}
                checked={filters.categories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="mr-2"
              />
              <label htmlFor={`category-${category}`} className="text-sm">
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold mb-2">Condition</h4>
        <div className="space-y-2">
          {CONDITIONS.map((condition) => (
            <div key={condition} className="flex items-center">
              <input
                type="checkbox"
                id={`condition-${condition}`}
                checked={filters.conditions.includes(condition)}
                onChange={() => handleConditionChange(condition)}
                className="mr-2"
              />
              <label htmlFor={`condition-${condition}`} className="text-sm">
                {condition}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold mb-2">Price Range</h4>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            name="priceMin"
            placeholder="Min"
            value={filters.priceMin}
            onChange={handlePriceChange}
            className="w-full p-2 border rounded text-sm"
            min="0"
          />
          <span>-</span>
          <input
            type="number"
            name="priceMax"
            placeholder="Max"
            value={filters.priceMax}
            onChange={handlePriceChange}
            className="w-full p-2 border rounded text-sm"
            min="0"
          />
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <button
          onClick={handleApply}
          className="w-full bg-blue-800 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Apply Filters
        </button>
        <button
          onClick={handleReset}
          className="w-full border border-gray-300 hover:bg-gray-100 py-2 px-4 rounded"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
