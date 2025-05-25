import { create } from 'zustand';
import { MediaItem } from '../types/plex';

interface PlayerState {
  currentMedia: MediaItem | null;
  isPlaying: boolean;
  isPiPActive: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playbackRate: number;
  
  setCurrentMedia: (media: MediaItem | null) => void;
  setPlaying: (playing: boolean) => void;
  setPiPActive: (active: boolean) => void;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setPlaybackRate: (rate: number) => void;
  togglePlay: () => void;
  togglePiP: () => void;
  toggleMute: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentMedia: null,
  isPlaying: false,
  isPiPActive: false,
  isMuted: false,
  volume: 1,
  currentTime: 0,
  duration: 0,
  playbackRate: 1,
  
  setCurrentMedia: (media) => set({ currentMedia: media }),
  
  setPlaying: (playing) => set({ isPlaying: playing }),
  
  setPiPActive: (active) => set({ isPiPActive: active }),
  
  setMuted: (muted) => set({ isMuted: muted }),
  
  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
  
  setCurrentTime: (time) => set({ currentTime: time }),
  
  setDuration: (duration) => set({ duration: duration }),
  
  setPlaybackRate: (rate) => set({ playbackRate: rate }),
  
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  togglePiP: () => set((state) => ({ isPiPActive: !state.isPiPActive })),
  
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
}));