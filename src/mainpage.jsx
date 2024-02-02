import { useEffect, useState } from "react";
import "./mainpage.css";
import axios from "axios";
import homesvg from "./assets/homesvg.svg";
import Profile from "./profile";
import Playlist from "./playlist";
import SpotifyPlayer from "./spotifyPlayer";

export default function HomePage() {
  const CLIENT_ID = "ecd7c0f4d62640d2b213d9cf4137c85f";
  const REDIRECT_URI = "http://localhost:5173/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const scope =
    "playlist-read-private user-read-email playlist-read-collaborative user-read-playback-state";

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [userData, setUserData] = useState(null);
  const [playlistData, setPlaylistData] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [activeComponent, setActiveComponent] = useState("homepage");
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

  useEffect(() => {
    if (token) {
      axios
        .get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => {
          setUserData(data);
          console.log("User Data:", data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [token]);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const resetSelectedPlaylist = () => {
    setSelectedPlaylist(null);
    setActiveComponent("artists");
  };

  const searchArtists = async (e) => {
    e.preventDefault();
    resetSelectedPlaylist();

    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: searchKey,
        type: "artist",
      },
    });

    setArtists(data.artists.items);
    setActiveComponent("artists");
  };

  const selectArtist = async (artistId) => {
    try {
      const { data } = await axios.get(
        `https://api.spotify.com/v1/artists/${artistId}/albums`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAlbums(data.items);
      setActiveComponent("albums");
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };

  const handlePlaylistSelection = async (playlistId) => {
    try {
      const { data } = await axios.get(
        `https://api.spotify.com/v1/playlists/${playlistId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedPlaylist(data);
      setActiveComponent("playlist");
    } catch (error) {
      console.error("Error fetching playlist data:", error.message);
    }
  };

  const renderArtists = () => {
    return artists.map((artist) => (
      <div className="searchContainer" key={artist.id}>
        <div className="card-container" onClick={() => selectArtist(artist.id)}>
          {artist.images.length ? (
            <div className="search-response-img">
              <img src={artist.images[0].url} alt="" />
            </div>
          ) : (
            <div>No Image</div>
          )}
          <div className="search-artist">{artist.name}</div>
        </div>
      </div>
    ));
  };

  const renderAlbums = () => {
    return albums.map((album) => (
      <div className="album" key={album.id}>
        {album.images.length ? (
          <img width={"25%"} src={album.images[0].url} alt="" />
        ) : (
          <div>No Image</div>
        )}
        <div className="album-text">{album.name}</div>
      </div>
    ));
  };
  const [activeHomeComponent, setActiveHomeComponent] = useState("homepage");

  const showHomePage = () => {
    setActiveComponent("homepage");
  };

  const renderHomePage = () => (
    <div className="homepage">

      {/* Trending */}
      <h3>Trending playlists</h3>
      <div className="home-flex">
        {trendingSongs.map((playlist) => (
          <div className="home-container" key={playlist.id}>
            <img src={playlist.images[0].url} alt={playlist.name} />
            <p>{playlist.name}</p>
          </div>
        ))}
      </div>

      {/* New Releases */}
      <h3>New Releases</h3>
      <div className="home-flex">
        {newReleases.map((album) => (
          <div className="home-container" key={album.id}>
            <img src={album.images[0].url} alt={album.name} />
            <p>{album.name}</p>
          </div>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    if (token) {
      const playlistId = "3IAIcHaDz290IQm92QLE55";
      //   let token = window.localStorage.getItem("token");
      console.log(token);

      axios
        .get(`https://api.spotify.com/v1/me/playlists`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => {
          setPlaylistData(data);
          console.log("Playlist Data:", data);
        })
        .catch((error) => {
          console.error("Error fetching playlist data:", error.message);
        });
      console.log("Token:", token);
      console.log("Playlist ID:", playlistId);
    }
  }, [token]);

  const formatDuration = (durationMs) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = ((durationMs % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const [trendingSongs, setTrendingSongs] = useState([]);
  const [newReleases, setNewReleases] = useState([]);

  useEffect(() => {
    if (token) {
      // Fetch the first 5 trending songs
      axios
        .get(
          "https://api.spotify.com/v1/browse/categories/toplists/playlists",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              limit: 10,
            },
          }
        )
        .then(({ data }) => {
          setTrendingSongs(data.playlists.items);
          console.log("Trending Songs Data:", data);
        })
        .catch((error) => {
          console.error("Error fetching trending songs data:", error.message);
        });

      // Fetch the first 5 new releases
      axios
        .get("https://api.spotify.com/v1/browse/new-releases", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: 10,
          },
        })
        .then(({ data }) => {
          setNewReleases(data.albums.items);
          console.log("New Releases Data:", data);
        })
        .catch((error) => {
          console.error("Error fetching new releases data:", error.message);
        });
    }
  }, [token]);

  const handleSelectedSongDetails = (songDetails) => {
    setSelectedSongDetails(songDetails);
  };

  const onSongSelect = (song) => {
    // Do something with the selected song, e.g., set it in the state
    // or perform any other actions related to the selected song
    console.log("Selected Song:", song);
  };



  return (
    <div className="main-container">
      <div className="left-container">
        <Playlist
          playlist={playlistData}
          onSelectPlaylist={handlePlaylistSelection}
        />
      </div>
      <div className="center-container">
        <div className="center-top">
          <div className="center-top-left">
            {token ? (
              <div className="search-input">
                <button className="homebutton" onClick={showHomePage}>
                  <svg
                    id="homebuttonsvg"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 -960 960 960"
                    width="24"
                  >
                    <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
                  </svg>
                </button>
                <form action="" onSubmit={searchArtists}>
                  <input
                    placeholder="Search..."
                    className="search"
                    type="text"
                    onChange={(e) => setSearchKey(e.target.value)}
                  />
                </form>
              </div>
            ) : (
              <h2>Login to proceed</h2>
            )}
          </div>
          <div className="center-top-right">
            {!token ? (
              <a
                href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${scope}`}
              >
                Login to Spotify
              </a>
            ) : (
              <div className="center-top-loggedin">
                <Profile userData={userData} />
              </div>
            )}
          </div>
        </div>
        <hr className="seperate" />

        <div className="div">
          {activeComponent === "artists" && (
            <div className="search-response">{renderArtists()}</div>
          )}

          {activeComponent === "playlist" && selectedPlaylist && (
            <div>
              <div className="playlist-selected">
                <img
                  src={selectedPlaylist.images[0].url}
                  alt="Playlist Cover"
                />
                <div className="playlist-selected-info">
                  <h3>{selectedPlaylist.name}</h3>
                  <p>{selectedPlaylist.owner.display_name}</p>
                </div>
              </div>
              {selectedPlaylist.tracks.items.map((track) => (
                <div key={track.track.id} className="playlist-song">
                  <div className="track-item">
                    <div className="track-flex1">
                      {track.track.album.images.length ? (
                        <img
                          src={track.track.album.images[0].url}
                          alt="Album Cover"
                          className="album-cover"
                        />
                      ) : (
                        <div>No Image</div>
                      )}
                      <div className="track-info">
                        <div className="track-flex2">
                          <p>
                            {track.track.name.length > 10
                              ? track.track.name.slice(0, 10) + "..."
                              : track.track.name}
                          </p>
                          <p>
                            {track.track.artists
                              .map((artist) =>
                                artist.name.length > 10
                                  ? artist.name.slice(0, 10) + "..."
                                  : artist.name
                              )
                              .join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="track-flex3">
                      <p>
                        {track.track.album.name.length > 15
                          ? track.track.album.name.slice(0, 15) + "..."
                          : track.track.album.name}
                      </p>
                    </div>
                    <div className="track-flex4">
                      <p>{formatDuration(track.track.duration_ms)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeComponent === "albums" && (
            <div className="albums-container">{renderAlbums()}</div>
          )}

          {activeComponent === "homepage" && renderHomePage()}
        </div>
      </div>
      <div className="right-container">
        <SpotifyPlayer onSelectedSongDetails={handleSelectedSongDetails} />
      </div>
    </div>
  );
}
