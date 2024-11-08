import React, { useState, useRef, useEffect } from 'react';
import { Music2, Play, Pause, Volume2, VolumeX } from 'lucide-react';

const Alert = ({ children, className }) => (
  <div className={`rounded-lg border p-4 z-50 ${className}`}>
    {children}
  </div>
);

const AlertDescription = ({ children }) => (
  <div className="text-sm text-gray-700">
    {children}
  </div>
);

const playlists = {
  'Anime Favorites': [
    {
      title: 'One Small Step (Dr. Stone)',
      artist: 'Laura Pitt-Pulford',
      duration: '4:11', 
      audioUrl: '/onesmallstep.mp3'  // Using absolute path
    }
  ],
  'Calming Meditation': [
    {
      title: 'Isabella s Lullaby',
      artist: 'Takahiro Obata',
      duration: '3:45',
      audioUrl: '/lullaby.mp3'  // Using absolute path
    }
  ]
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default function MusicTherapy() {
  const [currentPlaylist, setCurrentPlaylist] = useState('Anime Favorites');
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showAudioAlert, setShowAudioAlert] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);
  
  const audioRef = useRef(null);
  const currentTrack = playlists[currentPlaylist][currentTrackIndex];

  // Effect to handle audio playing state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Audio playback failed:", error);
            setError("Failed to play audio. Please check if the audio file exists.");
            setIsPlaying(false);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Effect to handle muting
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setError(null); // Clear any previous errors
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current?.src) {
      setShowAudioAlert(true);
      setTimeout(() => setShowAudioAlert(false), 3000);
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeToggle = () => {
    setIsMuted(!isMuted);
  };

  const handlePlaylistSelect = (playlist) => {
    setCurrentPlaylist(playlist);
    setCurrentTrackIndex(0);
    setIsPlaying(false);
    setCurrentTime(0);
    setError(null);
  };

  const handleAudioError = (e) => {
    console.error("Audio error:", e);
    setError("Failed to load audio file. Please check if the file exists.");
    setIsPlaying(false);
  };

  const displayDuration = duration ? formatTime(duration) : currentTrack.duration;
  const displayCurrentTime = formatTime(currentTime);

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        {showAudioAlert && (
          <div className="fixed top-20 right-4 z-50">
            <Alert className="w-auto max-w-md bg-blue-50 border-blue-200">
              <AlertDescription>
                {error || "Audio playback is not available in this demo. Please check if audio files are properly loaded."}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {error && (
          <div className="fixed top-20 left-4 z-50">
            <Alert className="w-auto max-w-md bg-red-50 border-red-200">
              <AlertDescription className="text-red-600">
                {error}
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="text-center mb-16">
          <Music2 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Music Therapy</h1>
          <p className="text-xl text-gray-600">Find peace and healing through the power of music</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Available Playlists</h2>
            <div className="space-y-4">
              {Object.keys(playlists).map((playlist) => (
                <div
                  key={playlist}
                  onClick={() => handlePlaylistSelect(playlist)}
                  className={`flex items-center justify-between p-4 rounded-xl hover:bg-blue-100 transition cursor-pointer ${
                    currentPlaylist === playlist ? 'bg-blue-200' : 'bg-blue-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {currentPlaylist === playlist && isPlaying ? (
                      <Pause className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Play className="h-5 w-5 text-blue-600" />
                    )}
                    <span className="font-medium">{playlist}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVolumeToggle();
                    }}
                    className="hover:bg-blue-200 p-2 rounded-full"
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Volume2 className="h-5 w-5 text-blue-600" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Now Playing</h2>
            <div className="text-center">
              <div className="relative w-48 h-48 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center group">
                <Music2 className={`h-24 w-24 text-blue-600 ${isPlaying ? 'animate-pulse' : ''}`} />
                {currentPlaylist === 'Anime Favorites' && (
                  <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-10 rounded-full flex items-center justify-center transition-all">
                    <span className="text-blue-600 font-semibold opacity-0 group-hover:opacity-100">
                      Dr. Stone
                    </span>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">{currentTrack.title}</h3>
              <p className="text-gray-600 mb-2">{currentTrack.artist}</p>
              <p className="text-gray-500 mb-6">
                {isPlaying ? `${displayCurrentTime} / ${displayDuration}` : `Duration: ${displayDuration}`}
              </p>
              <div className="flex justify-center items-center gap-4">
                <button 
                  onClick={handlePlayPause}
                  className="p-4 rounded-full bg-blue-600 hover:bg-blue-700 transition"
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8 text-white" />
                  ) : (
                    <Play className="h-8 w-8 text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <audio
          ref={audioRef}
          src={currentTrack.audioUrl}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onError={handleAudioError}
          preload="metadata"
        />
      </div>
    </div>
  );
}