const express = require('express');
const router = express.Router();
const database = require('../firebase');

// Function to save a generated image to the Firebase database
const saveGeneratedImage = async (userId, playlistId, imageData) => {
  try {
    // Push the image data to the specified Firebase database path
    await database.ref(`users/spotify:${userId}/playlists/${playlistId}`).push(imageData);
  } catch (error) {
    console.error('Error saving generated image:', error);
  }
};

// Function to retrieve generated images for a specific playlist from the Firebase database
const getGeneratedImagesForPlaylist = async (userId, playlistId) => {
  try {
    // Retrieve a snapshot of the images data from the specified Firebase database path
    const snapshot = await database.ref(`users/spotify:${userId}/playlists/${playlistId}`).once('value');
    const imagesData = snapshot.val();
    if (imagesData) {
      // Convert the images data object into an array with additional 'id' property
      return Object.entries(imagesData).map(([key, value]) => ({ ...value, id: key }));
    }
    return [];
  } catch (error) {
    console.error('Error retrieving generated images:', error);
    return [];
  }
};

// Route to handle saving a generated image
router.post('/saveImage', async (req, res) => {
  const { userId, playlistId, imageUrl } = req.body;
  try {
    // Call the saveGeneratedImage function to save the image data
    await saveGeneratedImage(userId, playlistId, { imageUrl });
    res.status(200).json({ message: 'Image saved successfully.' });
  } catch (error) {
    console.error('Error saving generated image:', error);
    res.status(500).json({ error: 'Error saving generated image.' });
  }
});

// Route to handle retrieving generated images for a playlist
router.get('/getImagesForPlaylist/:playlistId/:userId', async (req, res) => {
  const { userId, playlistId } = req.params;
  try {
    // Call the getGeneratedImagesForPlaylist function to retrieve images
    const images = await getGeneratedImagesForPlaylist(userId, playlistId);
    res.status(200).json({ images });
  } catch (error) {
    console.error('Error retrieving generated images:', error);
    res.status(500).json({ error: 'Error retrieving generated images.' });
  }
});


module.exports = router;
