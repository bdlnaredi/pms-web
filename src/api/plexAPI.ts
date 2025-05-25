import axios from 'axios';
import { PlexServer, MediaLibrary, MediaItem } from '../types/plex';

// Base headers for Plex API
const HEADERS = {
  'Accept': 'application/json',
  'X-Plex-Client-Identifier': 'PlexMediaPWA',
  'X-Plex-Product': 'Plex Media PWA',
  'X-Plex-Version': '0.1.0',
  'X-Plex-Device': 'Web',
  'X-Plex-Platform': 'Web',
};

// Discover Plex servers on local network using GDM (Plex's discovery protocol)
export const discoverServers = async (): Promise<PlexServer[]> => {
  // In a browser environment, we can't use UDP for GDM discovery
  // Instead, we'll simulate discovery with common local IP ranges
  
  // This is a simplified version - in a real app, you'd need to implement 
  // proper discovery using a server-side component
  
  const commonIPs = [
    'http://192.168.1.100:32400',
    'http://192.168.1.101:32400',
    'http://192.168.0.100:32400',
    'http://10.0.0.100:32400',
  ];
  
  const servers: PlexServer[] = [];
  
  for (const baseUrl of commonIPs) {
    try {
      const response = await axios.get(`${baseUrl}/identity`, {
        headers: HEADERS,
        timeout: 2000,
      });
      
      if (response.status === 200) {
        const data = response.data;
        servers.push({
          id: data.machineIdentifier,
          name: data.friendlyName,
          address: new URL(baseUrl).hostname,
          port: parseInt(new URL(baseUrl).port),
          version: data.version,
          local: true,
          connections: [{
            protocol: 'http',
            address: new URL(baseUrl).hostname,
            port: parseInt(new URL(baseUrl).port),
            uri: baseUrl,
            local: true,
          }]
        });
      }
    } catch (error) {
      // Server not found or not responding, continue to next
      console.log(`Server not found at ${baseUrl}`);
    }
  }
  
  return servers;
};

// Get server details
export const getServerDetails = async (server: PlexServer): Promise<PlexServer> => {
  const baseUrl = server.connections[0].uri;
  
  try {
    const response = await axios.get(`${baseUrl}`, {
      headers: {
        ...HEADERS,
        ...(server.accessToken ? { 'X-Plex-Token': server.accessToken } : {}),
      },
    });
    
    if (response.status === 200) {
      // Update server details
      return {
        ...server,
        name: response.data.friendlyName,
        version: response.data.version,
      };
    }
    
    return server;
  } catch (error) {
    console.error('Error getting server details:', error);
    return server;
  }
};

