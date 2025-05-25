import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

import { getLibraryContent } from '../api/plexAPI';
import { usePlexStore } from '../stores/plexStore';
import { MediaItem, MediaLibrary } from '../types/plex';
import MediaGrid from '../components/media/MediaGrid';

const Library: React.FC = () => {
  const { libraryId } = useParams<{ libraryId: string }>();
  const { selectedServer, libraries } = usePlexStore();
  
  const [library, setLibrary] = useState<MediaLibrary | null>(null);
  const [content, setContent] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Find library info
    if (libraries.length > 0 && libraryId) {
      const foundLibrary = libraries.find(lib => lib.id === libraryId);
      if (foundLibrary) {
        setLibrary(foundLibrary);
      }
    }
  }, [libraries, libraryId]);
  
  useEffect(() => {
    const fetchLibraryContent = async () => {
      if (!selectedServer || !libraryId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const items = await getLibraryContent(selectedServer, libraryId);
        setContent(items);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading library content:', error);
        setError('Failed to load library content. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchLibraryContent();
  }, [selectedServer, libraryId]);
  
  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 p-6 rounded-xl max-w-md mx-auto text-center"
        >
          <AlertCircle size={48} className="mx-auto mb-4 text-error-500" />
          <h2 className="text-xl font-bold mb-2">Error</h2>
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
      <h1 className="text-2xl font-bold mb-6">{library?.title || 'Library'}</h1>
      
      <MediaGrid
        title="All Items"
        items={content}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Library;