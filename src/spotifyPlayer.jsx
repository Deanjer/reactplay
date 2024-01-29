import React, { useState, useEffect } from 'react';

const SpotifyPlayer = () => {

  const CLIENT_ID = "9853bde8608449bf9d43e7694001d59a";
  const REDIRECT_URI = "http://localhost:5173/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const scope = 'playlist-read-private user-read-email playlist-read-collaborative user-read-playback-state';


  const [token, setToken] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

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



  // const [token, setToken] = useState(null);
  const [songs, setSongs] = useState([]);
  const [sampleSongs] = useState([
    { id: '1rDgAHDX95RmylxjgVW9tN?si=6c1c6dc4c1144430', name: 'Song 1' },
    { id: '2l2yRJWgMiJkfPbRNiuC25?si=3ff359552c094c87', name: 'Song 2' },
    { id: '5SZWCBRpEujCFwETNvfxzz?si=c6fa4373512a4482', name: 'Song 3' }
    // Add more sample songs as needed
  ]);

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
      setSongs(sampleSongs);
    }
  }, [token, sampleSongs]);

  const [selectedSongDetails, setSelectedSongDetails] = useState(null);

  const handleSongClick = async (song) => {
    try {

      console.log(song.id);
      
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
    <div>
      <h1>Spotify Song Player</h1>
      <ul>
        {songs.map((song) => (
          <li key={song.id} onClick={() => handleSongClick(song)}>
            {song.name}
          </li>
        ))}
      </ul>

      {/* Display the album cover if a song is selected */}
      {selectedSongDetails && (
        <div>
          <h2>Selected Song Details</h2>
          <img src={selectedSongDetails.album.images[0].url} alt="Album Cover" />
          <p>{`Song: ${selectedSongDetails.name}`}</p>
          <p>{`Album: ${selectedSongDetails.album.name}`}</p>
          
        </div>
      )}
    </div>
  );
};

export default SpotifyPlayer;