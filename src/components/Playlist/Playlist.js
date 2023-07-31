// Playlist.js
import React, { useState } from 'react';
import Tracklist from '../Tracklist/Tracklist';
import './Playlist.module.css';

function Playlist({ playlistName, playlistTracks, onNameChange, setPlaylistTracks, onAdd, onRemove, accessToken }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlaylistName, setEditedPlaylistName] = useState(playlistName);

  const handleNameChange = (event) => {
    setEditedPlaylistName(event.target.value);
  };

  const handleNameClick = () => {
    setIsEditing(true);
  };

  const handleNameBlur = () => {
    setIsEditing(false);
    onNameChange(editedPlaylistName);
  };

  const savePlaylist = () => {
    if (!accessToken) {
      console.log('Access token not available. Please login with Spotify.');
      return;
    }
  
    // Step 1: Create a new playlist on the user's Spotify account
    fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        const userId = data.id;
  
        fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: editedPlaylistName,
            description: 'Custom playlist created with Jammming',
            public: false, // Change this to true if you want the playlist to be public
          }),
        })
          .then(response => response.json())
          .then(data => {
            const playlistId = data.id;
  
            // Step 2: Add tracks from the custom playlist to the new playlist
            if (!playlistId) {
              console.error('Error creating playlist:', data);
              return;
            }
  
            const trackURIs = playlistTracks.map(track => track.uri);
  
            fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                uris: trackURIs,
              }),
            })
              .then(response => response.json())
              .then(data => {
                console.log('Playlist saved to Spotify:', data);
                // Optionally, you can display a success message to the user here
              })
              .catch(error => {
                console.error('Error adding tracks to playlist:', error);
              });
          })
          .catch(error => {
            console.error('Error creating playlist:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  };

  return (
    <div className="Playlist">
      {isEditing ? (
        <input
          value={editedPlaylistName}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
        />
      ) : (
        <h2 onClick={handleNameClick}>{playlistName}</h2>
      )}
      <Tracklist
        tracks={playlistTracks}
        onRemove={onRemove}
      />
      <button onClick={savePlaylist}>Save to Spotify</button>
    </div>
  );
}

export default Playlist;
