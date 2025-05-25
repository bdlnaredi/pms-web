import { create } from 'zustand';
import { PlexServer, MediaItem, MediaLibrary } from '../types/plex';

interface PlexState {
  servers: PlexServer[];
  selectedServer: PlexServer | null;
  libraries: MediaLibrary[];
  recentMedia: MediaItem[];
  popularMedia: MediaItem[];
  setServers: (servers: PlexServer[]) => void;
  selectServer: (server: PlexServer) => void;
  setLibraries: (libraries: MediaLibrary[]) => void;
  setRecentMedia: (media: MediaItem[]) => void;
  setPopularMedia: (media: MediaItem[]) => void;
  clearPlexData: () => void;
}

export const usePlexStore = create<PlexState>((set) => ({
  servers: [],
  selectedServer: null,
  libraries: [],
  recentMedia: [],
  popularMedia: [],
  
  setServers: (servers) => set({ servers }),
  
  selectServer: (server) => set({ selectedServer: server }),
  
  setLibraries: (libraries) => set({ libraries }),
  
  setRecentMedia: (media) => set({ recentMedia: media }),
  
  setPopularMedia: (media) => set({ popularMedia: media }),
  
  clearPlexData: () => set({
    selectedServer: null,
    libraries: [],
    recentMedia: [],
    popularMedia: []
  }),
}));