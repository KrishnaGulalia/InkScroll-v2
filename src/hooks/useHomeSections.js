import { useState, useEffect } from 'react';
import { fetchMediaList } from '../lib/anilist';

const SECTION_CONFIGS = [
  {
    key: 'trending',
    title: 'Trending This Week',
    emoji: '🔥',
    variables: { sort: ['TRENDING_DESC'], page: 1 },
  },
  {
    key: 'topManhwa',
    title: 'Top Rated Manhwa',
    emoji: '🇰🇷',
    variables: { sort: ['SCORE_DESC'], country: 'KR', page: 1 },
  },
  {
    key: 'popularManga',
    title: 'Popular Manga',
    emoji: '🇯🇵',
    variables: { sort: ['POPULARITY_DESC'], country: 'JP', page: 1 },
  },
  {
    key: 'newReleases',
    title: 'New Releases',
    emoji: '✨',
    variables: { sort: ['START_DATE_DESC'], page: 1 },
  },
];

export function useHomeSections() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all(
      SECTION_CONFIGS.map(async (config) => {
        try {
          const result = await fetchMediaList(config.variables);
          return {
            key: config.key,
            title: config.title,
            emoji: config.emoji,
            media: result.media || [],
          };
        } catch {
          return {
            key: config.key,
            title: config.title,
            emoji: config.emoji,
            media: [],
          };
        }
      })
    )
      .then((results) => {
        if (!cancelled) {
          setSections(results.filter((s) => s.media.length > 0));
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Extract trending items for the hero carousel
  const heroItems = sections
    .find((s) => s.key === 'trending')
    ?.media.filter((m) => m.bannerImage)
    .slice(0, 5) || [];

  return { sections, heroItems, loading, error };
}
