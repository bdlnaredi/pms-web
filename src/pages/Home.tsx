import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

import MediaCarousel from '../components/media/MediaCarousel';
import MediaGrid from '../components/media/MediaGrid';

import { usePlexStore } from '../stores/plexStore';
import { useAppStore } from '../stores/appStore';
import { getRecentMedia, getLibraries } from '../api/plexAPI';

const Home: React.FC = () => {
  const { selectedServer, recentMedia, setRecentMedia, setLibraries } = usePlexStore();
  const { isOfflineMode } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedServer || isOfflineMode) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Get recent media
        const media = await getRecentMedia(selectedServer);
        setRecentMedia(media);
        
        // Get libraries
        const libraries = await getLibraries(selectedServer);
        setLibraries(libraries);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading home data:', error);
        setError('Failed to load content. Please check your connection.');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [selectedServer, isOfflineMode, setRecentMedia, setLibraries]);
  
  // Group media by type
  const recentMovies = recentMedia.filter(item => item.type === 'movie');
  const recentShows = recentMedia.filter(item => item.type === 'episode');
  
  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 p-6 rounded-xl max-w-md mx-auto text-center"
        >
          <AlertCircle size={48} className="mx-auto mb-4 text-error-500" />
          <h2 className="text-xl font-bold mb-2">Connection Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="pb-8">
      <h1 className="text-2xl font-bold mb-6">Home</h1>
      
      {isOfflineMode && (
        <div className="bg-warning-900/50 border border-warning-800 text-warning-200 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <AlertCircle size={20} className="mr-2" />
            <p>You're in offline mode. Only downloaded content will be available.</p>
          </div>
        </div>
      )}
      
      {/* Featured content carousel */}
      <MediaCarousel
        title="Recently Added"
        items={recentMedia.slice(0, 10)}
      />
      
      {/* Recent movies */}
      <MediaGrid
        title="Recent Movies"
        items={recentMovies}
        isLoading={isLoading}
      />
      
      {/* Recent TV shows */}
      <MediaGrid
        title="Recent Episodes"
        items={recentShows}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Home;