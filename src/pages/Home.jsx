import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useMediaList } from '../hooks/useAniList';
import { useHomeSections } from '../hooks/useHomeSections';
import Hero from '../components/Hero';
import Filters from '../components/Filters';
import CategoryPills from '../components/CategoryPills';
import MediaGrid from '../components/MediaGrid';
import MediaRow from '../components/MediaRow';
import { GridSkeleton, HomeSkeleton, Spinner } from '../components/Loader';

// Persist scroll position across navigations
const scrollStore = { y: 0, path: '/' };

const GENRE_CARDS = [
  { name: 'Action', color: '#e63946', emoji: '⚔️' },
  { name: 'Romance', color: '#ec4899', emoji: '💕' },
  { name: 'Fantasy', color: '#8b5cf6', emoji: '🧙' },
  { name: 'Horror', color: '#374151', emoji: '👻' },
  { name: 'Comedy', color: '#eab308', emoji: '😂' },
  { name: 'Drama', color: '#3b82f6', emoji: '🎭' },
  { name: 'Adventure', color: '#22c55e', emoji: '🗺️' },
  { name: 'Mystery', color: '#6366f1', emoji: '🔍' },
  { name: 'Sci-Fi', color: '#06b6d4', emoji: '🚀' },
  { name: 'Slice of Life', color: '#f97316', emoji: '☀️' },
  { name: 'Sports', color: '#14b8a6', emoji: '⚽' },
  { name: 'Supernatural', color: '#a855f7', emoji: '👁️' },
  { name: 'Psychological', color: '#6d28d9', emoji: '🧠' },
  { name: 'Historical', color: '#92400e', emoji: '🏛️' },
  { name: 'Mecha', color: '#64748b', emoji: '🤖' },
  { name: 'Music', color: '#f472b6', emoji: '🎵' },
];

