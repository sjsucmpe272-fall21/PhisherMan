import React from "react";

const Search = () => {
  return (
    <div className="search">
        <h1>Check URL</h1>
    <div className="search-box">
      <input
        className="search-input"
        type="text"
        placeholder="Search something.."
      />
      <button className="search-btn">
        <i className="fas fa-search"></i>
      </button>
    </div>
    </div>
  );
};

export default Search;
