import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Server, Search, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

import { usePlexStore } from '../stores/plexStore';
import { discoverServers } from '../api/plexAPI';
import { PlexServer } from '../types/plex';

const ServerSelect: React.FC = () => {
  const navigate = useNavigate();
  const { servers, setServers, selectServer } = usePlexStore();
  
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [manualError, setManualError] = useState<string | null>(null);
  
  useEffect(() => {
    // If there are servers and user hasn't selected one yet, discover servers
    if (servers.length === 0) {
      discoverPlex();
    }
  }, [servers]);
  
  const discoverPlex = async () => {
    setIsDiscovering(true);
    
    try {
      const discoveredServers = await discoverServers();
      setServers(discoveredServers);
    } catch (error) {
      console.error('Discovery error:', error);
    } finally {
      setIsDiscovering(false);
    }
  };
  
  const handleServerSelect = (server: PlexServer) => {
    selectServer(server);
    navigate('/');
  };
  
  const handleManualConnect = () => {
    setManualError(null);
    
    if (!manualUrl) {
      setManualError('Please enter a server URL');
      return;
    }
    
    // Basic URL validation
    try {
      const url = new URL(manualUrl);
      
      // Create a manual server entry
      const manualServer: PlexServer = {
        id: 'manual',
        name: 'Manual Server',
        address: url.hostname,
        port: parseInt(url.port) || 32400,
        version: 'Unknown',
        local: true,
        connections: [{
          protocol: url.protocol.replace(':', ''),
          address: url.hostname,
          port: parseInt(url.port) || 32400,
          uri: manualUrl,
          local: true
        }]
      };
      
      // Add to servers list and select it
      setServers([...servers, manualServer]);
      handleServerSelect(manualServer);
    } catch (error) {
      setManualError('Invalid server URL. Please enter a valid URL including protocol (http:// or https://)');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-block bg-primary-600 p-4 rounded-2xl mb-4">
          <Play size={48} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold">Plex Media PWA</h1>
        <p className="text-gray-400 mt-2">Connect to your Plex Media Server to get started</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-md mx-auto w-full bg-gray-900 rounded-xl p-6 shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Server size={20} className="mr-2" />
          Connect to Server
        </h2>
        
        {/* Discovered servers */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Discovered Servers</h3>
            <button
              onClick={discoverPlex}
              className="text-primary-400 text-sm hover:underline flex items-center"
              disabled={isDiscovering}
            >
              {isDiscovering ? (
                <>
                  <Loader2 size={14} className="mr-1 animate-spin" />
                  Scanning...
                </>
              ) : (
                'Refresh'
              )}
            </button>
          </div>
          
          {servers.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              {isDiscovering ? (
                <div className="flex flex-col items-center">
                  <Loader2 size={24} className="animate-spin mb-2 text-primary-500" />
                  <p className="text-gray-400">Scanning your network for Plex servers...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <AlertCircle size={24} className="mb-2 text-gray-500" />
                  <p className="text-gray-400">No Plex servers found on your network</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {servers.map(server => (
                <button
                  key={server.id}
                  onClick={() => handleServerSelect(server)}
                  className="w-full bg-gray-800 hover:bg-gray-700 rounded-lg p-4 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center">
                    <div className="bg-primary-900 p-2 rounded-lg mr-3">
                      <Server size={16} className="text-primary-400" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium">{server.name}</h4>
                      <p className="text-xs text-gray-400">{server.address}:{server.port}</p>
                    </div>
                  </div>
                  <CheckCircle size={18} className="text-primary-500" />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Manual connection */}
        <div>
          <h3 className="font-medium mb-3">Manual Connection</h3>
          <div className="space-y-3">
            <div>
              <label htmlFor="serverUrl" className="text-sm text-gray-400 block mb-1">
                Plex Server URL (with port)
              </label>
              <div className="relative">
                <input
                  id="serverUrl"
                  type="text"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="http://192.168.1.100:32400"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              {manualError && (
                <p className="text-error-500 text-sm mt-1">{manualError}</p>
              )}
            </div>
            
            <button
              onClick={handleManualConnect}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
            >
              <Search size={16} className="mr-2" />
              Connect Manually
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ServerSelect;