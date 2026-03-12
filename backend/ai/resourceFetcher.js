const axios = require("axios");

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

// ═══════════════════════════════════════
// ✅ SMART FALLBACKS — Never 404
// ═══════════════════════════════════════
const getYouTubeFallback = (topic, subtopic) => {
  const searchQuery = encodeURIComponent(`${topic} ${subtopic} tutorial english`);
  return [{
    type: "youtube",
    title: `${topic} - ${subtopic} Tutorial`,
    url: `https://www.youtube.com/results?search_query=${searchQuery}`,
    thumbnail: "",
    source: "YouTube",
  }];
};

const getArticleFallback = (topic, subtopic) => {
  const searchQuery = encodeURIComponent(`${topic} ${subtopic} tutorial`);
  const topicLower = (topic + " " + subtopic).toLowerCase();

  if (topicLower.match(/cook|recipe|food|bak|kitchen|ingredient|dish/))
    return [{ type: "article", title: `${topic} - ${subtopic}`, url: `https://www.bbcgoodfood.com/search?q=${searchQuery}`, source: "bbcgoodfood.com" }];
  if (topicLower.match(/math|calculus|algebra|geometry|trigonometry|statistics/))
    return [{ type: "article", title: `${topic} - ${subtopic}`, url: `https://www.khanacademy.org/search?page_search_query=${searchQuery}`, source: "khanacademy.org" }];
  if (topicLower.match(/physics|chemistry|biology|science|ecology|genetics/))
    return [{ type: "article", title: `${topic} - ${subtopic}`, url: `https://www.khanacademy.org/search?page_search_query=${searchQuery}`, source: "khanacademy.org" }];
  if (topicLower.match(/python|javascript|java|react|node|css|html|web|programming|code|software|database|sql/))
    return [{ type: "article", title: `${topic} - ${subtopic}`, url: `https://www.w3schools.com/search/search_result.php?search=${searchQuery}`, source: "w3schools.com" }];
  if (topicLower.match(/music|guitar|piano|chord|note|rhythm|melody/))
    return [{ type: "article", title: `${topic} - ${subtopic}`, url: `https://www.musictheory.net/lessons`, source: "musictheory.net" }];
  if (topicLower.match(/design|ui|ux|figma|color|typography|layout/))
    return [{ type: "article", title: `${topic} - ${subtopic}`, url: `https://www.interaction-design.org/search?q=${searchQuery}`, source: "interaction-design.org" }];
  if (topicLower.match(/history|ancient|medieval|civilization|war|empire/))
    return [{ type: "article", title: `${topic} - ${subtopic}`, url: `https://www.britannica.com/search?query=${searchQuery}`, source: "britannica.com" }];
  if (topicLower.match(/finance|economics|investment|stock|money|accounting/))
    return [{ type: "article", title: `${topic} - ${subtopic}`, url: `https://www.investopedia.com/search#q=${searchQuery}`, source: "investopedia.com" }];
  if (topicLower.match(/fitness|exercise|workout|yoga|gym|nutrition|health/))
    return [{ type: "article", title: `${topic} - ${subtopic}`, url: `https://www.healthline.com/search?q1=${searchQuery}`, source: "healthline.com" }];
  if (topicLower.match(/photo|camera|lighting|portrait|landscape|exposure/))
    return [{ type: "article", title: `${topic} - ${subtopic}`, url: `https://digital-photography-school.com/?s=${searchQuery}`, source: "digital-photography-school.com" }];

  // ✅ Default — Wikipedia search always has content
  return [{ type: "article", title: `${topic} - ${subtopic} | Wikipedia`, url: `https://en.wikipedia.org/wiki/Special:Search?search=${searchQuery}&go=Go`, source: "wikipedia.org" }];
};

// ═══════════════════════════════════════
// ✅ CHECK IF URL IS VALID (not 404)
// ═══════════════════════════════════════
const isValidUrl = async (url) => {
  try {
    const response = await axios.head(url, { timeout: 3000 });
    return response.status < 400;
  } catch {
    return false;
  }
};

