import { useState, useEffect, useRef } from 'react';
import { fetchHomeData } from '../lib/anilist';

const SECTION_TEMPLATES = [
  { key: 'trending', title: 'Trending This Week' },
  { key: 'hotManhwa', title: 'Hot Manhwa' },
  { key: 'popularManga', title: 'Popular Manga' },
  { key: 'manhuaPicks', title: 'Manhua Picks' },
  { key: 'topRated', title: 'Top Rated All Time' },
  { key: 'newReleases', title: 'New Releases' },
  { key: 'completed', title: 'Completed Series' },
  { key: 'hiddenGems', title: 'Hidden Gems' },
];

export function useHomeSections() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function loadSections() {
      try {
        const data = await fetchHomeData();
        if (cancelled) return;
        
        const orderedSections = SECTION_TEMPLATES.map(template => ({
          ...template,
          media: data[template.key]?.media || []
        }));
        
        setSections(orderedSections.filter(s => s.media.length > 0));
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    loadSections();

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
