// Import the 'firebase-admin' module
const admin = require('firebase-admin');

// Import the service account key JSON file for Firebase
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin with the provided credentials and database URL
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),  // Use the provided service account credentials
  databaseURL: process.env.FIREBASE_DATABASE_URL,  // Set the database URL from environment variables
});

// Get a reference to the Firebase Realtime Database
const database = admin.database();

// Export both the Firebase Realtime Database reference and the initialized Firebase Admin instance
module.exports = { database, admin };
