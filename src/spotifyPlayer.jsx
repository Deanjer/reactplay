import React, { useEffect, useState } from "react";
import "./spotifyPlayer.css";
import axios from "axios";

const SpotifyPlayer = ({ onSelectedSongDetails }) => {
  const [player, setPlayer] = useState(true);
  const [deviceId, setDeviceId] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isPlayerReady, setIsPlayerReady] = useState(true);

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

          if (data && data.is_playing && data.item) {
            const { name, artists, album, duration_ms } = data.item;
            const newSongDetails = {
              name,
              artists,
              album,
              duration_ms,
            };

            // Update only if a new song is playing
            if (!currentlyPlaying || currentlyPlaying.name !== newSongDetails.name) {
              setCurrentlyPlaying(newSongDetails);
              onSelectedSongDetails(newSongDetails);
            }
          }
        } catch (error) {
          console.error("Error fetching currently playing data:", error);

          if (error.response && error.response.status === 429) {
            // If rate-limited, wait for some time and then retry
            const retryAfter = error.response.headers['retry-after'] || 5;
            setTimeout(() => {
              fetchCurrentlyPlaying();
            }, retryAfter * 1000);
          }
        }
      }
    };

    const intervalId = setInterval(() => {
      fetchCurrentlyPlaying();
    }, 12000); // Fetch every 12 seconds

    fetchCurrentlyPlaying();

    return () => {
      clearInterval(intervalId);
    };
  }, [onSelectedSongDetails, currentlyPlaying]);

  useEffect(() => {
    if (player && deviceId) {
      player.connect();
    }
  }, [player, deviceId]);

  const openSpotifyAuthWindow = () => {
    window.open(
      "https://accounts.spotify.com/authorize?client_id=9853bde8608449bf9d43e7694001d59a&redirect_uri=http://localhost:5173/&scope=user-read-playback-state%20user-modify-playback-state&response_type=token",
      "Spotify Auth",
      "width=400,height=500"
    );
  };

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
        setIsPlayerReady(true);
      });
      newPlayer.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
        setIsPlayerReady(false);
      });

      newPlayer.addListener("initialization_error", onConnectError);
      newPlayer.addListener("authentication_error", onConnectError);
      newPlayer.addListener("account_error", onConnectError);
      newPlayer.addListener("playback_error", onConnectError);
    }
  };

  const handleTogglePlayback = async () => {
    if (isPlayerReady && player) {
      const token = window.localStorage.getItem("token");

      try {
        console.log("Trying to get playback state...");
        const playbackState = await axios.get("https://api.spotify.com/v1/me/player", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Playback State:", playbackState.data);

        if (playbackState.data && playbackState.data.is_playing) {
          await axios.put("https://api.spotify.com/v1/me/player/pause", {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Paused playback");
        } else {
          await axios.put("https://api.spotify.com/v1/me/player/play", {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Resumed playback");
        }
      } catch (error) {
        console.error("Error getting playback state:", error);
      }
    }
  };
  
  const handleSkipToNext = async () => {
    if (isPlayerReady && player) {
      const token = window.localStorage.getItem("token");

      try {
        await axios.post(
          "https://api.spotify.com/v1/me/player/next",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Skipped to next track");
      } catch (error) {
        console.error("Error skipping to next track:", error);
      }
    }
  };

  const handleSkipToPrevious = async () => {
    if (isPlayerReady && player) {
      const token = window.localStorage.getItem("token");

      try {
        await axios.post(
          "https://api.spotify.com/v1/me/player/previous",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Skipped to previous track");
      } catch (error) {
        console.error("Error skipping to previous track:", error);
      }
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
            
          </div>
        </div>
      )}
    </div>
  );
};

export default SpotifyPlayer;