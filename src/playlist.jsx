import React from "react";
import "./playlist.css";

function Playlist({ playlist, onSelectPlaylist }) {
    if (!playlist) {
      return <div>Loading playlist...</div>;
    }
  
    const handlePlaylistClick = () => {
      onSelectPlaylist(playlist.id); // Pass the playlist ID to the selection function
    };

  return (
    <div className="div" onClick={handlePlaylistClick}>
      <div className="playlist-card">
        {playlist.images.length > 0 && (
          <img className="playlist-cover" src={playlist.images[0].url} alt="Playlist Cover" />
        )}
        <div className="playlist-info">
          <h1>{playlist.name}</h1>
          <p>{playlist.owner.display_name}</p>
        </div>
      </div>
      {/* Add more playlist cards as needed */}
    </div>
  );
}

export default Playlist;
