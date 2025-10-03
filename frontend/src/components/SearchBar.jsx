import React, { useState } from "react";

export default function SearchBar({ onSearch, placeholder = "Search for flowers..." }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Optional: Real-time search as user types
    // onSearch(value);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-wrapper">
        <span className="search-icon">🔍</span>
        
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
        />
        
        {searchTerm && (
          <button
            type="button"
            className="clear-button visible"
            onClick={handleClear}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
        
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
}