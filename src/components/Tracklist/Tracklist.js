// Tracklist.js
import React from 'react';
import Track from '../Track/Track';
import './Tracklist.module.css';

function Tracklist({ tracks, onRemove }) {
  return (
    <div className="Tracklist">
      {tracks.map(track => (
        <Track key={track.id} track={track} onRemove={onRemove} />
      ))}
    </div>
  );
}

export default Tracklist;
