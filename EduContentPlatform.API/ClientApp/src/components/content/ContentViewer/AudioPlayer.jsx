import React, { useState, useRef, useEffect } from 'react';

const AudioPlayer = ({ 
  audioUrl, 
  title, 
  artist, 
  coverImage,
  autoplay = false,
  onPlay,
  onPause,
  onEnded,
  onError,
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          setError(err.message);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
      if (onPause) onPause();
    } else {
      audioRef.current.play();
      if (onPlay) onPlay();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
    setLoading(false);
  };

  const handleError = (e) => {
    setError('Failed to load audio');
    setLoading(false);
    if (onError) onError(e);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (onEnded) onEnded();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playbackRates = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <div className="audio-player">
      {/* Audio element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
        preload="metadata"
      />

      {/* Player UI */}
      <div className="audio-player-container">
        {/* Cover and Info */}
        <div className="audio-player-info">
          <div className="audio-cover">
            {coverImage ? (
              <img 
                src={coverImage} 
                alt={title}
                className="cover-image"
              />
            ) : (
              <div className="cover-placeholder">
                🎵
              </div>
            )}
          </div>
          
          <div className="audio-details">
            <h3 className="audio-title">{title}</h3>
            <p className="audio-artist">{artist || 'Unknown Artist'}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="audio-player-controls">
          {/* Play/Pause */}
          <button 
            onClick={togglePlay} 
            className="play-button"
            disabled={loading || error}
          >
            {isPlaying ? '❚❚' : '▶'}
          </button>

          {/* Progress Bar */}
          <div className="progress-container">
            <span className="current-time">
              {formatTime(currentTime)}
            </span>
            
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="progress-bar"
              disabled={loading || error}
            />
            
            <span className="duration">
              {formatTime(duration)}
            </span>
          </div>

          {/* Volume Control */}
          <div className="volume-control">
            <button 
              onClick={toggleMute} 
              className="volume-button"
            >
              {isMuted || volume === 0 ? '🔇' : volume > 0.5 ? '🔊' : '🔉'}
            </button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>

          {/* Playback Rate */}
          <select
            value={playbackRate}
            onChange={(e) => {
              setPlaybackRate(parseFloat(e.target.value));
              audioRef.current.playbackRate = parseFloat(e.target.value);
            }}
            className="playback-rate-select"
          >
            {playbackRates.map(rate => (
              <option key={rate} value={rate}>
                {rate}x
              </option>
            ))}
          </select>
        </div>

        {/* Loading/Error States */}
        {loading && (
          <div className="audio-loading">
            <div className="loading-spinner"></div>
            <span>Loading audio...</span>
          </div>
        )}

        {error && (
          <div className="audio-error">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;