/*
  Large React component that is used for the main dashboard of our program. This includes all the playlists that are pulled from 
  a users spotify, and a log out component. The Dashboard component is also responsible for fetching data on individual playlists from
  Spotfiy API, that will be passed as children to later components.
*/




import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlaylistList from './PlaylistList';
import Logout from './Logout';
import '../styles/styles.css';
import evaluateSentiment from './evaluateSentiment';
import { ThreeDots } from 'react-loader-spinner';

const Dashboard = () => {
  console.log('123')
  const [isLoading, setIsLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  //use playlists variable to hold data on a given playlist
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('23')
    const accessToken = localStorage.getItem('spotify_access_token');
    if (!accessToken) {
      return;
    }

    const fetchData = async () => {
    
      try {
        
        const playlistResponse = await fetch(`http://localhost:8000/api/spotify/getUserPlaylists?access_token=${accessToken}`);
        if (!playlistResponse.ok) {
          throw new Error(`Error fetching user playlists: ${playlistResponse.statusText}`);
        }
        
        const playlistData = await playlistResponse.json();
        console.log('All Playlists:', playlistData.items);
    
        for (const playlist of playlistData.items) {
          // Fetch the playlist tracks
          const trackResponse = await fetch(`http://localhost:8000/api/spotify/getPlaylistTracks/${encodeURIComponent(playlist.tracks.href)}?access_token=${accessToken}`);
          if (!trackResponse.ok) {
            throw new Error(`Error fetching playlist tracks: ${trackResponse.statusText}`);
          }
          const trackData = await trackResponse.json();
          const tracks = trackData.items.slice(0, 5);
          playlist.tracksData = tracks;
    
          // Fetch the audio features for the tracks
          const trackIds = tracks.map((trackItem) => trackItem.track.id).join(',');
          const audioFeaturesResponse = await fetch(`http://localhost:8000/api/spotify/getAudioFeatures/${trackIds}?access_token=${accessToken}`);
          if (!audioFeaturesResponse.ok) {
            throw new Error(`Error fetching audio features: ${audioFeaturesResponse.statusText}`);
          }
          const audioFeaturesData = await audioFeaturesResponse.json();
    
          // Evaluate the sentiment based on audio features
          const sentiment = evaluateSentiment(audioFeaturesData.audio_features);
          playlist.mood = sentiment.mood;
          playlist.genre = sentiment.genre;
        }
    
        setPlaylists([...playlistData.items]);
    
        const userProfileResponse = await fetch(`http://localhost:8000/api/spotify/getUserProfile?access_token=${accessToken}`);
        if (!userProfileResponse.ok) {
          throw new Error(`Error fetching user profile: ${userProfileResponse.statusText}`);
        }
        const userProfileData = await userProfileResponse.json();
        console.log('User Profile Data:', userProfileData);
        setDisplayName(userProfileData.display_name);
      } catch (error) {
        console.error('Error during data fetching:', error);
        setError(error.message);
      }
    
      setIsLoading(false);
    };    

    fetchData();
  }, []);

  const handleSelectPlaylist = (playlist) => {
    navigate(`/selected-playlist/${playlist.id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('spotify_access_token'); //remove access token from local storage
    navigate('/'); // Navigate back to the login page
  };

  return (
    <>
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
        <>
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>{displayName}'s Playlists</h1>
            <Logout onLogout={handleLogout} />
          </div>
          <PlaylistList playlists={playlists} onSelectPlaylist={handleSelectPlaylist} />
        </div>
        </>
      )}
    </>
  );
};

export default Dashboard;