import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { MediaItem } from '../../types/plex';

interface MediaCarouselProps {
  items: MediaItem[];
  title: string;
}

const MediaCarousel: React.FC<MediaCarouselProps> = ({ items, title }) => {
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { current } = carouselRef;
      const scrollAmount = current.clientWidth * 0.8;
      
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };
  
  if (!items || items.length === 0) {
    return null;
  }
  
  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => scroll('left')}
            className="p-1 rounded-full bg-gray-800 hover:bg-gray-700 text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-1 rounded-full bg-gray-800 hover:bg-gray-700 text-white"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div 
        ref={carouselRef}
        className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map(item => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0 w-[300px]"
          >
            <div className="relative group rounded-lg overflow-hidden aspect-video">
              {item.art ? (
                <img 
                  src={item.art} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-400">{item.title}</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                <div className="p-4 w-full">
                  <h3 className="text-white font-semibold truncate">{item.title}</h3>
                  
                  {item.grandparentTitle && (
                    <p className="text-gray-300 text-sm">{item.grandparentTitle}</p>
                  )}
                  
                  <button
                    onClick={() => navigate(`/player/${item.id}`)}
                    className="mt-2 bg-primary-600 hover:bg-primary-700 text-white py-1 px-4 rounded-full flex items-center text-sm"
                  >
                    <Play size={16} className="mr-1" />
                    Play
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MediaCarousel;