// Import necessary modules and packages
require('dotenv').config();  // Load environment variables from a .env file
const axios = require('axios');  // HTTP client for making requests
const express = require('express');  // Web application framework for Node.js
const cors = require('cors');  // Middleware for enabling Cross-Origin Resource Sharing (CORS)
const bodyParser = require('body-parser');  // Middleware for parsing request bodies
const SpotifyWebApi = require('spotify-web-api-node');  // Spotify API wrapper
const admin = require('firebase-admin');  // Firebase Admin SDK for server-side usage

// Create an Express application
const app = express();
app.use(cors());  // Enable CORS for all routes
app.use(bodyParser.json());  // Parse incoming JSON requests
app.use(express.json());  // Parse JSON in request body

// Retrieve Spotify API credentials from environment variables
const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const spotifyRedirectUri = process.env.SPOTIFY_REDIRECT_URI;

// Routes: Importing route handlers from separate files
const spotifyCalls = require('./routes/spotifyCalls');
const firebaseCalls = require('./routes/firebaseCalls');
const openaiCalls = require('./routes/openaiCalls');

// Middleware: Assign route handlers to specific routes
app.use('/api/spotify', spotifyCalls);
app.use('/api/firebase', firebaseCalls);
app.use('/api/openai', openaiCalls);

// Authentication route: Exchange Spotify access token for a Firebase custom token
app.post('/api/authenticate', async (req, res) => {
    try {
      const accessToken = req.body.accessToken;
  
      // Fetch the user's Spotify profile
      const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const spotifyUser = response.data;
      const firebaseUid = `spotify:${spotifyUser.id}`;
  
      // Create or update the user in Firebase
      await admin.auth().updateUser(firebaseUid, {
        displayName: spotifyUser.display_name,
      }).catch(async (error) => {
        if (error.code === 'auth/user-not-found') {
          await admin.auth().createUser({
            uid: firebaseUid,
            displayName: spotifyUser.display_name,
          });
        } else {
            console.log(error);
            res.sendStatus(400);
        }
      });
  
      // Generate the custom token
      const customToken = await admin.auth().createCustomToken(firebaseUid);

      // Respond with the custom token and Spotify user ID
      res.json({ firebaseToken: customToken, spotifyUserId: spotifyUser.id });
    } catch (error) {
      console.error('Error generating custom token:', error);
      res.status(500).send('Error generating custom token');
    }
  });

// Start the server on port 8000
app.listen(8000, () => console.log('Server listening on port 8000'));
