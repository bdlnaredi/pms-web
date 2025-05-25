import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Film, Tv, Music, Settings, Play, Server, HardDrive } from 'lucide-react';
import { usePlexStore } from '../../stores/plexStore';

const Sidebar: React.FC = () => {
  const { libraries } = usePlexStore();
  
  // Filter libraries by type
  const movieLibraries = libraries.filter(lib => lib.type === 'movie');
  const tvLibraries = libraries.filter(lib => lib.type === 'show');
  const musicLibraries = libraries.filter(lib => lib.type === 'music');
  
  return (
    <motion.aside
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 250, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-900 w-64 hidden md:flex flex-col border-r border-gray-800"
    >
      <div className="p-4 flex items-center space-x-3 border-b border-gray-800">
        <div className="bg-primary-600 p-2 rounded-lg">
          <Play size={24} className="text-white" />
        </div>
        <h1 className="text-xl font-bold">Plex Media PWA</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex items-center px-4 py-3 text-sm ${isActive ? 'bg-gray-800 text-primary-400' : 'text-gray-300 hover:bg-gray-800/50'}`
          }
        >
          <Home size={20} className="mr-3" />
          Home
        </NavLink>

        {/* Server Management */}
        <div className="mt-4">
          <h3 className="px-4 py-2 text-xs uppercase tracking-wider text-gray-500 font-semibold">Servers</h3>
          <NavLink
            to="/servers"
            className={({ isActive }) => 
              `flex items-center px-4 py-3 text-sm ${isActive ? 'bg-gray-800 text-primary-400' : 'text-gray-300 hover:bg-gray-800/50'}`
            }
          >
            <Server size={20} className="mr-3" />
            Manage Servers
          </NavLink>
        </div>

        {/* Local Media */}
        <div className="mt-4">
          <h3 className="px-4 py-2 text-xs uppercase tracking-wider text-gray-500 font-semibold">Local Media</h3>
          <NavLink
            to="/local"
            className={({ isActive }) => 
              `flex items-center px-4 py-3 text-sm ${isActive ? 'bg-gray-800 text-primary-400' : 'text-gray-300 hover:bg-gray-800/50'}`
            }
          >
            <HardDrive size={20} className="mr-3" />
            Browse Local Files
          </NavLink>
        </div>
        
        {movieLibraries.length > 0 && (
          <div className="mt-4">
            <h3 className="px-4 py-2 text-xs uppercase tracking-wider text-gray-500 font-semibold">Movies</h3>
            {movieLibraries.map(library => (
              <NavLink
                key={library.id}
                to={`/library/${library.id}`}
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 text-sm ${isActive ? 'bg-gray-800 text-primary-400' : 'text-gray-300 hover:bg-gray-800/50'}`
                }
              >
                <Film size={20} className="mr-3" />
                {library.title}
              </NavLink>
            ))}
          </div>
        )}
        
        {tvLibraries.length > 0 && (
          <div className="mt-4">
            <h3 className="px-4 py-2 text-xs uppercase tracking-wider text-gray-500 font-semibold">TV Shows</h3>
            {tvLibraries.map(library => (
              <NavLink
                key={library.id}
                to={`/library/${library.id}`}
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 text-sm ${isActive ? 'bg-gray-800 text-primary-400' : 'text-gray-300 hover:bg-gray-800/50'}`
                }
              >
                <Tv size={20} className="mr-3" />
                {library.title}
              </NavLink>
            ))}
          </div>
        )}
        
        {musicLibraries.length > 0 && (
          <div className="mt-4">
            <h3 className="px-4 py-2 text-xs uppercase tracking-wider text-gray-500 font-semibold">Music</h3>
            {musicLibraries.map(library => (
              <NavLink
                key={library.id}
                to={`/library/${library.id}`}
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 text-sm ${isActive ? 'bg-gray-800 text-primary-400' : 'text-gray-300 hover:bg-gray-800/50'}`
                }
              >
                <Music size={20} className="mr-3" />
                {library.title}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <NavLink
          to="/settings"
          className={({ isActive }) => 
            `flex items-center px-4 py-3 text-sm ${isActive ? 'bg-gray-800 text-primary-400' : 'text-gray-300 hover:bg-gray-800/50'} rounded-lg`
          }
        >
          <Settings size={20} className="mr-3" />
          Settings
        </NavLink>
      </div>
    </motion.aside>
  );
};

export default Sidebar;