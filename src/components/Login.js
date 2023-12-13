//Login in component that uses Spotify api for authentication. 
// This React component renders a login page for Spotify authentication.
// It provides a button to initiate the Spotify authentication process.
// The component constructs the Spotify authorization URL with the necessary parameters
// such as client ID, redirect URI, response type, and scope.
// When the login button is clicked, it redirects the user to the Spotify authorization URL.
// The footer credits the developers.
const Login = () => {
  // Spotify API credentials
  const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
  const authEndpoint = "https://accounts.spotify.com/authorize";

  // Function to handle the Spotify login process
  const handleLogin = () => {
    // Define required parameters for Spotify authorization
    const responseType = 'token';
    const scope = 'playlist-read-private';

    // Construct the Spotify authorization URL
    const url = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;

    // Redirect the user to the Spotify authorization URL
    window.location.href = url;
  };

  // Render the login page with a title, login button, and developer credits
  return (
    <div className="login-container">
      <h1> Spotify Playlist AI Art Generator</h1>
      <button className="login-button" onClick={handleLogin}>
        Login with Spotify
      </button>
      <footer>Developed by Caden Huffman, and Grace Murphy</footer>
    </div>
  );
};

// Export the Login component
export default Login;
