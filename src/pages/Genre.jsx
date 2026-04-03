import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMediaList } from '../lib/anilist';
import MediaGrid from '../components/MediaGrid';
import { GridSkeleton, Spinner } from '../components/Loader';

const GENRE_META = {
  Action: { color: '#e63946', emoji: '⚔️', description: 'Intense battles, epic fights, and adrenaline-pumping stories.' },
  Romance: { color: '#ec4899', emoji: '💕', description: 'Love stories, relationships, and heartfelt connections.' },
  Fantasy: { color: '#8b5cf6', emoji: '🧙', description: 'Magical worlds, mythical creatures, and extraordinary powers.' },
  Horror: { color: '#374151', emoji: '👻', description: 'Terrifying tales, psychological dread, and supernatural frights.' },
  Comedy: { color: '#eab308', emoji: '😂', description: 'Hilarious moments, witty humor, and lighthearted fun.' },
  Drama: { color: '#3b82f6', emoji: '🎭', description: 'Emotional depth, character development, and compelling narratives.' },
  Adventure: { color: '#22c55e', emoji: '🗺️', description: 'Epic journeys, exploration, and thrilling quests.' },
  Mystery: { color: '#6366f1', emoji: '🔍', description: 'Puzzling cases, suspenseful twists, and mind-bending clues.' },
  'Sci-Fi': { color: '#06b6d4', emoji: '🚀', description: 'Futuristic worlds, advanced technology, and space exploration.' },
  'Slice of Life': { color: '#f97316', emoji: '☀️', description: 'Everyday moments, relatable characters, and heartwarming stories.' },
  Sports: { color: '#14b8a6', emoji: '⚽', description: 'Competitive spirit, athletic prowess, and team dynamics.' },
  Supernatural: { color: '#a855f7', emoji: '👁️', description: 'Beyond the natural — spirits, powers, and otherworldly phenomena.' },
  Psychological: { color: '#6d28d9', emoji: '🧠', description: 'Mind games, complex characters, and psychological tension.' },
  Historical: { color: '#92400e', emoji: '🏛️', description: 'Stories set across history, from ancient to modern eras.' },
  Mecha: { color: '#64748b', emoji: '🤖', description: 'Giant robots, futuristic machines, and mechanical warfare.' },
  Music: { color: '#f472b6', emoji: '🎵', description: 'Musical journeys, bands, and the power of melody.' },
};

const SORTS = [
  { label: 'Trending', value: ['TRENDING_DESC'] },
  { label: 'Top Rated', value: ['SCORE_DESC'] },
  { label: 'New', value: ['START_DATE_DESC'] },
  { label: 'Popular', value: ['POPULARITY_DESC'] },
];

export default function Genre() {
  const { genreName } = useParams();
  const genre = decodeURIComponent(genreName);
  const meta = GENRE_META[genre] || { color: '#6b7494', emoji: '📚', description: `Explore ${genre} manga, manhwa, and manhua.` };

  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [sort, setSort] = useState(SORTS[0].value);

  const fetchPage = useCallback(async (pageNum, sortVal, reset = false) => {
    try {
      if (reset) setLoading(true);
      else setLoadingMore(true);

      const result = await fetchMediaList({
        genre,
        sort: sortVal,
        page: pageNum,
        perPage: 30,
      });

      setMedia(prev => reset ? result.media : [...prev, ...result.media]);
      setHasNextPage(result.pageInfo?.hasNextPage || false);
      setPage(pageNum);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [genre]);

  useEffect(() => {
    setMedia([]);
    setError(null);
    fetchPage(1, sort, true);
  }, [genre, sort, fetchPage]);

  const handleSortChange = (newSort) => {
    setSort(newSort);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasNextPage) {
      fetchPage(page + 1, sort, false);
    }
  };

  return (
    <div className="min-h-screen animate-fadeIn overflow-x-hidden">
      {/* Genre Header */}
      <div
        className="relative py-10 sm:py-16 px-3 sm:px-6 lg:px-8"
        style={{
          background: `linear-gradient(135deg, ${meta.color}15 0%, transparent 60%)`,
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-txt-secondary hover:text-txt-primary transition-colors text-xs sm:text-sm font-body mb-4 sm:mb-6 min-h-[44px]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
            <span className="text-3xl sm:text-4xl">{meta.emoji}</span>
            <h1
              className="font-display text-3xl sm:text-4xl md:text-5xl font-bold italic"
              style={{ color: meta.color }}
            >
              {genre}
            </h1>
          </div>
          <p className="text-txt-secondary text-sm sm:text-base max-w-2xl font-body">
            {meta.description}
          </p>

          {/* Sort options */}
          <div className="flex gap-2 mt-5 sm:mt-6 overflow-x-auto hide-scrollbar">
            {SORTS.map((s) => (
              <button
                key={s.label}
                onClick={() => handleSortChange(s.value)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 min-h-[40px] sm:min-h-[44px] font-body ${
                  JSON.stringify(sort) === JSON.stringify(s.value)
                    ? 'text-white shadow-md'
                    : 'bg-elevated/60 text-txt-secondary hover:bg-elevated hover:text-txt-primary'
                }`}
                style={
                  JSON.stringify(sort) === JSON.stringify(s.value)
                    ? { backgroundColor: meta.color, boxShadow: `0 4px 15px ${meta.color}40` }
                    : {}
                }
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 pb-16 sm:pb-20">
        {error && (
          <div className="text-center py-12 sm:py-16">
            <p className="text-crimson text-base sm:text-lg font-medium">Something went wrong</p>
            <p className="text-txt-muted text-xs sm:text-sm mt-2 font-body">{error}</p>
          </div>
        )}

        {loading ? (
          <GridSkeleton count={18} />
        ) : media.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <p className="text-txt-muted text-base sm:text-lg">No titles found for {genre}</p>
          </div>
        ) : (
          <MediaGrid media={media} />
        )}

        {/* Load More */}
        {loadingMore && <Spinner />}
        {!loading && !loadingMore && hasNextPage && media.length > 0 && (
          <div className="flex justify-center mt-8 sm:mt-10">
            <button
              onClick={handleLoadMore}
              className="group relative px-6 sm:px-8 py-3 bg-elevated hover:bg-card text-txt-secondary hover:text-txt-primary rounded-xl font-medium transition-all duration-300 hover:shadow-lg border border-line hover:border-line-hover overflow-hidden min-h-[44px] text-sm sm:text-base font-body"
            >
              <span className="relative z-10 flex items-center gap-2">
                Load More
                <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
