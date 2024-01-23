import React from "react";
import "./playlist.css";

function Playlist({ playlist }) {
    // Check if playlist is null or undefined
    if (!playlist) {
      return <div>Loading playlist...</div>;
    }
  
    return (
        <div className="div">
      <div className="playlist-card">
        {playlist.images.length > 0 && (
          <img className="playlist-cover" src={playlist.images[0].url} alt="Playlist Cover" />
        )}
        <div className="playlist-info">
        <h1>{playlist.name}</h1>
        <p>{playlist.owner.display_name}</p>
        </div>
      </div>
{/* test 2de */}
<div className="playlist-card">
{playlist.images.length > 0 && (
  <img className="playlist-cover" src={playlist.images[0].url} alt="Playlist Cover" />
)}
<div className="playlist-info">
<h1>{playlist.name}</h1>
<p>{playlist.owner.display_name}</p>
</div>
</div>
</div>
    );
  }
  
  
  

export default Playlist;
