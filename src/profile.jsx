import { useState } from "react";


export default function Profile() {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };



  return (
    <div className="div">
      <section id="profile">
        <div className="profile-header" onClick={toggleDropdown}>
          <img
            src="url_to_your_profile_image.jpg"  // Replace with the actual URL of your profile image
            alt="Profile"
            className="profile-image"
          />
        </div>
        {isDropdownVisible && (
          <ul className="dropdown-content">
            <li>
              User ID: <span id="id"></span>
            </li>
            <li>
              Email: <span id="email"></span>
            </li>
            <li>
              Spotify URI: <a id="uri" href="#"></a>
            </li>
            <li>
              Link: <a id="url" href="#"></a>
            </li>
            <li>
              Profile Image: <span id="imgUrl"></span>
            </li>
          </ul>
        )}
      </section>
    </div>
  );
}

  
