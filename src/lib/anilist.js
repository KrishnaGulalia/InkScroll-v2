const ANILIST_URL = 'https://graphql.anilist.co';

const MEDIA_LIST_QUERY = `
query ($page: Int, $perPage: Int, $sort: [MediaSort], $genre: String, $country: CountryCode, $search: String, $status: MediaStatus, $averageScore_greater: Int, $popularity_lesser: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo { hasNextPage currentPage }
    media(
      type: MANGA
      sort: $sort
      genre: $genre
      countryOfOrigin: $country
      search: $search
      status: $status
      averageScore_greater: $averageScore_greater
      popularity_lesser: $popularity_lesser
      isAdult: false
    ) {
      id
      title { english romaji }
      coverImage { large extraLarge color }
      bannerImage
      averageScore
      popularity
      genres
      countryOfOrigin
      status
      chapters
      startDate { year }
    }
  }
}
`;

const MEDIA_DETAIL_QUERY = `
query ($id: Int) {
  Media(id: $id, type: MANGA) {
    id
    title { english romaji native }
    coverImage { extraLarge color }
    bannerImage
    description(asHtml: false)
    averageScore
    popularity
    genres
    tags { name rank isMediaSpoiler }
    status
    chapters
    startDate { year month day }
    countryOfOrigin
    characters(sort: ROLE, perPage: 8) {
      nodes {
        name { full }
        image { medium }
      }
    }
    staff(perPage: 4) {
      nodes {
        name { full }
        primaryOccupations
        image { medium }
      }
    }
    relations {
      nodes {
        id
        title { english romaji }
        coverImage { medium }
        type
        format
      }
    }
    externalLinks { site url icon color }
  }
}
`;

// ─── In-memory cache ───────────────────────────────────
const cache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

function getCacheKey(query, variables) {
  return query.slice(0, 30) + JSON.stringify(variables);
}

function getCached(key) {
  // Try memory cache first
  const entry = cache.get(key);
  if (entry && Date.now() - entry.time < CACHE_TTL) {
    return entry.data;
  }
  cache.delete(key);

  // Try localStorage
  try {
    const stored = localStorage.getItem('anilist_' + key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Date.now() - parsed.time < CACHE_TTL) {
        cache.set(key, parsed);
        return parsed.data;
      }
      localStorage.removeItem('anilist_' + key);
    }
  } catch {}
  return null;
}

function setCache(key, data) {
  const entry = { data, time: Date.now() };
  cache.set(key, entry);
  // Evict old entries if cache grows too large
  if (cache.size > 50) {
    const oldest = cache.keys().next().value;
    cache.delete(oldest);
  }
  // Also persist to localStorage
  try {
    localStorage.setItem('anilist_' + key, JSON.stringify(entry));
  } catch {}
}

// ─── Request queue with throttling ─────────────────────
let requestQueue = Promise.resolve();
const MIN_DELAY = 1200; // ms between requests — keeps us well under AniList's ~30 req/min limit

function enqueue(fn) {
  requestQueue = requestQueue
    .then(() => delay(MIN_DELAY))
    .then(fn)
    .catch((err) => {
      // Don't break the chain
      throw err;
    });
  return requestQueue;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Fetch with retry + backoff ────────────────────────
async function anilistFetch(query, variables = {}, retries = 4) {
  const cacheKey = getCacheKey(query, variables);
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const attempt = async (tryNum) => {
    let res;
    try {
      res = await fetch(ANILIST_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      });
    } catch (fetchErr) {
      // Network error / CORS blocked — likely a 429 that stripped CORS headers
      if (tryNum < retries) {
        const backoff = 2000 * Math.pow(2, tryNum);
        console.warn(`[AniList] Network error (likely rate-limited). Retrying in ${backoff}ms (attempt ${tryNum + 1}/${retries})`);
        await delay(backoff);
        return attempt(tryNum + 1);
      }
      throw new Error('Network error — AniList may be rate-limiting. Please wait a moment and refresh.');
    }

    // Rate limited — retry with backoff
    if (res.status === 429) {
      if (tryNum < retries) {
        const retryAfter = parseInt(res.headers.get('Retry-After') || '1', 10);
        const backoff = Math.max(retryAfter * 1000, 1000 * Math.pow(2, tryNum));
        console.warn(`[AniList] Rate limited. Retrying in ${backoff}ms (attempt ${tryNum + 1}/${retries})`);
        await delay(backoff);
        return attempt(tryNum + 1);
      }
      throw new Error('Rate limited by AniList. Please wait a moment and try again.');
    }

    // Server error — retry
    if (res.status >= 500 && tryNum < retries) {
      const backoff = 1000 * Math.pow(2, tryNum);
      console.warn(`[AniList] Server error ${res.status}. Retrying in ${backoff}ms`);
      await delay(backoff);
      return attempt(tryNum + 1);
    }

    if (!res.ok) throw new Error(`AniList error: ${res.status}`);

    const json = await res.json();
    if (json.errors) throw new Error(json.errors[0]?.message || 'AniList query failed');

    setCache(cacheKey, json.data);
    return json.data;
  };

  return attempt(0);
}

// ─── Throttled fetch (queued) ──────────────────────────
function throttledAnilistFetch(query, variables = {}) {
  // Check cache first — skip queue if cached
  const cacheKey = getCacheKey(query, variables);
  const cached = getCached(cacheKey);
  if (cached) return Promise.resolve(cached);

  // Enqueue to throttle
  return enqueue(() => anilistFetch(query, variables));
}

// ─── Public exports ────────────────────────────────────
export async function fetchMediaList(variables = {}) {
  const data = await throttledAnilistFetch(MEDIA_LIST_QUERY, variables);
  return data.Page;
}

export async function fetchMediaDetail(id) {
  const data = await anilistFetch(MEDIA_DETAIL_QUERY, { id: parseInt(id) });
  return data.Media;
}
