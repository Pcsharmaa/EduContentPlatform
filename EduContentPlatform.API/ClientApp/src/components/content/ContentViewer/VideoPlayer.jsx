import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ 
  url, 
  title, 
  autoplay = false, 
  controls = true,
  width = '100%',
  height = 'auto',
  onProgress,
  onEnded,
  onError,
}) => {
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(autoplay);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [fullscreen, setFullscreen] = useState(false);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume === 0) {
      setMuted(true);
    } else if (muted) {
      setMuted(false);
    }
  };

  const handleMute = () => {
    setMuted(!muted);
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e) => {
    const newPlayed = parseFloat(e.target.value);
    setPlayed(newPlayed);
  };

  const handleSeekMouseUp = (e) => {
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.seekTo(parseFloat(e.target.value));
    }
  };

  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played);
    }
    if (onProgress) onProgress(state);
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const playbackRates = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <div className={`video-player-container ${fullscreen ? 'fullscreen' : ''}`}>
      <div className="video-player">
        <ReactPlayer
          ref={playerRef}
          url={url}
          playing={playing}
          volume={volume}
          muted={muted}
          playbackRate={playbackRate}
          width={width}
          height={height}
          controls={controls}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={onEnded}
          onError={onError}
          onProgress={handleProgress}
          onDuration={handleDuration}
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload',
                disablePictureInPicture: true,
              },
            },
          }}
        />
        
        {!controls && (
          <div className="custom-controls">
            <div className="controls-top">
              {title && (
                <div className="video-title">
                  {title}
                </div>
              )}
            </div>
            
            <div className="controls-bottom">
              <div className="progress-bar">
                <input
                  type="range"
                  min={0}
                  max={0.999999}
                  step="any"
                  value={played}
                  onMouseDown={handleSeekMouseDown}
                  onChange={handleSeekChange}
                  onMouseUp={handleSeekMouseUp}
                  className="progress-slider"
                />
              </div>
              
              <div className="controls-buttons">
                <div className="left-controls">
                  <button onClick={handlePlayPause} className="control-button">
                    {playing ? '❚❚' : '▶'}
                  </button>
                  
                  <div className="volume-control">
                    <button onClick={handleMute} className="control-button">
                      {muted || volume === 0 ? '🔇' : volume > 0.5 ? '🔊' : '🔉'}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="volume-slider"
                    />
                  </div>
                  
                  <div className="time-display">
                    {formatTime(duration * played)} / {formatTime(duration)}
                  </div>
                </div>
                
                <div className="right-controls">
                  <select
                    value={playbackRate}
                    onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                    className="playback-rate-select"
                  >
                    {playbackRates.map(rate => (
                      <option key={rate} value={rate}>
                        {rate}x
                      </option>
                    ))}
                  </select>
                  
                  <button onClick={toggleFullscreen} className="control-button">
                    {fullscreen ? '⤓' : '⤢'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;