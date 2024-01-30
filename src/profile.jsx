import { useState } from "react";
import "./profile.css";

export default function Profile({ userData, setToken }) {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  return (
    <div className="profile-container">
      <section id="profile">
        <div className="profile-header" onClick={toggleDropdown}>
          <img
            src={userData?.images[0]?.url || "url_to_default_profile_image.jpg"}
            alt="Profile"
            className="profile-image"
          />
        </div>
        {isDropdownVisible && (
            <div className="dorpdown-container">
          <ul className="dropdown-content dropdown-absolute">
            <li className="dropdown-content mt">
              name: <span className="dropdown-content">{userData?.display_name}</span>
            </li>
            <hr />
            <li className="dropdown-content">
              Email: <span className="dropdown-content">{userData?.email}</span>
            </li>
            <hr />
            <li><button className="logout" onClick={logout}>
                  Logout
                </button></li>
                
          </ul>
          </div>
        )}
      </section>
    </div>
  );
}
