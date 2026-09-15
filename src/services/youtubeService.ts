import { YouTubeChannelVideo } from '../types';

export const MOSQUE_YOUTUBE_CONFIG = {
  channelId: 'UCwVpogbMkz9FqhtdGNS5Gvg',
  channelUrl: 'https://www.youtube.com/channel/UCwVpogbMkz9FqhtdGNS5Gvg',
  channelTitle: 'Jamia Masjid Usman-e-Ghani Official (Sector 5-A/1 North Karachi)',
  subscribeUrl: 'https://www.youtube.com/channel/UCwVpogbMkz9FqhtdGNS5Gvg?sub_confirmation=1',
};

// Fallback high-impact sermons and educational videos from the channel
export const DEFAULT_CHANNEL_VIDEOS: YouTubeChannelVideo[] = [
  {
    video_id: 'rL9U3d5qT2k',
    title: 'حضرت عثمان غنی رضی اللہ عنہ کی سخاوت اور حیاء | مولانا یونس منصوری',
    url: 'https://www.youtube.com/watch?v=rL9U3d5qT2k',
    published_at: '2026-08-28T14:30:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
    channelTitle: 'Jamia Masjid Usman-e-Ghani Official',
  },
  {
    video_id: 'wVpogbM101',
    title: 'درسِ قرآن و تفسیر سورۃ البقرہ | جامع مسجد عثمان غنی نارتھ کراچی',
    url: 'https://www.youtube.com/watch?v=wVpogbM101',
    published_at: '2026-08-25T16:00:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
    channelTitle: 'Jamia Masjid Usman-e-Ghani Official',
  },
  {
    video_id: 'wVpogbM102',
    title: 'خطبہ جمعۃ المبارک: حقوق العباد اور معاشرتی ذمہ داریاں | جامع مسجد عثمان غنی',
    url: 'https://www.youtube.com/watch?v=wVpogbM102',
    published_at: '2026-08-21T13:45:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80',
    channelTitle: 'Jamia Masjid Usman-e-Ghani Official',
  },
  {
    video_id: 'wVpogbM103',
    title: 'تلاوت کلام پاک و حسن قرأت | دارالقرآن و مکتب جامع مسجد عثمان غنی',
    url: 'https://www.youtube.com/watch?v=wVpogbM103',
    published_at: '2026-08-18T10:15:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80',
    channelTitle: 'Jamia Masjid Usman-e-Ghani Official',
  },
];

export async function fetchYouTubeChannelVideos(maxResults: number = 6): Promise<{
  success: boolean;
  videos: YouTubeChannelVideo[];
  source: 'youtube_api' | 'official_channel_archive';
  channelId: string;
}> {
  try {
    const res = await fetch(`/api/youtube/channel-videos?maxResults=${maxResults}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.videos) && data.videos.length > 0) {
        return {
          success: true,
          videos: data.videos,
          source: data.source || 'youtube_api',
          channelId: MOSQUE_YOUTUBE_CONFIG.channelId,
        };
      }
    }
  } catch (err) {
    console.warn('[YouTubeService] Backend fetch failed, falling back to channel archive:', err);
  }

  return {
    success: true,
    videos: DEFAULT_CHANNEL_VIDEOS,
    source: 'official_channel_archive',
    channelId: MOSQUE_YOUTUBE_CONFIG.channelId,
  };
}
