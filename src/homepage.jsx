import { useEffect, useState } from "react";
import "./homepage.css";

export default function HomePage() {
  const CLIENT_ID = "ecd7c0f4d62640d2b213d9cf4137c85f";
  const REDIRECT_URI = "http://localhost:5173/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");

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
    setToken("")
    window.localStorage.removeItem("token")
}

  return (
    <div className="main-container">
      <div className="left-container">
        <div className="logo">
          <h1>
            <span className="logo-1">React</span>
            <span className="logo-2">Play</span>
          </h1>
        </div>
      </div>
      <div className="center-container">
        <div className="center-top">
          <div className="center-top-left">
            <input className="search" type="text" placeholder="Search" />
          </div>
          <div className="center-top-right">
            {!token ? (
              <a
                href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
              >
                Login to Spotify
              </a>
            ) : (
              <button onClick={logout}>Logout</button>
            )}
          </div>
        </div>
        {/* <hr className='center-top-underline'/> */}
      </div>
      <div className="right-container"></div>
    </div>
  );
}
