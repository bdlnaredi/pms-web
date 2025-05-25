import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Search, Bell, X, Wifi, WifiOff } from 'lucide-react';
import { usePlexStore } from '../../stores/plexStore';
import { useAppStore } from '../../stores/appStore';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { selectedServer } = usePlexStore();
  const { isOfflineMode, toggleOfflineMode } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };
  
  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <button 
            className="md:hidden text-gray-300 hover:text-white mr-4"
            onClick={toggleMobileMenu}
          >
            <Menu size={24} />
          </button>
          
          {selectedServer && (
            <div className="hidden md:block">
              <h2 className="text-sm font-medium text-gray-400">Connected to</h2>
              <p className="text-white font-semibold">{selectedServer.name}</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleOfflineMode}
            className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-800"
            title={isOfflineMode ? "Online Mode" : "Offline Mode"}
          >
            {isOfflineMode ? (
              <WifiOff size={20} className="text-error-400" />
            ) : (
              <Wifi size={20} className="text-success-400" />
            )}
          </button>
          
          <button 
            onClick={toggleSearch}
            className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-800"
          >
            <Search size={20} />
          </button>
          
          <button className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-800">
            <Bell size={20} />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-gray-900 border-t border-gray-800"
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Menu</h3>
              <button onClick={toggleMobileMenu}>
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            
            <nav className="mt-4 space-y-2">
              <button 
                onClick={() => {
                  navigate('/');
                  toggleMobileMenu();
                }}
                className="block w-full text-left px-4 py-3 text-white hover:bg-gray-800 rounded-lg"
              >
                Home
              </button>
              
              <button 
                onClick={() => {
                  navigate('/settings');
                  toggleMobileMenu();
                }}
                className="block w-full text-left px-4 py-3 text-white hover:bg-gray-800 rounded-lg"
              >
                Settings
              </button>
            </nav>
          </div>
        </motion.div>
      )}
      
      {/* Search Bar */}
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="border-t border-gray-800 p-4"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search for movies, shows, and more..."
              className="w-full bg-gray-800 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            <button 
              onClick={toggleSearch}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;