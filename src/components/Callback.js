// This React component serves as the callback endpoint for Spotify authentication.
// When redirected from Spotify authentication, it extracts the access token from the URL hash,
// stores it in the local storage, and authenticates the user with Firebase using the access token.
// Additionally, it sets the Spotify user ID in local storage and navigates the user to the dashboard.
// If no access token is present, it redirects the user back to the home page.
// The component renders a loading message during the redirecting process.

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';
import { auth, signInWithCustomToken } from '../utils/firebase'

// Define the Callback component
const Callback = () => {
  // Use the useNavigate hook from react-router-dom to enable navigation
  const navigate = useNavigate();
  
  // State hook to store the Spotify access token
  const [accessToken, setAccessToken] = useState('');

  // Function to authenticate with Firebase using Spotify access token
  const authenticateWithFirebase = async (spotifyAccessToken) => {
    try {
      // Send a request to the server to authenticate the user
      const response = await fetch('http://localhost:8000/api/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken: spotifyAccessToken }),
      });

      // Parse the response JSON
      const data = await response.json();

      // Extract the Firebase custom token from the response
      const customToken = data.firebaseToken;

      // Store the Spotify user ID in local storage
      localStorage.setItem('spotify_user_id', data.spotifyUserId);

      // Sign in to Firebase using the custom token
      await signInWithCustomToken(auth, customToken);
    } catch (error) {
      // Handle errors that occur during the authentication process
      console.error('Error authenticating with Firebase:', error);
    }
  };

  // useEffect hook to run code after the component mounts
  useEffect(() => {
    // Extract the access token from the URL hash
    const hash = window.location.hash
      .substring(1)
      .split('&')
      .reduce((initial, item) => {
        const parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1]);
        return initial;
      }, {});

    // Check if the access token is present in the hash
    if (hash.access_token) {
      // Set the access token in state
      setAccessToken(hash.access_token);

      // Store the access token in local storage
      localStorage.setItem('spotify_access_token', hash.access_token);

      // Authenticate with Firebase using the Spotify access token
      authenticateWithFirebase(hash.access_token);

      // Navigate to the dashboard page
      navigate('/dashboard');
    } else {
      // If access token is not present, navigate back to the home page
      navigate('/');
    }
  }, [navigate]); // Depend on the navigate function to avoid useEffect warnings

  // Render a loading message while redirecting
  return <div className="callback-container">Redirecting...</div>;
};

// Export the Callback component
export default Callback;