// Get libraries from server
export const getLibraries = async (server: PlexServer): Promise<MediaLibrary[]> => {
  const baseUrl = server.connections[0].uri;
  
  try {
    const response = await axios.get(`${baseUrl}/library/sections`, {
      headers: {
        ...HEADERS,
        ...(server.accessToken ? { 'X-Plex-Token': server.accessToken } : {}),
      },
    });
    
    if (response.status === 200 && response.data.MediaContainer && response.data.MediaContainer.Directory) {
      return response.data.MediaContainer.Directory.map((dir: any) => ({
        id: dir.key,
        title: dir.title,
        type: dir.type,
        thumb: dir.thumb ? `${baseUrl}${dir.thumb}` : undefined,
        art: dir.art ? `${baseUrl}${dir.art}` : undefined,
        count: dir.totalSize || 0,
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error getting libraries:', error);
    return [];
  }
};

// Get recent media
export const getRecentMedia = async (server: PlexServer): Promise<MediaItem[]> => {
  const baseUrl = server.connections[0].uri;
  
  try {
    const response = await axios.get(`${baseUrl}/library/recentlyAdded`, {
      headers: {
        ...HEADERS,
        ...(server.accessToken ? { 'X-Plex-Token': server.accessToken } : {}),
      },
      params: {
        limit: 20,
      },
    });
    
    if (response.status === 200 && response.data.MediaContainer && response.data.MediaContainer.Metadata) {
      return response.data.MediaContainer.Metadata.map((item: any) => transformMediaItem(item, baseUrl));
    }
    
    return [];
  } catch (error) {
    console.error('Error getting recent media:', error);
    return [];
  }
};

// Get library content
export const getLibraryContent = async (server: PlexServer, libraryId: string): Promise<MediaItem[]> => {
  const baseUrl = server.connections[0].uri;
  
  try {
    const response = await axios.get(`${baseUrl}/library/sections/${libraryId}/all`, {
      headers: {
        ...HEADERS,
        ...(server.accessToken ? { 'X-Plex-Token': server.accessToken } : {}),
      },
    });
    
    if (response.status === 200 && response.data.MediaContainer && response.data.MediaContainer.Metadata) {
      return response.data.MediaContainer.Metadata.map((item: any) => transformMediaItem(item, baseUrl));
    }
    
    return [];
  } catch (error) {
    console.error(`Error getting library content for library ${libraryId}:`, error);
    return [];
  }
};

// Get media details
export const getMediaDetails = async (server: PlexServer, mediaId: string): Promise<MediaItem | null> => {
  const baseUrl = server.connections[0].uri;
  
  try {
    const response = await axios.get(`${baseUrl}/library/metadata/${mediaId}`, {
      headers: {
        ...HEADERS,
        ...(server.accessToken ? { 'X-Plex-Token': server.accessToken } : {}),
      },
    });
    
    if (response.status === 200 && response.data.MediaContainer && response.data.MediaContainer.Metadata) {
      return transformMediaItem(response.data.MediaContainer.Metadata[0], baseUrl);
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting media details for ${mediaId}:`, error);
    return null;
  }
};

// Transform Plex API media item to our format
const transformMediaItem = (item: any, baseUrl: string): MediaItem => {
  return {
    id: item.ratingKey,
    title: item.title,
    type: item.type,
    thumb: item.thumb ? `${baseUrl}${item.thumb}` : undefined,
    art: item.art ? `${baseUrl}${item.art}` : undefined,
    summary: item.summary,
    year: item.year,
    duration: item.duration || 0,
    viewOffset: item.viewOffset,
    lastViewedAt: item.lastViewedAt,
    rating: item.rating,
    grandparentTitle: item.grandparentTitle,
    parentTitle: item.parentTitle,
    parentIndex: item.parentIndex,
    index: item.index,
    media: (item.Media || []).map((media: any) => ({
      id: media.id,
      duration: media.duration,
      bitrate: media.bitrate,
      width: media.width,
      height: media.height,
      aspectRatio: media.aspectRatio,
      audioChannels: media.audioChannels,
      audioCodec: media.audioCodec,
      videoCodec: media.videoCodec,
      videoResolution: media.videoResolution,
      container: media.container,
      videoFrameRate: media.videoFrameRate,
      parts: (media.Part || []).map((part: any) => ({
        id: part.id,
        key: part.key,
        duration: part.duration,
        file: part.file,
        size: part.size,
        container: part.container,
        streams: (part.Stream || []).map((stream: any) => ({
          id: stream.id,
          streamType: stream.streamType,
          codec: stream.codec,
          index: stream.index,
          bitrate: stream.bitrate,
          language: stream.language,
          languageCode: stream.languageCode,
          title: stream.title,
          selected: stream.selected === true,
        })),
      })),
    })),
  };
};

// Get direct play URL
export const getStreamUrl = (server: PlexServer, mediaItem: MediaItem): string => {
  if (!mediaItem.media || mediaItem.media.length === 0 || !mediaItem.media[0].parts || mediaItem.media[0].parts.length === 0) {
    return '';
  }
  
  const baseUrl = server.connections[0].uri;
  const part = mediaItem.media[0].parts[0];
  
  return `${baseUrl}${part.key}?X-Plex-Token=${server.accessToken || ''}`;
};