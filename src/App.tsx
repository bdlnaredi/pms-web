import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Components
import Layout from './components/layout/Layout';
import Splash from './components/splash/Splash';

// Pages
import Home from './pages/Home';
import Library from './pages/Library';
import Player from './pages/Player';
import Settings from './pages/Settings';
import ServerSelect from './pages/ServerSelect';

// Stores
import { useAppStore } from './stores/appStore';
import { usePlexStore } from './stores/plexStore';

const App: React.FC = () => {
  const { isLoading, setLoading } = useAppStore();
  const { servers, selectedServer } = usePlexStore();
  
  useEffect(() => {
    // Simulate splash screen
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [setLoading]);

  if (isLoading) {
    return <Splash />;
  }
  
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Redirect to server selection if no server is selected */}
        {!selectedServer && servers.length === 0 && (
          <Route path="*" element={<Navigate to="/servers" replace />} />
        )}
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="library/:libraryId" element={<Library />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        <Route path="/servers" element={<ServerSelect />} />
        <Route path="/player/:mediaId" element={<Player />} />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export default App;