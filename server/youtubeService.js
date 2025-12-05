import { google } from 'googleapis';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

/**
 * Fetch YouTube data based on input type
 */
export async function fetchYouTubeData(type, query) {
  if (!process.env.YOUTUBE_API_KEY) {
    throw new Error('YouTube API key not configured');
  }

  switch (type) {
    case 'channel':
      return fetchChannelData(query);
    case 'keyword':
    case 'niche':
    case 'trend':
      return fetchSearchData(query);
    default:
      return fetchSearchData(query);
  }
}

/**
 * Search for videos by keyword
 */
async function fetchSearchData(query) {
  try {
    // Search for videos
    const searchResponse = await youtube.search.list({
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: 25,
      order: 'viewCount',
      publishedAfter: getDateMonthsAgo(3), // Last 3 months
      relevanceLanguage: 'pt'
    });

    const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');

    // Get video statistics
    const videosResponse = await youtube.videos.list({
      part: 'statistics,contentDetails,snippet',
      id: videoIds
    });

    const videos = videosResponse.data.items.map(video => ({
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      channelTitle: video.snippet.channelTitle,
      channelId: video.snippet.channelId,
      publishedAt: video.snippet.publishedAt,
      thumbnails: video.snippet.thumbnails,
      viewCount: parseInt(video.statistics.viewCount || 0),
      likeCount: parseInt(video.statistics.likeCount || 0),
      commentCount: parseInt(video.statistics.commentCount || 0),
      duration: video.contentDetails.duration,
      tags: video.snippet.tags || []
    }));

    // Sort by views
    videos.sort((a, b) => b.viewCount - a.viewCount);

    // Calculate averages and patterns
    const analysis = analyzeVideos(videos);

    return {
      query,
      type: 'search',
      videos,
      analysis,
      fetchedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('YouTube search error:', error);
    throw error;
  }
}

/**
 * Fetch channel data
 */
async function fetchChannelData(channelName) {
  try {
    // Search for the channel
    const searchResponse = await youtube.search.list({
      part: 'snippet',
      q: channelName,
      type: 'channel',
      maxResults: 1
    });

    if (!searchResponse.data.items.length) {
      throw new Error('Channel not found');
    }

    const channelId = searchResponse.data.items[0].id.channelId;

    // Get channel details
    const channelResponse = await youtube.channels.list({
      part: 'snippet,statistics,brandingSettings',
      id: channelId
    });

    const channel = channelResponse.data.items[0];

    // Get recent videos from channel
    const videosResponse = await youtube.search.list({
      part: 'snippet',
      channelId: channelId,
      type: 'video',
      maxResults: 20,
      order: 'date'
    });

    const videoIds = videosResponse.data.items.map(item => item.id.videoId).join(',');

    // Get video statistics
    const videoStatsResponse = await youtube.videos.list({
      part: 'statistics,contentDetails',
      id: videoIds
    });

    const videos = videosResponse.data.items.map(item => {
      const stats = videoStatsResponse.data.items.find(v => v.id === item.id.videoId);
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        thumbnails: item.snippet.thumbnails,
        viewCount: stats ? parseInt(stats.statistics.viewCount || 0) : 0,
        likeCount: stats ? parseInt(stats.statistics.likeCount || 0) : 0,
        commentCount: stats ? parseInt(stats.statistics.commentCount || 0) : 0
      };
    });

    // Sort by views
    videos.sort((a, b) => b.viewCount - a.viewCount);

    const analysis = analyzeVideos(videos);

    return {
      query: channelName,
      type: 'channel',
      channel: {
        id: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        subscriberCount: parseInt(channel.statistics.subscriberCount || 0),
        videoCount: parseInt(channel.statistics.videoCount || 0),
        viewCount: parseInt(channel.statistics.viewCount || 0),
        thumbnails: channel.snippet.thumbnails,
        keywords: channel.brandingSettings?.channel?.keywords || ''
      },
      videos,
      analysis,
      fetchedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('YouTube channel error:', error);
    throw error;
  }
}

/**
 * Analyze video patterns
 */
function analyzeVideos(videos) {
  if (!videos.length) return null;

  const totalViews = videos.reduce((sum, v) => sum + v.viewCount, 0);
  const totalLikes = videos.reduce((sum, v) => sum + v.likeCount, 0);

  // Title patterns
  const titlePatterns = {
    hasNumbers: videos.filter(v => /\d/.test(v.title)).length,
    hasQuestion: videos.filter(v => /\?/.test(v.title)).length,
    hasEmoji: videos.filter(v => /[\u{1F600}-\u{1F6FF}]/u.test(v.title)).length,
    avgLength: Math.round(videos.reduce((sum, v) => sum + v.title.length, 0) / videos.length),
    uppercaseWords: videos.filter(v => /[A-Z]{2,}/.test(v.title)).length
  };

  // Common words in top videos
  const topVideos = videos.slice(0, 10);
  const allWords = topVideos.flatMap(v =>
    v.title.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3)
  );

  const wordFrequency = {};
  allWords.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });

  const commonWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  // Engagement metrics
  const avgViews = Math.round(totalViews / videos.length);
  const avgLikes = Math.round(totalLikes / videos.length);
  const engagementRate = totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(2) : 0;

  // Top performing video
  const topVideo = videos[0];

  return {
    totalVideosAnalyzed: videos.length,
    avgViews,
    avgLikes,
    engagementRate: `${engagementRate}%`,
    titlePatterns,
    commonWords,
    topVideo: topVideo ? {
      title: topVideo.title,
      views: topVideo.viewCount,
      likes: topVideo.likeCount
    } : null
  };
}

/**
 * Get date X months ago in ISO format
 */
function getDateMonthsAgo(months) {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date.toISOString();
}

/**
 * Get trending videos (requires different quota, simplified version)
 */
export async function fetchTrendingVideos(regionCode = 'BR') {
  try {
    const response = await youtube.videos.list({
      part: 'snippet,statistics',
      chart: 'mostPopular',
      regionCode,
      maxResults: 25
    });

    return response.data.items.map(video => ({
      id: video.id,
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      viewCount: parseInt(video.statistics.viewCount || 0),
      likeCount: parseInt(video.statistics.likeCount || 0),
      publishedAt: video.snippet.publishedAt,
      thumbnails: video.snippet.thumbnails
    }));
  } catch (error) {
    console.error('Trending videos error:', error);
    throw error;
  }
}
