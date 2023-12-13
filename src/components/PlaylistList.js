// This React component renders a list of playlists.
// It receives an array of 'playlists' as a prop, each represented by a 'PlaylistItem' component.
// Additionally, it receives a callback function 'onSelectPlaylist' to handle playlist selection.

import React from 'react';
import PlaylistItem from './PlaylistItem';

const PlaylistList = ({ playlists, onSelectPlaylist }) => (
  // Render an unordered list ('ul') with a CSS class 'playlist-list'
  <ul className="playlist-list">
    {/* Map through the 'playlists' array and render a 'PlaylistItem' component for each playlist */}
    {playlists.map((playlist) => (
      <PlaylistItem key={playlist.id} playlist={playlist} onSelectPlaylist={onSelectPlaylist} />
    ))}
  </ul>
);


export default PlaylistList;
