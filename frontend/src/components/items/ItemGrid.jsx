// src/components/items/ItemGrid.jsx
import { useState, useEffect } from "react";
import { fetchItems } from "../../services/itemService";
import ItemCard from "./ItemCard";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";

const ItemGrid = ({ filters }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await fetchItems(filters);
      setItems(data);
      setError("");
    } catch (err) {
      setError("Failed to load items");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [filters]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 text-lg">
          No items found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} onUpdate={loadItems} />
      ))}
    </div>
  );
};

export default ItemGrid;
// This component fetches and displays a grid of items based on the provided filters. It handles loading states and errors gracefully, ensuring a smooth user experience. 