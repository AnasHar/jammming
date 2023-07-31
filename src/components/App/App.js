//App.js
import React, { useState, useEffect } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import './App.module.css';

function App() {
  const [searchResults, setSearchResults] = useState([]);

  const sampleSearchResults = [
    { id: '1', name: 'Song 1', artist: 'Artist 1', album: 'Album 1' },
    { id: '2', name: 'Song 2', artist: 'Artist 2', album: 'Album 2' },
    // Add more sample data here
  ];

  const samplePlaylistTracks = [
    
    // Add more sample data here
  ];

  const [playlistName, setPlaylistName] = useState('My Playlist');
  const [playlistTracks, setPlaylistTracks] = useState(samplePlaylistTracks);
  const [accessToken, setAccessToken] = useState(null);

  const addToPlaylist = (track) => {
    if (!playlistTracks.some(playlistTrack => playlistTrack.id === track.id)) {
      setPlaylistTracks([...playlistTracks, track]);
    }
  };

  const removeFromPlaylist = (track) => {
    const updatedPlaylist = playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id);
    setPlaylistTracks(updatedPlaylist);
  };

  const spotifyClientId = 'afa444fb46dd423495b957149bcc6471';

  const handleLogin = () => {
    const scopes = ['user-read-private', 'user-read-email', 'playlist-modify-public', 'playlist-modify-private'];
    const redirectUri = 'http://localhost:3000/'; // Replace with your actual redirect URI

    // Redirect the user to Spotify for authorization
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${spotifyClientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scopes.join('%20')}`;
  };

  useEffect(() => {
    // Check if the URL contains the access token
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    if (token) {
      // If the token is present, update the accessToken state
      setAccessToken(token);
    }
  }, []);

  // Function to perform Spotify search request
  const searchSpotify = (searchTerm) => {
    if (!accessToken) {
      console.log('Access token not available. Please login with Spotify.');
      return;
    }

    const searchEndpoint = `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(searchTerm)}`;	
    fetch(searchEndpoint, {	
      headers: {	
        Authorization: `Bearer ${accessToken}`,	
      },	
    })	
      .then(response => response.json())	
      .then(data => {	
        if (data.tracks) {	
          const tracks = data.tracks.items.map(item => ({	
            id: item.id,	
            name: item.name,	
            artist: item.artists.map(artist => artist.name).join(', '),	
            album: item.album.name,	
            uri: item.uri,	
          }));	
          setSearchResults(tracks);	
        }	
      })	
      .catch(error => {	
        console.error('Error searching tracks:', error);	
      });
  };

  return (
    <div className="App">
      <h1>Jammming</h1>
      <SearchBar onSearch={searchSpotify} />
      <div className="App-playlist">
        <SearchResults searchResults={searchResults} onAdd={addToPlaylist} />
        <Playlist
          playlistName={playlistName}
          playlistTracks={playlistTracks}
          onNameChange={setPlaylistName}
          setPlaylistTracks={setPlaylistTracks}
          onAdd={addToPlaylist}
          onRemove={removeFromPlaylist}
          accessToken={accessToken}
        />
      </div>
      <button onClick={handleLogin}>Connect with Spotify</button>
    </div>
  );
}

export default App;

