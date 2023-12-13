// Spotify Authentication Configuration and Utility Functions:

// Spotify Authorization Endpoint URL
export const authEndpoint = "https://accounts.spotify.com/authorize";

// Spotify API Client ID and Redirect URI obtained from environment variables
export const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
export const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;

// Spotify Authorization Scopes required for authentication
export const scopes = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
];

// Function to construct the Spotify login URL
export const getLoginUrl = () => {
  return `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scopes.join(" "))}&response_type=token`;
};

// Function to extract the access token from the URL hash
export const getTokenFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.hash.substring(1));
  const access_token = urlParams.get("access_token");
  return { access_token };
};
