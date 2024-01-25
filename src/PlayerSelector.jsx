// SpotifyPlayerSelector.jsx

import React, { useState, useEffect } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';

const SpotifyPlayerSelector = () => {
  const [trackUri, setTrackUri] = useState('spotify:track:4uLU6hMCjMI75M1A2tKUQC'); // Default track URI
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Function to parse the URL parameters
    const getHashParams = () => {
      const hashParams = {};
      window.location.hash.substr(1).split('&').forEach(function (item) {
        const parts = item.split('=');
        hashParams[parts[0]] = parts[1];
      });
      return hashParams;
    }

    // Check if the access token is present in the URL
    const params = getHashParams();
    const accessToken = params.access_token;

    if (accessToken) {
      // Set the access token in the state
      setToken(accessToken);
    }
  }, []);

  const handleTrackChange = (event) => {
    setTrackUri(event.target.value);
  };

  return (
    <div>
      <h1>Spotify Player Selector</h1>

      <label htmlFor="trackUri">Select Track:</label>
      <select id="trackUri" onChange={handleTrackChange} value={trackUri}>
        <option value="spotify:track:4uLU6hMCjMI75M1A2tKUQC">Track 1</option>
        <option value="spotify:track:another_track_uri">Track 2</option>
        {/* Add more options as needed */}
      </select>

      {/* Spotify Player */}
      {token ? (
        <SpotifyPlayer
          token={token}
          uris={trackUri ? [trackUri] : []}
          autoPlay
        />
      ) : (
        <p>Authentication failed. Please check your Spotify app settings and try again.</p>
      )}
    </div>
  );
};

export default SpotifyPlayerSelector;
