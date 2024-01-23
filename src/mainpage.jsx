import { useEffect, useState } from "react";
import "./mainpage.css";
import axios from "axios";
import Profile from "./profile";

export default function HomePage() {
  const CLIENT_ID = "ecd7c0f4d62640d2b213d9cf4137c85f";
  const REDIRECT_URI = "http://localhost:5173/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [userData, setUserData] = useState(null);

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

  const searchArtists = async (e) => {
    e.preventDefault();
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
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };

  const renderArtists = () => {
    return artists.map((artist) => (
      <div className="searchContainer">
        <div
          className="card-container"
          key={artist.id}
          onClick={() => selectArtist(artist.id)}
        >
          {artist.images.length ? (
            <div className="search-response-img">
              <img src={artist.images[0].url} alt="" />
            </div>
          ) : (
            <div>No Image</div>
          )}
          <div className="search-artist">
          {artist.name}
          </div>
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

  return (
    <div className="main-container">
      <div className="left-container">{renderAlbums()}</div>
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
                href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
              >
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
        <div className="search-response">{renderArtists()}</div>
      </div>
      <div className="right-container"></div>
    </div>
  );
}
