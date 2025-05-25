import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';

import VideoPlayer from '../components/player/VideoPlayer';
import { usePlexStore } from '../stores/plexStore';
import { usePlayerStore } from '../stores/playerStore';
import { getMediaDetails } from '../api/plexAPI';
import { MediaItem } from '../types/plex';

const Player: React.FC = () => {
  const { mediaId } = useParams<{ mediaId: string }>();
  const navigate = useNavigate();
  
  const { selectedServer } = usePlexStore();
  const { setCurrentMedia } = usePlayerStore();
  
  const [mediaItem, setMediaItem] = useState<MediaItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchMediaDetails = async () => {
      if (!selectedServer || !mediaId) {
        navigate('/');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const details = await getMediaDetails(selectedServer, mediaId);
        
        if (!details) {
          throw new Error('Media not found');
        }
        
        setMediaItem(details);
        setCurrentMedia(details);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading media details:', error);
        setError('Failed to load media. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchMediaDetails();
    
    // Cleanup on unmount
    return () => {
      setCurrentMedia(null);
    };
  }, [selectedServer, mediaId, setCurrentMedia, navigate]);
  
  // Handle fullscreen
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate(-1);
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [navigate]);
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <Loader2 size={48} className="text-primary-400 animate-spin" />
      </div>
    );
  }
  
  if (error || !mediaItem) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 p-6 rounded-xl max-w-md mx-auto text-center"
        >
          <AlertCircle size={48} className="mx-auto mb-4 text-error-500" />
          <h2 className="text-xl font-bold mb-2">Playback Error</h2>
          <p className="text-gray-300 mb-4">{error || 'Unable to play this media.'}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black z-50">
      {selectedServer && <VideoPlayer mediaItem={mediaItem} server={selectedServer} />}
    </div>
  );
};

export default Player;