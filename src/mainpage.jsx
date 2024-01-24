import { useEffect, useState } from "react";
import "./mainpage.css";
import axios from "axios";
import Profile from "./profile";
import Playlist from "./playlist";

export default function HomePage() {
  const CLIENT_ID = "9853bde8608449bf9d43e7694001d59a";
  const REDIRECT_URI = "http://localhost:5173/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const scope = 'playlist-read-private user-read-email playlist-read-collaborative';


  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [userData, setUserData] = useState(null);
  const [playlistData, setPlaylistData] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [activeComponent, setActiveComponent] = useState("artists");

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
        <div
          className="card-container"
          onClick={() => selectArtist(artist.id)}
        >
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
      <div key={album.id}>
        {album.images.length ? (
          <img width={"25%"} src={album.images[0].url} alt="" />
        ) : (
          <div>No Image</div>
        )}
        {album.name}
      </div>
    ));
  };

  useEffect(() => {
    if (token) {
      const playlistId = "3IAIcHaDz290IQm92QLE55";
    //   let token = window.localStorage.getItem("token");
      console.log(token)

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
                <form action="" onSubmit={searchArtists}>
                  <input
                    placeholder="Search..."
                    className="search"
                    type="text"
                    onChange={(e) => setSearchKey(e.target.value)}
                  />
                  <button className="searchSubmit" type={"submit"}>
                    Search
                  </button>
                </form>
              </div>
            ) : (
              <h2>Login to proceed</h2>
            )}
          </div>
          <div className="center-top-right">
            {!token ? (
              <a
              href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${scope}`}              >
                Login to Spotify
              </a>
            ) : (
              <div className="center-top-loggedin">
                <button className="logout" onClick={logout}>
                  Logout
                </button>
                <Profile userData={userData} />
              </div>
            )}
          </div>
        </div>
        <hr className="seperate"/>

        <div className="div">
          {activeComponent === "artists" && (
            <div className="search-response">{renderArtists()}</div>
          )}

          {activeComponent === "playlist" && selectedPlaylist && (
            <div>
              <div className="playlist-selected">
                <img src={selectedPlaylist.images[0].url} alt="Playlist Cover" />
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
            <div>{renderAlbums()}</div>
          )}
        </div>
      </div>
      <div className="right-container"></div>
    </div>
  );
}