export default function Home({ searchQuery }) {
  const [activeCategory, setActiveCategory] = useState(null);
  
  const isSearching = !!searchQuery;
  const isCategoryActive = !!activeCategory;
  const showSections = !isSearching && !isCategoryActive;
  
  const { media, loading, error, pageInfo, filters, updateFilters, loadMore } = useMediaList({ skip: showSections });
  const { sections, heroItems, loading: sectionsLoading } = useHomeSections();
  const location = useLocation();
  const scrollRestored = useRef(false);

  useEffect(() => {
    updateFilters({ search: searchQuery || '' });
  }, [searchQuery, updateFilters]);

  // Save scroll position on scroll
  useEffect(() => {
    const handleScroll = () => {
      scrollStore.y = window.scrollY;
      scrollStore.path = location.pathname;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Restore scroll position when returning from detail page
  useEffect(() => {
    if (!loading && media.length > 0 && !scrollRestored.current && scrollStore.path === '/') {
      scrollRestored.current = true;
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollStore.y);
      });
    }
  }, [loading, media.length]);

  // Reset scroll ref when filters change
  useEffect(() => {
    scrollRestored.current = false;
  }, [filters.search, filters.genre, filters.country, filters.sort, filters.status]);

  // Handle category selection
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    if (!category) {
      updateFilters({ sort: 'trending', country: null, status: null });
    } else {
      updateFilters({
        sort: category.sort,
        country: category.country,
        status: category.status,
      });
    }
  };

  const isFiltering = !!filters.genre || isCategoryActive;
  const isFirstLoad = loading && media.length === 0;
  const isLoadingMore = loading && media.length > 0;

  return (
    <div className="min-h-screen animate-fadeIn overflow-x-hidden">
      {/* Hero carousel — only when browsing */}
      {showSections && heroItems.length > 0 && <Hero items={heroItems} />}

      {/* Content area */}
      <div className={`max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 ${showSections && heroItems.length > 0 ? 'pt-3 sm:pt-4' : 'pt-4 sm:pt-6'} pb-16 sm:pb-20`}>

        {/* Category pills */}
        <div className="mb-4 sm:mb-6">
          <CategoryPills
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Search results or category results */}
        {(isSearching || isFiltering) && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
              <div>
                <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-txt-primary italic">
                  {isSearching
                    ? `Results for "${filters.search}"`
                    : activeCategory
                      ? activeCategory.label
                      : 'Discover'}
                </h1>
                {!isSearching && !activeCategory && (
                  <p className="text-txt-muted text-xs sm:text-sm mt-1 font-body">Explore trending manga, manhwa & manhua</p>
                )}
              </div>
            </div>

            {isSearching && (
              <Filters filters={filters} onFilterChange={updateFilters} />
            )}

            {error && (
              <div className="mt-8 sm:mt-10 text-center py-12 sm:py-16">
                <p className="text-crimson text-base sm:text-lg font-medium">Something went wrong</p>
                <p className="text-txt-muted text-xs sm:text-sm mt-2 font-body">{error}</p>
                <button
                  onClick={() => updateFilters({})}
                  className="mt-4 px-5 py-2 bg-crimson/10 text-crimson rounded-lg hover:bg-crimson/20 transition-colors min-h-[44px] font-body"
                >
                  Try Again
                </button>
              </div>
            )}

            <div className="mt-5 sm:mt-8">
              {isFirstLoad ? (
                <GridSkeleton />
              ) : media.length === 0 ? (
                <div className="text-center py-16 sm:py-20">
                  <p className="text-txt-muted text-base sm:text-lg">No results found</p>
                  <p className="text-txt-muted/60 text-xs sm:text-sm mt-1 font-body">Try adjusting your filters or search</p>
                </div>
              ) : (
                <MediaGrid media={media} />
              )}
            </div>

            {isLoadingMore && <Spinner />}
            {!loading && pageInfo.hasNextPage && media.length > 0 && (
              <div className="flex justify-center mt-8 sm:mt-10">
                <button
                  onClick={loadMore}
                  id="load-more-btn"
                  className="group relative px-6 sm:px-8 py-3 bg-elevated hover:bg-card text-txt-secondary hover:text-txt-primary rounded-xl font-medium transition-all duration-300 hover:shadow-lg border border-line hover:border-line-hover overflow-hidden min-h-[44px] text-sm sm:text-base font-body"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Load More
                    <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-crimson/0 via-crimson/5 to-crimson/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Sections view — when not searching/filtering */}
        {showSections && (
          <>
            {sectionsLoading ? (
              <HomeSkeleton />
            ) : (
              <div className="space-y-10 sm:space-y-14">
                {sections.map((section) => (
                  <MediaRow
                    key={section.key}
                    title={section.title}
                    emoji={section.emoji}
                    media={section.media}
                  />
                ))}

                {/* Browse Genres — grid section */}
                <section>
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg md:text-xl font-semibold text-txt-primary font-body">
                      <span className="text-lg sm:text-xl">🎨</span>
                      Browse Genres
                    </h2>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
                    {GENRE_CARDS.map((genre) => (
                      <Link
                        to={`/genre/${encodeURIComponent(genre.name)}`}
                        key={genre.name}
                        className="group relative overflow-hidden rounded-xl sm:rounded-2xl aspect-[4/3] flex items-end p-2.5 sm:p-3 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${genre.color}22 0%, ${genre.color}44 100%)`,
                          border: `1px solid ${genre.color}30`,
                        }}
                      >
                        {/* Emoji background */}
                        <span
                          className="absolute top-1 right-1 sm:top-2 sm:right-2 text-2xl sm:text-3xl opacity-30 group-hover:opacity-50 transition-opacity group-hover:scale-125 duration-300"
                        >
                          {genre.emoji}
                        </span>
                        {/* Genre name */}
                        <span
                          className="relative z-10 text-[11px] sm:text-xs font-semibold leading-tight font-body"
                          style={{ color: genre.color }}
                        >
                          {genre.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
