// Import required modules from the "openai" package
const { Configuration, OpenAIApi } = require("openai");

// Load environment variables from a .env file
require('dotenv').config();

// Create a new configuration object for OpenAI API
const configuration = new Configuration({
    organization: process.env.OPENAI_ORG_ID,  // Set the organization ID from environment variables
    apiKey: process.env.OPENAI_API_KEY,  // Set the API key from environment variables
});

// Create an instance of the OpenAIApi using the configured settings
const openai = new OpenAIApi(configuration);

// Export the configured OpenAIApi instance for use in other modules
module.exports = openai;
