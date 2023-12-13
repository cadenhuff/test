
// This React component represents a page displaying details of a selected playlist.
// It fetches playlist data from the Spotify API, including cover image and tracks.
// Additionally, it interacts with Firebase to retrieve and save generated images for the playlist.
// The component provides functionality to generate new playlist cover images using the DALL-E model.
// It dynamically updates the UI based on loading states and received data.
import React, { useEffect, useState } from 'react';
import evaluateSentiment from './evaluateSentiment';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import '../styles/styles.css';

const SelectedPlaylistPage = () => {
  // State variables to manage playlist data, loading states, previous images, generated result, and generation status
  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previousImages, setPreviousImages] = useState([]);
  const [result, setResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { id } = useParams();

  // useEffect hook to fetch playlist data and evaluate sentiment on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const accessToken = localStorage.getItem('spotify_access_token');
      if (!accessToken) {
        return;
      }

      // Fetch playlist data by ID
      const playlistResponse = await fetch(`http://localhost:8000/api/spotify/getPlaylistById/${id}?access_token=${accessToken}`);
      const playlist = await playlistResponse.json();

      // Fetch playlist tracks
      const trackResponse = await fetch(`http://localhost:8000/api/spotify/getPlaylistTracks/${encodeURIComponent(playlist.tracks.href)}?access_token=${accessToken}`);
      const trackData = await trackResponse.json();
      const tracks = trackData.items.slice(0, 5);
      playlist.tracksData = tracks;

      // Fetch audio features for tracks and evaluate sentiment
      const trackIds = tracks.map((trackItem) => trackItem.track.id).join(',');
      const audioFeaturesResponse = await fetch(`http://localhost:8000/api/spotify/getAudioFeatures/${trackIds}?access_token=${accessToken}`);
      const audioFeaturesData = await audioFeaturesResponse.json();

      const sentiment = evaluateSentiment(audioFeaturesData.audio_features);
      playlist.genre = sentiment.genre;
      playlist.mood = sentiment.mood;

      setPlaylist(playlist);
      setIsLoading(false);
    };

    const fetchGeneratedImages = async () => {
      const userId = localStorage.getItem('spotify_user_id');
      const response = await fetch(`http://localhost:8000/api/firebase/getImagesForPlaylist/${id}/${userId}`);
      const data = await response.json();
      setPreviousImages(data.images);
    };

    fetchData();
    fetchGeneratedImages();
  }, [id]);

  // Function to save a generated image to Firebase
  const saveGeneratedImage = async (imageUrl) => {
    const userId = localStorage.getItem('spotify_user_id');
    const response = await fetch('http://localhost:8000/api/firebase/saveImage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        playlistId: id,
        imageUrl,
      }),
    });
    const data = await response.json();
    setPreviousImages((prevImages) => [...prevImages, data.savedImage]);
  };

  // Function to generate a new image using the DALL-E model
  const handleDALLEGenerateImage = async () => {
    setIsGenerating(true);
    try {
      const requestData = {
        mood: playlist.mood,
        sentiment: playlist.sentiment,
      };

      const response = await fetch('http://localhost:8000/api/openai/generateImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Store the previous result
      if (result) {
        setPreviousImages((prevImages) => [...prevImages, { imageUrl: result }]);
      }

      // Set the new result
      setResult(data.url);
      saveGeneratedImage(data.url);
    } catch (error) {
      console.error('Error generating image:', error.message);
    }
    setIsGenerating(false);
  };

  const navigate = useNavigate();

  // Function to navigate back to the dashboard
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Render the selected playlist page with dynamic content based on loading states and received data
  return (
    <div className="selected-playlist-page">
      {isLoading ? (
        <div className="loader-wrapper">
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#4fa94d"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
          />
        </div>
      ) : (
        playlist && (
          <>
            <button className="back-to-dashboard" onClick={handleBackToDashboard}>
              Back to Dashboard
            </button>
            <h1>{playlist.name}</h1>
            <p>Sentiment: {playlist.mood} {playlist.genre}</p>
            <button className="generate-image-button" onClick={handleDALLEGenerateImage}>
              Generate New Playlist Cover
            </button>
            {isGenerating ? (
              <div className="loader-wrapper">
                <ThreeDots
                  height="80"
                  width="80"
                  radius="9"
                  color="#4fa94d"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                  visible={true}
                />
              </div>
            ) : (
              result && <img className="result-image" src={result} alt="DALL-E Sentiment" />
            )}
            <div className="previous-images">
              <h3>Previously Generated Images:</h3>
              {previousImages.filter(Boolean).map((image, index) => (
                <img
                  key={index}
                  className="previous-image"
                  src={image.imageUrl}
                  alt={`Generated image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )
      )}
    </div>
  );
};

export default SelectedPlaylistPage;
