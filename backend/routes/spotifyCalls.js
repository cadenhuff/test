const express = require('express');
const axios = require('axios');

// Create a router in express
const router = express.Router();

// Helper function to get user playlists from Spotify
const getUserPlaylists = async (req, res) => {
  try {
    // Extract the access token from the query parameters
    const accessToken = req.query.access_token;
    let playlists = [];
    let url = 'https://api.spotify.com/v1/me/playlists';

    // Retrieve user playlists using paginated requests
    while (url) {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      playlists = [...playlists, ...response.data.items];
      url = response.data.next;
    }

    // Respond with the retrieved playlists
    res.json({ items: playlists });
  } catch (error) {
    console.error('Error getting user playlists:', error);
    res.status(500).send('Error getting user playlists');
  }
};

// Helper function to get tracks for a specific playlist from Spotify
const getPlaylistTracks = async (req, res) => {
  try {
    // Extract the access token and tracksHref from the request parameters
    const accessToken = req.query.access_token;
    const tracksHref = req.params.tracksHref;

    // Retrieve playlist tracks using the provided tracksHref
    const response = await axios.get(tracksHref, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Respond with the retrieved playlist tracks
    res.json(response.data);
  } catch (error) {
    console.error('Error getting playlist tracks:', error);
    res.status(500).send('Error getting playlist tracks');
  }
};

// Helper function to get audio features for specific tracks from Spotify
const getAudioFeatures = async (req, res) => {
  try {
    // Extract the access token and trackIds from the request parameters
    const accessToken = req.query.access_token;
    const trackIds = req.params.trackIds;

    // Retrieve audio features for the specified trackIds
    const response = await axios.get(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Respond with the retrieved audio features
    res.json(response.data);
  } catch (error) {
    console.error('Error getting audio features:', error);
    res.status(500).send('Error getting audio features');
  }
};

// Helper function to get the user profile from Spotify
const getUserProfile = async (req, res) => {
  try {
    // Extract the access token from the query parameters
    const accessToken = req.query.access_token;

    // Retrieve the user profile using the access token
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Respond with the retrieved user profile
    res.json(response.data);
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).send('Error getting user profile');
  }
};

// Helper function to get a playlist by its ID from Spotify
const getPlaylistById = async (req, res) => {
  try {
    // Extract the access token and playlistId from the request parameters
    const accessToken = req.query.access_token;
    const playlistId = req.params.playlistId;

    // Retrieve the playlist by its ID
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Respond with the retrieved playlist
    res.json(response.data);
  } catch (error) {
    console.error('Error getting playlist by ID:', error);
    res.status(500).send('Error getting playlist by ID');
  }
};

// Define routes for each helper function
router.get('/getUserPlaylists', getUserPlaylists);
router.get('/getPlaylistTracks/:tracksHref', getPlaylistTracks);
router.get('/getAudioFeatures/:trackIds', getAudioFeatures);
router.get('/getUserProfile', getUserProfile);
router.get('/getPlaylistById/:playlistId', getPlaylistById);

// Export the helper functions for use in other files
module.exports = router;
