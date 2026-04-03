const MANHWA_SOURCES = [
  {
    name: "Webtoon",
    url: (title) => `https://www.webtoons.com/en/search?keyword=${encodeURIComponent(title)}`,
    type: "official",
    icon: "🌐",
  },
  {
    name: "MangaDex",
    url: (title) => `https://mangadex.org/search?q=${encodeURIComponent(title)}`,
    type: "aggregator",
    icon: "📚",
  },
  {
    name: "MangaKakalot",
    url: (title) => `https://mangakakalot.com/search/story/${encodeURIComponent(title.toLowerCase().replace(/\s+/g, '_'))}`,
    type: "aggregator",
    icon: "📖",
  },
  {
    name: "Asura Scans",
    url: (title) => `https://asuracomic.net/?s=${encodeURIComponent(title)}`,
    type: "scanlation",
    icon: "⚔️",
  },
  {
    name: "Reaper Scans",
    url: (title) => `https://reaperscans.com/?s=${encodeURIComponent(title)}`,
    type: "scanlation",
    icon: "💀",
  },
  {
    name: "Flame Comics",
    url: (title) => `https://flamecomics.xyz/?s=${encodeURIComponent(title)}`,
    type: "scanlation",
    icon: "🔥",
  },
];

const MANGA_SOURCES = [
  {
    name: "Manga Plus",
    url: (title) => `https://mangaplus.shueisha.co.jp/search_result?keyword=${encodeURIComponent(title)}`,
    type: "official",
    icon: "🔵",
  },
  {
    name: "MangaDex",
    url: (title) => `https://mangadex.org/search?q=${encodeURIComponent(title)}`,
    type: "aggregator",
    icon: "📚",
  },
  {
    name: "MangaSee",
    url: (title) => `https://mangasee123.com/search/?name=${encodeURIComponent(title)}`,
    type: "aggregator",
    icon: "👁️",
  },
  {
    name: "MangaKakalot",
    url: (title) => `https://mangakakalot.com/search/story/${encodeURIComponent(title.toLowerCase().replace(/\s+/g, '_'))}`,
    type: "aggregator",
    icon: "📖",
  },
  {
    name: "TCB Scans",
    url: (title) => `https://tcbscans.me/?s=${encodeURIComponent(title)}`,
    type: "scanlation",
    icon: "⚡",
  },
];

const MANHUA_SOURCES = [
  {
    name: "MangaDex",
    url: (title) => `https://mangadex.org/search?q=${encodeURIComponent(title)}`,
    type: "aggregator",
    icon: "📚",
  },
  {
    name: "Manhua Plus",
    url: (title) => `https://manhuaplus.org/?s=${encodeURIComponent(title)}`,
    type: "scanlation",
    icon: "🐉",
  },
  {
    name: "ManhuaScan",
    url: (title) => `https://manhuascan.io/?s=${encodeURIComponent(title)}`,
    type: "aggregator",
    icon: "📖",
  },
];

const SOURCE_MAP = {
  KR: MANHWA_SOURCES,
  JP: MANGA_SOURCES,
  CN: MANHUA_SOURCES,
  TW: MANHUA_SOURCES,
};

/**
 * Get reading sources for a title based on country of origin.
 * All source URLs are now functions that take the title and return a search URL.
 * Also merges in AniList externalLinks if provided.
 */
export function getReadingSources(title, countryOfOrigin, externalLinks = []) {
  const countrySources = SOURCE_MAP[countryOfOrigin] || MANGA_SOURCES;

  // Build sources — url is a function, call it with the title
  const sources = countrySources.map((src) => ({
    name: src.name,
    url: src.url(title),
    type: src.type,
    icon: src.icon,
  }));

  // Add AniList external links as official sources
  const anilistSources = externalLinks
    .filter((link) => link.url && link.site)
    .map((link) => ({
      name: link.site,
      url: link.url,
      type: "official",
      icon: link.icon ? null : "🔗",
      iconUrl: link.icon || null,
      color: link.color || null,
    }));

  return [...anilistSources, ...sources];
}

/**
 * Group sources by type for display.
 */
export function groupSourcesByType(sources) {
  const groups = {
    official: { label: "Official Sources", sources: [] },
    aggregator: { label: "Aggregators", sources: [] },
    scanlation: { label: "Scanlation Groups", sources: [] },
  };

  sources.forEach((src) => {
    if (groups[src.type]) {
      groups[src.type].sources.push(src);
    }
  });

  return Object.values(groups).filter((g) => g.sources.length > 0);
}
