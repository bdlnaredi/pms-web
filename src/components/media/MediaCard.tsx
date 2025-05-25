import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Info } from 'lucide-react';
import { MediaItem } from '../../types/plex';

interface MediaCardProps {
  item: MediaItem;
}

const MediaCard: React.FC<MediaCardProps> = ({ item }) => {
  const navigate = useNavigate();
  
  const handlePlay = () => {
    navigate(`/player/${item.id}`);
  };
  
  // Calculate progress if the media has been partially watched
  const progress = item.viewOffset && item.duration 
    ? (item.viewOffset / item.duration) * 100 
    : 0;
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="relative group"
    >
      <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-gray-800">
        {item.thumb ? (
          <img 
            src={item.thumb} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-700">
            <span className="text-gray-400">{item.title[0]}</span>
          </div>
        )}
        
        {/* Overlay with play button on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlay}
            className="bg-primary-600 p-3 rounded-full text-white"
          >
            <Play size={24} />
          </motion.button>
        </div>
        
        {/* Progress bar for partially watched content */}
        {progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
            <div 
              className="h-full bg-primary-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
      
      <div className="mt-2">
        <h3 className="font-medium text-sm text-white truncate">{item.title}</h3>
        {item.grandparentTitle && (
          <p className="text-xs text-gray-400 truncate">{item.grandparentTitle}</p>
        )}
        {item.year && !item.grandparentTitle && (
          <p className="text-xs text-gray-400">{item.year}</p>
        )}
      </div>
    </motion.div>
  );
};

export default MediaCard;