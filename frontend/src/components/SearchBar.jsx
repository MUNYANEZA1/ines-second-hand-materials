// src/components/SearchBar.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md">
      <input
        type="text"
        placeholder="Search items..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <button
        type="submit"
        className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-r"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
