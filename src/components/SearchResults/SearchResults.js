// SearchResults.js
import React from 'react';
import Track from '../Track/Track';
import './SearchResults.module.css';

function SearchResults({ searchResults, onAdd }) {
  return (
    <div className="SearchResults">
      <h2>Search Results</h2>
      {searchResults.map(track => (
        <Track key={track.id} track={track} onAdd={onAdd} />
      ))}
    </div>
  );
}

export default SearchResults;
