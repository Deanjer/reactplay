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

    // console.log(data);
  };

  //   const selectArtist = async (artistId) => {
  //     const { data } = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     setAlbums(data.items);
  //   };
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

      console.log("Album Data:", data); // Add this line to log the received album data

      setAlbums(data.items);
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };

  const renderArtists = () => {
    return artists.map((artist) => (
      <div
        className="searchContainer"
        key={artist.id}
        onClick={() => selectArtist(artist.id)}
      >
        {artist.images.length ? (
          <img width={"25%"} src={artist.images[0].url} alt="" />
        ) : (
          <div>No Image</div>
        )}
        {artist.name}
      </div>
    ));
  };

  const renderAlbums = () => {
    return albums.map((album) => (
      <div className="albumContainer" key={album.id}>
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
      <div className="left-container">
        {/* Display albums in the left container */}
        {renderAlbums()}
      </div>
      <div className="center-container">
        <div className="center-top">
          <div className="center-top-left">
            {/* <input className="search" type="text" placeholder="Search" /> */}
            {token ? (
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
                <div className="div">
              <button className="logout" onClick={logout}>
                Logout
              </button>
              <Profile></Profile>
              </div>
            )}

            {renderArtists()}
          </div>
        </div>
      </div>
      <div className="right-container"></div>
    </div>
  );
}
