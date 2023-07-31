// Track.js
import React from 'react';
import './Track.module.css';

function Track({ track, onAdd, onRemove }) {
  const handleAddClick = () => {
    onAdd(track);
  };

  const handleRemoveClick = () => {
    onRemove(track);
  };

  return (
    <div className="Track">
      <div className="Track-information">
        <h3>{track.name}</h3>
        <p>{`${track.artist} | ${track.album}`}</p>
      </div>
      <button className="Track-action" onClick={handleAddClick}>+</button>
      <button className="Track-action" onClick={handleRemoveClick}>-</button>
    </div>
  );
}

export default Track;
