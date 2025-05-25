import { create } from 'zustand';

interface AppState {
  isLoading: boolean;
  isDarkMode: boolean;
  isOfflineMode: boolean;
  setLoading: (loading: boolean) => void;
  toggleDarkMode: () => void;
  toggleOfflineMode: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoading: true,
  isDarkMode: true,
  isOfflineMode: false,
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  toggleDarkMode: () => set((state) => ({ 
    isDarkMode: !state.isDarkMode 
  })),
  
  toggleOfflineMode: () => set((state) => ({ 
    isOfflineMode: !state.isOfflineMode 
  })),
}));