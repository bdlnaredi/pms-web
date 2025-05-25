import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward, PictureInPicture, PictureInPicture as PictureInPictureOff, X, Settings } from 'lucide-react';

import { MediaItem } from '../../types/plex';
import { PlexServer } from '../../types/plex';
import { getStreamUrl } from '../../api/plexAPI';
import { usePlayerStore } from '../../stores/playerStore';

interface VideoPlayerProps {
  mediaItem: MediaItem;
  server: PlexServer;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ mediaItem, server }) => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { 
    isPlaying, setPlaying,
    isPiPActive, setPiPActive,
    isMuted, setMuted,
    volume, setVolume,
    currentTime, setCurrentTime,
    duration, setDuration,
    playbackRate, setPlaybackRate,
    togglePlay, toggleMute
  } = usePlayerStore();
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [streamUrl, setStreamUrl] = useState('');
  
  // Get stream URL
  useEffect(() => {
    const url = getStreamUrl(server, mediaItem);
    setStreamUrl(url);
  }, [server, mediaItem]);
  
  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    
    if (!video) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };
    
    const handleDurationChange = () => {
      setDuration(video.duration);
    };
    
    const handlePlay = () => {
      setPlaying(true);
    };
    
    const handlePause = () => {
      setPlaying(false);
    };
    
    const handleEnded = () => {
      setPlaying(false);
      // Navigate back
      navigate(-1);
    };
    
    const handleVolumeChange = () => {
      setMuted(video.muted);
      setVolume(video.volume);
    };
    
    // Add event listeners
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('volumechange', handleVolumeChange);
    
    // Set initial values
    setCurrentTime(video.currentTime);
    setDuration(video.duration || 0);
    setMuted(video.muted);
    setVolume(video.volume);
    
    // Remove event listeners on cleanup
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [setCurrentTime, setDuration, setPlaying, setMuted, setVolume, navigate]);
  
  // Handle play/pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying && video.paused) {
      video.play().catch(error => {
        console.error('Error playing video:', error);
        setPlaying(false);
      });
    } else if (!isPlaying && !video.paused) {
      video.pause();
    }
  }, [isPlaying, setPlaying]);
  
  // Handle volume/mute
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.volume = volume;
    video.muted = isMuted;
  }, [volume, isMuted]);
  
  // Handle playback rate
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.playbackRate = playbackRate;
  }, [playbackRate]);
  
  // Handle Picture-in-Picture
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handlePiPChange = () => {
      setPiPActive(document.pictureInPictureElement === video);
    };
    
    video.addEventListener('enterpictureinpicture', handlePiPChange);
    video.addEventListener('leavepictureinpicture', handlePiPChange);
    
    return () => {
      video.removeEventListener('enterpictureinpicture', handlePiPChange);
      video.removeEventListener('leavepictureinpicture', handlePiPChange);
    };
  }, [setPiPActive]);
  
  // Handle fullscreen
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement === player ||
        document.webkitFullscreenElement === player
      );
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Handle controls auto-hide
  useEffect(() => {
    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      setShowControls(true);
      
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying && !isSettingsOpen) {
          setShowControls(false);
        }
      }, 3000);
    };
    
    resetControlsTimeout();
    
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, isSettingsOpen]);
  
  // Format time (seconds to MM:SS)
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    const player = playerRef.current;
    if (!player) return;
    
    if (!isFullscreen) {
      if (player.requestFullscreen) {
        player.requestFullscreen();
      } else if ((player as any).webkitRequestFullscreen) {
        (player as any).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  };
  
  // Toggle Picture-in-Picture
  const togglePiP = async () => {
    const video = videoRef.current;
    if (!video) return;
    
    try {
      if (isPiPActive) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch (error) {
      console.error('PiP error:', error);
    }
  };
  
  // Close player
  const handleClose = () => {
    navigate(-1);
  };
  
  // Skip forward/backward
  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = Math.min(video.currentTime + 10, video.duration);
  };
  
  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = Math.max(video.currentTime - 10, 0);
  };
  
  // Handle click on video
  const handleVideoClick = () => {
    togglePlay();
  };
  
  // Handle mouse move
  const handleMouseMove = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    setShowControls(true);
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !isSettingsOpen) {
        setShowControls(false);
      }
    }, 3000);
  };
  
  return (
    <div 
      ref={playerRef}
      className="relative w-full h-full bg-black"
      onMouseMove={handleMouseMove}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        src={streamUrl}
        onClick={handleVideoClick}
        autoPlay
        playsInline
      />
      
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-between"
          >
            {/* Top controls */}
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                <h2 className="text-white text-lg font-bold truncate max-w-[70vw]">
                  {mediaItem.title}
                </h2>
              </div>
              
              <button
                onClick={handleClose}
                className="text-white p-2 hover:bg-white/20 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Center play/pause */}
            <div className="flex-1 flex items-center justify-center">
              <button
                onClick={togglePlay}
                className="text-white p-4 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
              </button>
            </div>
            
            {/* Bottom controls */}
            <div className="p-4 space-y-2">
              {/* Progress bar */}
              <div className="flex items-center space-x-2">
                <span className="text-white text-sm">
                  {formatTime(currentTime)}
                </span>
                
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 accent-primary-500 h-1 bg-gray-600 rounded-full"
                />
                
                <span className="text-white text-sm">
                  {formatTime(duration)}
                </span>
              </div>
              
              {/* Control buttons */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={togglePlay}
                    className="text-white p-2 hover:bg-white/20 rounded-full"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  
                  <button
                    onClick={skipBackward}
                    className="text-white p-2 hover:bg-white/20 rounded-full"
                  >
                    <SkipBack size={20} />
                  </button>
                  
                  <button
                    onClick={skipForward}
                    className="text-white p-2 hover:bg-white/20 rounded-full"
                  >
                    <SkipForward size={20} />
                  </button>
                  
                  <div className="flex items-center space-x-1 group relative">
                    <button
                      onClick={toggleMute}
                      className="text-white p-2 hover:bg-white/20 rounded-full"
                    >
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    
                    <div className="hidden group-hover:block absolute left-10 bottom-0 bg-gray-800 p-2 rounded-lg">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-24 accent-primary-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={togglePiP}
                    className="text-white p-2 hover:bg-white/20 rounded-full"
                    title={isPiPActive ? "Exit Picture-in-Picture" : "Enter Picture-in-Picture"}
                  >
                    {isPiPActive ? <PictureInPictureOff size={20} /> : <PictureInPicture size={20} />}
                  </button>
                  
                  <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className="text-white p-2 hover:bg-white/20 rounded-full"
                  >
                    <Settings size={20} />
                  </button>
                  
                  <button
                    onClick={toggleFullscreen}
                    className="text-white p-2 hover:bg-white/20 rounded-full"
                  >
                    {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Settings panel */}
            <AnimatePresence>
              {isSettingsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-16 right-4 bg-gray-800 rounded-lg p-4 w-64"
                >
                  <h3 className="text-white font-semibold mb-2">Playback Speed</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                      <button
                        key={rate}
                        onClick={() => setPlaybackRate(rate)}
                        className={`p-2 rounded-lg text-sm ${
                          playbackRate === rate ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoPlayer;