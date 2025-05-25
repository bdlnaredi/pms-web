import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const Splash: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-950 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0, -5, 0] 
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
          className="bg-primary-600 p-4 rounded-2xl mb-4"
        >
          <Play size={48} className="text-white" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-white"
        >
          Plex Media PWA
        </motion.h1>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 200 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="h-1 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full mt-4"
        />
      </motion.div>
    </div>
  );
};

export default Splash;