// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ItemGrid from '../components/items/ItemGrid';
import SearchFilters from '../components/items/SearchFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { itemService } from '../services/itemService';

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    minPrice: '',
    maxPrice: '',
    condition: 'all'
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const data = await itemService.getApprovedItems();
        setItems(data);
        setFilteredItems(data);
      } catch (err) {
        setError('Failed to fetch items. Please try again later.');
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    // Apply filters whenever filters change
    let result = [...items];
    
    if (filters.search) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.category !== 'all') {
      result = result.filter(item => item.category === filters.category);
    }
    
    if (filters.minPrice) {
      result = result.filter(item => item.price >= Number(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      result = result.filter(item => item.price <= Number(filters.maxPrice));
    }
    
    if (filters.condition !== 'all') {
      result = result.filter(item => item.condition === filters.condition);
    }
    
    setFilteredItems(result);
  }, [filters, items]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.h1 
        className="text-3xl font-bold mb-6 text-center"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Second-hand Materials at INES-Ruhengeri
      </motion.h1>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <SearchFilters filters={filters} onFilterChange={handleFilterChange} />
      </motion.div>
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {filteredItems.length > 0 ? (
          <ItemGrid items={filteredItems} />
        ) : (
          <div className="text-center mt-12 p-8 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">No items found</h2>
            <p className="text-gray-600">Try adjusting your search filters or check back later.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