// ═══════════════════════════════════════
// 🎥 FETCH YOUTUBE VIDEOS
// ═══════════════════════════════════════
const fetchYouTubeVideos = async (topic, subtopic, experience) => {
  try {
    const query = `${topic} ${subtopic} tutorial ${experience}`;
    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: "snippet",
        q: query,
        type: "video",
        maxResults: 10,
        relevanceLanguage: "en",
        regionCode: "IN",
        videoDuration: "medium",
        order: "relevance",
        key: YOUTUBE_API_KEY,
      },
    });

    const videos = response.data.items;
    if (!videos || videos.length === 0) return getYouTubeFallback(topic, subtopic);

    const filteredVideos = videos.filter(v => !/[^\x00-\x7F]/.test(v.snippet.title));
    const finalVideos = filteredVideos.length > 0 ? filteredVideos : videos;

    return finalVideos.map(video => ({
      type: "youtube",
      title: video.snippet.title,
      url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      thumbnail: video.snippet.thumbnails?.medium?.url || "",
      source: "YouTube",
      channelTitle: video.snippet.channelTitle,
    })).slice(0, 1);

  } catch (error) {
    console.error("YouTube API error:", error.response?.data?.error?.message || error.message);
    return null;
  }
};

// ═══════════════════════════════════════
// 🌐 FETCH GOOGLE ARTICLES
// ═══════════════════════════════════════
const fetchGoogleArticles = async (topic, subtopic) => {
  try {
    // ✅ Removed geeksforgeeks — URLs often give 404
    const query = `${topic} ${subtopic} tutorial site:w3schools.com OR site:freecodecamp.org OR site:developer.mozilla.org OR site:tutorialspoint.com OR site:khanacademy.org`;

    const response = await axios.get("https://www.googleapis.com/customsearch/v1", {
      params: { q: query, cx: GOOGLE_SEARCH_ENGINE_ID, key: GOOGLE_SEARCH_API_KEY, num: 5 },
    });

    const items = response.data.items;
    if (!items || items.length === 0) return null;

    // ✅ Check each URL — skip 404s
    for (const item of items) {
      const valid = await isValidUrl(item.link);
      if (valid) {
        return [{
          type: "article",
          title: item.title,
          url: item.link,
          thumbnail: item.pagemap?.cse_image?.[0]?.src || "",
          source: item.displayLink,
        }];
      }
    }

    // ✅ All URLs invalid — use fallback
    return null;

  } catch (error) {
    console.error("Google Search API error:", error.response?.data?.error?.message || error.message);
    return null;
  }
};

// ═══════════════════════════════════════
// ✅ FETCH RESOURCES FOR ALL MODULES
// ═══════════════════════════════════════
const fetchResourcesForModules = async (modules, experience) => {
  const seen = new Set();
  const resourceCache = {};

  for (const module of modules) {
    const key = `${module.topic}__${module.subtopic}`;

    if (seen.has(key)) {
      module.resources = resourceCache[key];
      continue;
    }

    seen.add(key);

    let [youtubeVideos, googleArticles] = await Promise.all([
      fetchYouTubeVideos(module.topic, module.subtopic, experience),
      fetchGoogleArticles(module.topic, module.subtopic),
    ]);

    // ✅ If either API failed — try Gemini
    if (!youtubeVideos || !googleArticles) {
  // ✅ Skip Gemini — use smart fallbacks directly (saves quota)
  youtubeVideos = youtubeVideos || getYouTubeFallback(module.topic, module.subtopic);
  googleArticles = googleArticles || getArticleFallback(module.topic, module.subtopic);
}

    console.log("YouTube results:", youtubeVideos.length);
    console.log("Article results:", googleArticles.length);

    const resources = [...youtubeVideos, ...googleArticles];
    resourceCache[key] = resources;
    module.resources = resources;

    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return modules;
};

module.exports = { fetchResourcesForModules };