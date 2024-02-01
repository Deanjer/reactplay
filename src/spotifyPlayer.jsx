import React, { useEffect, useState } from "react";
import axios from "axios";

const SpotifyPlayer = ({ onSelectedSongDetails }) => {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    const fetchCurrentlyPlaying = async () => {
      const token = window.localStorage.getItem("token");

      if (token) {
        try {
          const { data } = await axios.get(
            "https://api.spotify.com/v1/me/player/currently-playing",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (data && data.item) {
            const { name, artists, album, duration_ms } = data.item;
            setCurrentlyPlaying({
              name,
              artists,
              album,
              duration_ms,
            });
            onSelectedSongDetails({
              name,
              artists,
              album,
              duration_ms,
            });
          }
        } catch (error) {
          console.error("Error fetching currently playing data:", error);

          if (error.response && error.response.status === 429) {
            // If rate-limited, wait for some time and then retry
            setTimeout(() => {
              fetchCurrentlyPlaying();
            }, 5000); // Retry after 5 seconds
          }
        }
      }
    };

    const intervalId = setInterval(() => {
      fetchCurrentlyPlaying();
    }, 10000); // Fetch every 10 seconds

    fetchCurrentlyPlaying();

    return () => {
      clearInterval(intervalId);
    };
  }, [onSelectedSongDetails]);

  useEffect(() => {
    const initializePlayer = async () => {
      const token = window.localStorage.getItem("token");

      if (window.Spotify) {
        const newPlayer = new window.Spotify.Player({
          name: "Your Spotify Player",
          getOAuthToken: (cb) => {
            cb(token);
          },
        });

        newPlayer.addListener("ready", () => {
          onPlayerReady();
          setPlayer(newPlayer);
        });
        newPlayer.addListener("not_ready", ({ device_id }) => {
          console.log("Device ID has gone offline", device_id);
        });

        newPlayer.addListener("initialization_error", onConnectError);
        newPlayer.addListener("authentication_error", onConnectError);
        newPlayer.addListener("account_error", onConnectError);
        newPlayer.addListener("playback_error", onConnectError);
      }
    };

    const onPlayerReady = () => {
      setIsPlayerReady(true);
    };

    const onConnectError = (error) => {
      console.error("Error connecting to the player:", error);
    };

    initializePlayer();
  }, []);

  useEffect(() => {
    if (player && deviceId) {
      player.connect();
    }
  }, [player, deviceId]);

  const openSpotifyAuthWindow = () => {
    // Open a new window/tab to trigger user interaction
    window.open(
      "https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=user-read-playback-state%20user-modify-playback-state&response_type=token",
      "Spotify Auth",
      "width=400,height=500"
    );
  };

  const handlePause = () => {
    if (isPlayerReady && player) {
      openSpotifyAuthWindow();
      player.pause().then(() => console.log("Paused playback"));
    }
  };

  const handleResume = () => {
    if (isPlayerReady && player) {
      openSpotifyAuthWindow();
      player.resume().then(() => console.log("Resumed playback"));
    }
  };

  return (
    <div className="spotify-player">
      {currentlyPlaying && (
        <div className="currently-playing">
          <img
            src={currentlyPlaying.album.images[1].url}
            alt="Album Cover"
            className="album-cover"
          />
          <div className="song-details">
            <h3>{currentlyPlaying.name}</h3>
            <p>
              {currentlyPlaying.artists
                .map((artist) => artist.name)
                .join(", ")}
            </p>
            <div className="player-controls">
              <button onClick={handlePause} disabled={!isPlayerReady}>
                Pause
              </button>
              <button onClick={handleResume} disabled={!isPlayerReady}>
                Resume
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Your player UI or controls can be added here */}
    </div>
  );
};

export default SpotifyPlayer;
