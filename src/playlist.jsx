import React from "react";
import "./playlist.css";

function Playlist({ playlist, onSelectPlaylist }) {
    if (!playlist) {
      return <div>Loading playlist...</div>;
    }
  
    const handlePlaylistClick = (playlistId) => {
        onSelectPlaylist(playlistId); // Pass the playlist ID to the selection function
      };

  return (
    <>
    {playlist.items.map(function(data){
        return(
            <div className="playlist-container" onClick={() => handlePlaylistClick(data.id)}>
            <div className="playlist-card">
              {data.images.length > 0 && (
                <img className="playlist-cover" src={data.images[0].url} alt="Playlist Cover" />
              )}
              <div className="playlist-info">
                <h1>{data.name}</h1>
                <p>{data.owner.display_name}</p>
              </div>
            </div>
            {/* Add more playlist cards as needed */}
          </div>
        )
    })}
   </>
  );
}

export default Playlist;
