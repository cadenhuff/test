/* Javascript function that uses Spotify audioFeatures to gather data on playlist songs.
    Useing this data, we could guess genre. 
    Finally using valence and energy, we gave each playlist a sentiment. 
    This could very easliy be greatly expanded upon as our logic was very simplistic and 
    basic. 
*/

export default function evaluateSentiment(audioFeatures) {
    const numTracks = audioFeatures.length;
    const totalValence = audioFeatures.reduce((sum, track) => sum + track.valence, 0);
    const totalEnergy = audioFeatures.reduce((sum, track) => sum + track.energy, 0);
    const totalDanceability = audioFeatures.reduce((sum, track) => sum + track.danceability, 0);
    const totalTempo = audioFeatures.reduce((sum, track) => sum + track.tempo, 0);
    const totalSpeechiness = audioFeatures.reduce((sum, track) => sum + track.speechiness, 0);
    const totalInstrumentalness = audioFeatures.reduce((sum, track) => sum + track.instrumentalness, 0);
  
    const avgValence = totalValence / numTracks;
    const avgEnergy = totalEnergy / numTracks;
    const avgDanceability = totalDanceability / numTracks;
    const avgTempo = totalTempo / numTracks;
    const avgSpeechiness = totalSpeechiness / numTracks;
    const avgInstrumentalness = totalInstrumentalness / numTracks;
  
    const results = {};
  
    // Genre estimation based on some arbitrary rules
    if (avgEnergy > 0.7 && avgDanceability > 0.7) {
        results.genre = 'Dance Party';
    } else if (avgSpeechiness > 0.6) {
        results.genre = 'Hip-Hop and Rap';
    } else if (avgInstrumentalness > 0.5) {
        results.genre = 'Classical and Instrumental';
    } else if (avgTempo < 100) {
        results.genre = 'Slow Rock and Blues';
    } else {
        results.genre = 'Pop';
    }
  
    // Mood estimation based on valence and energy
    if (avgValence >= 0.6 && avgEnergy >= 0.6) {
        results.mood = 'Happy/Energetic';
    } else if (avgValence >= 0.6 && avgEnergy < 0.6) {
        results.mood = 'Happy/Relaxed';
    } else if (avgValence >= 0.4 && avgEnergy >= 0.6) {
        results.mood = 'Neutral/Energetic';
    } else if (avgValence >= 0.4 && avgEnergy < 0.6) {
        results.mood = 'Neutral/Relaxed';
    } else if (avgValence < 0.4 && avgEnergy >= 0.6) {
        results.mood = 'Sad/Energetic';
    } else {
        results.mood = 'Sad/Relaxed';
    }
  
    return results;
  }  
