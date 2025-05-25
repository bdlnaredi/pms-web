import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Wifi, WifiOff, LogOut, Trash2, Github, Download, Info } from 'lucide-react';

import { useAppStore } from '../stores/appStore';
import { usePlexStore } from '../stores/plexStore';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode, isOfflineMode, toggleOfflineMode } = useAppStore();
  const { selectedServer, clearPlexData } = usePlexStore();
  
  const handleDisconnect = () => {
    if (confirm('Are you sure you want to disconnect from this server?')) {
      clearPlexData();
      navigate('/servers');
    }
  };
  
  const handleClearCache = () => {
    if (confirm('Are you sure you want to clear all cached data? This will remove any downloaded content.')) {
      // In a real app, we would clear IndexedDB, etc.
      alert('Cache cleared successfully');
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto pb-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Appearance */}
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {isDarkMode ? <Moon size={20} className="mr-3" /> : <Sun size={20} className="mr-3" />}
                <span>Dark Mode</span>
              </div>
              
              <div 
                className={`w-12 h-6 rounded-full p-1 cursor-pointer ${isDarkMode ? 'bg-primary-600' : 'bg-gray-700'}`}
                onClick={toggleDarkMode}
              >
                <div 
                  className={`w-4 h-4 rounded-full bg-white transform transition-transform ${isDarkMode ? 'translate-x-6' : ''}`}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Connection */}
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Connection</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {isOfflineMode ? <WifiOff size={20} className="mr-3" /> : <Wifi size={20} className="mr-3" />}
                <span>Offline Mode</span>
              </div>
              
              <div 
                className={`w-12 h-6 rounded-full p-1 cursor-pointer ${isOfflineMode ? 'bg-primary-600' : 'bg-gray-700'}`}
                onClick={toggleOfflineMode}
              >
                <div 
                  className={`w-4 h-4 rounded-full bg-white transform transition-transform ${isOfflineMode ? 'translate-x-6' : ''}`}
                />
              </div>
            </div>
            
            {selectedServer && (
              <div className="pt-2 border-t border-gray-800">
                <h3 className="text-sm text-gray-400 mb-2">Connected Server</h3>
                <div className="bg-gray-800 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium">{selectedServer.name}</p>
                    <p className="text-xs text-gray-400">{selectedServer.address}:{selectedServer.port}</p>
                  </div>
                  
                  <button 
                    onClick={handleDisconnect}
                    className="text-error-500 hover:text-error-400 p-2"
                    title="Disconnect"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Storage */}
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Storage</h2>
          
          <div className="space-y-4">
            <div className="pt-2">
              <h3 className="text-sm text-gray-400 mb-2">Downloaded Content</h3>
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Storage Used</span>
                  <span className="text-sm font-medium">0 MB</span>
                </div>
                
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: '0%' }} />
                </div>
              </div>
              
              <div className="mt-4 flex">
                <button 
                  onClick={handleClearCache}
                  className="text-error-500 hover:text-error-400 text-sm flex items-center"
                >
                  <Trash2 size={16} className="mr-1" />
                  Clear Cache
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* About */}
        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">About</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Info size={20} className="mr-3" />
                <span>Version</span>
              </div>
              <span className="text-gray-400">0.1.0</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Github size={20} className="mr-3" />
                <span>Source Code</span>
              </div>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-400 hover:underline"
              >
                GitHub
              </a>
            </div>
            
            <div className="pt-2 border-t border-gray-800 text-sm text-gray-400">
              <p>Plex Media PWA is not affiliated with Plex Inc.</p>
              <p className="mt-1">This is an open-source project.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;