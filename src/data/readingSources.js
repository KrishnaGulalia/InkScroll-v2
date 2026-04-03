const MANHWA_SOURCES = [
  {
    name: "Asura Scans",
    buildUrl: (t) => `https://asuracomic.net/?s=${encodeURIComponent(t)}`,
    type: "scanlation",
    icon: "⚔️",
  },
  {
    name: "Reaper Scans",
    buildUrl: (t) => `https://reaperscans.com/?s=${encodeURIComponent(t)}`,
    type: "scanlation",
    icon: "💀",
  },
  {
    name: "Flame Scans",
    buildUrl: (t) => `https://flamecomics.xyz/?s=${encodeURIComponent(t)}`,
    type: "scanlation",
    icon: "🔥",
  },
  {
    name: "MangaDex",
    buildUrl: (t) => `https://mangadex.org/search?q=${encodeURIComponent(t)}`,
    type: "aggregator",
    icon: "📚",
  },
  {
    name: "Webtoon",
    buildUrl: (t) => `https://www.webtoons.com/en/search?keyword=${encodeURIComponent(t)}`,
    type: "official",
    icon: "🌐",
  },
  {
    name: "Tapas",
    buildUrl: (t) => `https://tapas.io/search?q=${encodeURIComponent(t)}`,
    type: "official",
    icon: "📱",
  },
];

const MANGA_SOURCES = [
  {
    name: "MangaDex",
    buildUrl: (t) => `https://mangadex.org/search?q=${encodeURIComponent(t)}`,
    type: "aggregator",
    icon: "📚",
  },
  {
    name: "MangaSee",
    buildUrl: (t) => `https://mangasee123.com/search/?name=${encodeURIComponent(t)}`,
    type: "aggregator",
    icon: "👁️",
  },
  {
    name: "TCB Scans",
    buildUrl: (t) => `https://tcbscans.me/?s=${encodeURIComponent(t)}`,
    type: "scanlation",
    icon: "⚡",
  },
  {
    name: "MangaPlus",
    buildUrl: (t) => `https://mangaplus.shueisha.co.jp/search_result?keyword=${encodeURIComponent(t)}`,
    type: "official",
    icon: "🔵",
  },
];

const MANHUA_SOURCES = [
  {
    name: "MangaDex",
    buildUrl: (t) => `https://mangadex.org/search?q=${encodeURIComponent(t)}`,
    type: "aggregator",
    icon: "📚",
  },
  {
    name: "Manhua Plus",
    buildUrl: (t) => `https://manhuaplus.org/?s=${encodeURIComponent(t)}`,
    type: "scanlation",
    icon: "🐉",
  },
  {
    name: "WebComics",
    buildUrl: (t) => `https://www.webcomicsapp.com/search?word=${encodeURIComponent(t)}`,
    type: "official",
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
 * Also merges in AniList externalLinks if provided.
 */
export function getReadingSources(title, countryOfOrigin, externalLinks = []) {
  const countrySources = SOURCE_MAP[countryOfOrigin] || MANGA_SOURCES;

  // Build sources with actual URLs
  const sources = countrySources.map((src) => ({
    name: src.name,
    url: src.buildUrl(title),
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
