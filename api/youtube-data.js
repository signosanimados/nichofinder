// YouTube Data API v3 Integration
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { youtubeApiKey, searchType, query, regionCode = 'BR' } = req.body;

    if (!youtubeApiKey) {
      return res.status(400).json({ error: 'YouTube API Key nao fornecida.' });
    }

    let youtubeData = {};

    // 1. Get trending videos
    if (searchType === 'trending' || searchType === 'all') {
      const trendingVideos = await fetchTrendingVideos(youtubeApiKey, regionCode);
      youtubeData.trending = trendingVideos;
    }

    // 2. Search videos by keyword/niche
    if ((searchType === 'search' || searchType === 'all') && query) {
      const searchResults = await searchVideos(youtubeApiKey, query, regionCode);
      youtubeData.searchResults = searchResults;
    }

    // 3. Get channel info
    if (searchType === 'channel' && query) {
      const channelData = await searchChannel(youtubeApiKey, query);
      youtubeData.channel = channelData;
    }

    // 4. Get video categories
    if (searchType === 'categories' || searchType === 'all') {
      const categories = await getVideoCategories(youtubeApiKey, regionCode);
      youtubeData.categories = categories;
    }

    return res.status(200).json(youtubeData);

  } catch (error) {
    console.error('YouTube API error:', error);
    return res.status(500).json({ error: error.message || 'YouTube API error' });
  }
}

// Fetch trending videos
async function fetchTrendingVideos(apiKey, regionCode) {
  const url = `${YOUTUBE_API_BASE}/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=${regionCode}&maxResults=25&key=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch trending videos');
  }

  const data = await response.json();

  return data.items?.map(video => ({
    id: video.id,
    title: video.snippet?.title,
    description: video.snippet?.description?.substring(0, 200),
    channelTitle: video.snippet?.channelTitle,
    channelId: video.snippet?.channelId,
    publishedAt: video.snippet?.publishedAt,
    thumbnail: video.snippet?.thumbnails?.high?.url,
    tags: video.snippet?.tags?.slice(0, 10) || [],
    categoryId: video.snippet?.categoryId,
    viewCount: parseInt(video.statistics?.viewCount || 0),
    likeCount: parseInt(video.statistics?.likeCount || 0),
    commentCount: parseInt(video.statistics?.commentCount || 0),
    duration: video.contentDetails?.duration
  })) || [];
}

// Search videos by query
async function searchVideos(apiKey, query, regionCode) {
  // First, search for videos
  const searchUrl = `${YOUTUBE_API_BASE}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&order=viewCount&regionCode=${regionCode}&maxResults=20&key=${apiKey}`;

  const searchResponse = await fetch(searchUrl);
  if (!searchResponse.ok) {
    const error = await searchResponse.json();
    throw new Error(error.error?.message || 'Failed to search videos');
  }

  const searchData = await searchResponse.json();
  const videoIds = searchData.items?.map(item => item.id.videoId).join(',');

  if (!videoIds) return [];

  // Get detailed statistics for each video
  const statsUrl = `${YOUTUBE_API_BASE}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${apiKey}`;

  const statsResponse = await fetch(statsUrl);
  if (!statsResponse.ok) {
    const error = await statsResponse.json();
    throw new Error(error.error?.message || 'Failed to fetch video statistics');
  }

  const statsData = await statsResponse.json();

  return statsData.items?.map(video => ({
    id: video.id,
    title: video.snippet?.title,
    description: video.snippet?.description?.substring(0, 200),
    channelTitle: video.snippet?.channelTitle,
    channelId: video.snippet?.channelId,
    publishedAt: video.snippet?.publishedAt,
    thumbnail: video.snippet?.thumbnails?.high?.url,
    tags: video.snippet?.tags?.slice(0, 10) || [],
    categoryId: video.snippet?.categoryId,
    viewCount: parseInt(video.statistics?.viewCount || 0),
    likeCount: parseInt(video.statistics?.likeCount || 0),
    commentCount: parseInt(video.statistics?.commentCount || 0),
    duration: video.contentDetails?.duration
  })) || [];
}

// Search for a channel
async function searchChannel(apiKey, query) {
  // Search for channel
  const searchUrl = `${YOUTUBE_API_BASE}/search?part=snippet&q=${encodeURIComponent(query)}&type=channel&maxResults=1&key=${apiKey}`;

  const searchResponse = await fetch(searchUrl);
  if (!searchResponse.ok) {
    const error = await searchResponse.json();
    throw new Error(error.error?.message || 'Failed to search channel');
  }

  const searchData = await searchResponse.json();
  const channelId = searchData.items?.[0]?.id?.channelId;

  if (!channelId) return null;

  // Get channel details
  const channelUrl = `${YOUTUBE_API_BASE}/channels?part=snippet,statistics,contentDetails&id=${channelId}&key=${apiKey}`;

  const channelResponse = await fetch(channelUrl);
  if (!channelResponse.ok) {
    const error = await channelResponse.json();
    throw new Error(error.error?.message || 'Failed to fetch channel details');
  }

  const channelData = await channelResponse.json();
  const channel = channelData.items?.[0];

  if (!channel) return null;

  // Get recent videos from channel
  const videosUrl = `${YOUTUBE_API_BASE}/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=10&key=${apiKey}`;

  const videosResponse = await fetch(videosUrl);
  const videosData = await videosResponse.json();

  // Get video IDs for statistics
  const videoIds = videosData.items?.map(v => v.id.videoId).join(',');
  let recentVideos = [];

  if (videoIds) {
    const statsUrl = `${YOUTUBE_API_BASE}/videos?part=snippet,statistics&id=${videoIds}&key=${apiKey}`;
    const statsResponse = await fetch(statsUrl);
    const statsData = await statsResponse.json();

    recentVideos = statsData.items?.map(video => ({
      id: video.id,
      title: video.snippet?.title,
      publishedAt: video.snippet?.publishedAt,
      viewCount: parseInt(video.statistics?.viewCount || 0),
      likeCount: parseInt(video.statistics?.likeCount || 0),
      commentCount: parseInt(video.statistics?.commentCount || 0)
    })) || [];
  }

  return {
    id: channel.id,
    title: channel.snippet?.title,
    description: channel.snippet?.description?.substring(0, 300),
    customUrl: channel.snippet?.customUrl,
    thumbnail: channel.snippet?.thumbnails?.high?.url,
    country: channel.snippet?.country,
    subscriberCount: parseInt(channel.statistics?.subscriberCount || 0),
    videoCount: parseInt(channel.statistics?.videoCount || 0),
    viewCount: parseInt(channel.statistics?.viewCount || 0),
    recentVideos
  };
}

// Get video categories
async function getVideoCategories(apiKey, regionCode) {
  const url = `${YOUTUBE_API_BASE}/videoCategories?part=snippet&regionCode=${regionCode}&key=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch categories');
  }

  const data = await response.json();

  return data.items?.map(cat => ({
    id: cat.id,
    title: cat.snippet?.title
  })) || [];
}
