import React, { useState, useEffect } from 'react';
// import HomePage from './mainpage';

const SpotifyPlayer = () => {
  const CLIENT_ID = "9853bde8608449bf9d43e7694001d59a";
  const REDIRECT_URI = "http://localhost:5173/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const scope = 'playlist-read-private user-read-email playlist-read-collaborative user-read-playback-state';

  const [token, setToken] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSongDetails, setSelectedSongDetails] = useState(null);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []);

  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchToken = async () => {
      // Implement your server-side logic to obtain a Spotify access token
      const response = await fetch('/api/get-spotify-token');
      const data = await response.json();
      setToken(data.token);
    };

    fetchToken();
  }, []);

  useEffect(() => {
    // Simulate fetching user's playlists from Spotify after obtaining the token
    if (token) {
      // Fetch sample songs dynamically
      const fetchSampleSongs = async () => {
        const sampleSongIds = [
          '1rDgAHDX95RmylxjgVW9tN?si=6c1c6dc4c1144430',
          '2l2yRJWgMiJkfPbRNiuC25?si=3ff359552c094c87',
          '5SZWCBRpEujCFwETNvfxzz?si=c6fa4373512a4482',
          '5awDvzxWfd53SSrsRZ8pXO?si=0b523876d87e4bb8',
        ];

        const sampleSongPromises = sampleSongIds.map(async (songId) => {
          const response = await fetch(`https://api.spotify.com/v1/tracks/${songId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch song details');
          }

          const data = await response.json();
          return { id: songId, name: data.name };
        });

        const sampleSongData = await Promise.all(sampleSongPromises);
        setSongs(sampleSongData);
      };

      fetchSampleSongs();
    }
  }, [token]);

  const handleSongClick = async (song) => {
    try {
      const endpoint = `https://api.spotify.com/v1/tracks/${song.id}`;
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch song details');
      }

      const data = await response.json();
      console.log('Song details:', data);

      // Set the selected song details, including the cover, in state
      setSelectedSongDetails(data);
    } catch (error) {
      console.error('Error fetching song details:', error.message);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Container for the list of songs */}
      <div style={{ flex: 1 }}>

        

        <h1>Spotify Song List</h1>
        <ul>
          {songs.map((song) => (
            <li key={song.id} onClick={() => handleSongClick(song)}>
              {song.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Container for the details of the selected song */}
      <div style={{ flex: 1 }}>
        {selectedSongDetails && (
          <div>
            <h2>Selected Song Details</h2>
            <img src={selectedSongDetails.album.images[1].url} alt="Album Cover" />
            <p>{`Song: ${selectedSongDetails.name}`}</p>
            <p>{`Artist: ${selectedSongDetails.artists.map(artist => artist.name).join(', ')}`}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotifyPlayer;
