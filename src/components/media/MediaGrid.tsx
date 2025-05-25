import React from 'react';
import { motion } from 'framer-motion';
import MediaCard from './MediaCard';
import { MediaItem } from '../../types/plex';

interface MediaGridProps {
  title: string;
  items: MediaItem[];
  isLoading?: boolean;
}

const MediaGrid: React.FC<MediaGridProps> = ({ title, items, isLoading = false }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  if (isLoading) {
    return (
      <div className="my-8">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-700 rounded-lg aspect-[2/3]"></div>
              <div className="mt-2 bg-gray-700 h-4 rounded w-3/4"></div>
              <div className="mt-1 bg-gray-700 h-3 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (items.length === 0) {
    return null;
  }
  
  return (
    <div className="my-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
      >
        {items.map(item => (
          <motion.div key={item.id} variants={item}>
            <MediaCard item={item} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default MediaGrid;