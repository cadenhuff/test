// This React component renders details of the selected playlist.
// It receives a 'playlist' object as a prop, containing information like name, image URL, mood, and genre.
const SelectedPlaylist = ({ playlist }) => (
  // Render a div with a CSS class 'selected-playlist'
  <div className="selected-playlist">
    {/* Display the playlist title */}
    <h2>Selected Playlist</h2>
    {/* Display the playlist name */}
    <h3>{playlist.name}</h3>
    {/* Display the playlist cover image */}
    <img src={playlist.imageUrl} alt={`${playlist.name} cover`} />
    {/* Display the sentiment, mood, and genre of the playlist */}
    <p>Sentiment: {playlist.mood} {playlist.genre}</p>
  </div>
);

export default SelectedPlaylist;
