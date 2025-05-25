export interface PlexServer {
  id: string;
  name: string;
  address: string;
  port: number;
  version: string;
  accessToken?: string;
  local: boolean;
  connections: PlexConnection[];
}

export interface PlexConnection {
  protocol: string;
  address: string;
  port: number;
  uri: string;
  local: boolean;
}

export interface MediaLibrary {
  id: string;
  title: string;
  type: 'movie' | 'show' | 'music' | 'photo';
  thumb?: string;
  art?: string;
  count: number;
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'movie' | 'episode' | 'track' | 'photo';
  thumb?: string;
  art?: string;
  summary?: string;
  year?: number;
  duration: number;
  viewOffset?: number;
  lastViewedAt?: number;
  rating?: number;
  media: MediaFormat[];
  grandparentTitle?: string; // Show title for episodes
  parentTitle?: string; // Season title for episodes
  parentIndex?: number; // Season number
  index?: number; // Episode number
}

export interface MediaFormat {
  id: string;
  duration: number;
  bitrate: number;
  width: number;
  height: number;
  aspectRatio: number;
  audioChannels: number;
  audioCodec: string;
  videoCodec: string;
  videoResolution: string;
  container: string;
  videoFrameRate: string;
  parts: MediaPart[];
}

export interface MediaPart {
  id: string;
  key: string;
  duration: number;
  file: string;
  size: number;
  container: string;
  streams: MediaStream[];
}

export interface MediaStream {
  id: string;
  streamType: number; // 1 = video, 2 = audio, 3 = subtitle
  codec: string;
  index: number;
  bitrate?: number;
  language?: string;
  languageCode?: string;
  title?: string;
  selected: boolean;
}