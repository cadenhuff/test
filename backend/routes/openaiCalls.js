const express = require('express');
const router = express.Router();
const openai = require('../openAI'); // Import the openAI instance


// Route to handle generating an image based on mood and sentiment
router.post('/generateImage', async (req, res) => {
  try {
    

    // Destructure mood and sentiment from the request body
    const { mood, sentiment } = req.body;

    // Log a message to the console
    console.log('hiiii');

    // Create a prompt based on the mood and sentiment
    const prompt = `Create an image that visually embodies and expresses a range of emotions, \
              capturing the essence of ${mood} ${sentiment}. The image should evoke a \
              specific emotion or mood, seamlessly aligning with the theme and atmosphere of the corresponding \
              playlist. Use vivid colors, imaginative designs, and evocative patterns to create an immersive \
              visual experience that resonates with the listener and enhances their connection with the music.`;

    

    // Use the OpenAI instance to create an image based on the prompt
    const response = await openai.createImage({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    // Respond with the generated image data
    res.json(response.data.data[0]);

  } catch (error) {
    // Log an error message to the console
    console.error('Error generating image:', error.message);

    // Respond with an error message
    res.status(500).json({ message: 'Error generating image' });
  }
});


module.exports = router;
