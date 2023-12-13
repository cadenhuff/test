/* React component that is used for individual blocks that make up dashboard.
   This component displays the given spotify playlist cover provided by Spotify, the sentiment, and will 
   create a list of the first 5 songs that are in the playlit.




*/



import React from 'react';

const PlaylistItem = ({ playlist, onSelectPlaylist }) => {
  const defaultImageUrl = 'https://via.placeholder.com/150'; // Change this URL to a suitable default image
  const playlistCoverImage = playlist.images && playlist.images.length > 0 ? playlist.images[0].url : defaultImageUrl;
  let trackCounter = 0;

  return (
    <li className="playlist-item">
      <div className="playlist-header">
        <img src={playlistCoverImage} alt={`${playlist.name} cover`} />
        <div>
          <h3>{playlist.name}</h3>
          <p>Sentiment: {playlist.mood} {playlist.genre}</p>
        </div>
      </div>
      <ul className="track-list">
        {playlist.tracksData &&
          playlist.tracksData.map((trackItem) => {
            trackCounter += 1;
            const trackCoverImage = trackItem.track.album.images && trackItem.track.album.images.length > 2 ? trackItem.track.album.images[2].url : defaultImageUrl;
            return (
              <li key={trackItem.track.id}>
                <span className="track-number">{trackCounter}. </span>
                <img src={trackCoverImage} alt={`${trackItem.track.name} cover`} />
                <span>{trackItem.track.name}</span>
              </li>
            );
          })}
      </ul>
      <button className="select-playlist" onClick={() => onSelectPlaylist(playlist)}>Select Playlist</button>
    </li>
  );
};

export default PlaylistItem;