import { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import { useMediaList } from '../hooks/useAniList';
import { useHomeSections } from '../hooks/useHomeSections';
import Hero from '../components/Hero';
import FilterBar from '../components/FilterBar';
import CategoryPills from '../components/CategoryPills';
import MediaGrid from '../components/MediaGrid';
import MediaRow from '../components/MediaRow';
import { GridSkeleton, HomeSkeleton, Spinner } from '../components/Loader';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

// Persist scroll position across navigations
const scrollStore = { y: 0, path: '/' };

const GENRE_CARDS = [
  { name: 'Action', color: '#e63946' },
  { name: 'Romance', color: '#ec4899' },
  { name: 'Fantasy', color: '#8b5cf6' },
  { name: 'Horror', color: '#374151' },
  { name: 'Comedy', color: '#eab308' },
  { name: 'Drama', color: '#3b82f6' },
  { name: 'Adventure', color: '#22c55e' },
  { name: 'Mystery', color: '#6366f1' },
  { name: 'Sci-Fi', color: '#06b6d4' },
  { name: 'Slice of Life', color: '#f97316' },
  { name: 'Sports', color: '#14b8a6' },
  { name: 'Supernatural', color: '#a855f7' },
  { name: 'Psychological', color: '#6d28d9' },
  { name: 'Historical', color: '#92400e' },
  { name: 'Mecha', color: '#64748b' },
  { name: 'Music', color: '#f472b6' },
];

export default function Home({ searchQuery }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const scrollRestored = useRef(false);

  const hasUrlFilters = Array.from(searchParams.keys()).length > 0;
  const isSearching = !!searchQuery;
  const showSections = !isSearching && !hasUrlFilters;
  
  const { media, loading, error, pageInfo, filters, updateFilters, loadMore } = useMediaList({ skip: showSections });
  const { sections, heroItems, loading: sectionsLoading } = useHomeSections();

  // Sync URL params to useMediaList internal filters
  useEffect(() => {
    updateFilters({
      search: searchQuery || '',
      country: searchParams.get('country') || null,
      genre: searchParams.get('genre') || null,
      sort: searchParams.get('sort') ? [searchParams.get('sort')] : null,
      status: searchParams.get('status') || null,
      format: searchParams.get('format') || null,
    });
  }, [searchQuery, searchParams, updateFilters]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, typeof value === 'object' ? value[0] : value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

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

  const isFirstLoad = loading && media.length === 0;
  const isLoadingMore = loading && media.length > 0;

  return (
    <div className="min-h-screen animate-fadeIn overflow-x-hidden">
      {/* Hero carousel — only when browsing */}
      {showSections && heroItems.length > 0 && <Hero items={heroItems} />}

      {/* Content area */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-10 pb-16 sm:pb-24 flex flex-col gap-8 sm:gap-10">

        {/* Category Pills (Visible everywhere on Home) */}
        <section className="pt-2 sm:pt-4">
          <CategoryPills 
            activeCategory={null} 
            onCategoryChange={(cat) => {
              if (!cat) handleClearFilters();
              else {
                const newParams = new URLSearchParams();
                if (cat.sort) newParams.set('sort', cat.sort);
                if (cat.country) newParams.set('country', cat.country);
                if (cat.status) newParams.set('status', cat.status);
                setSearchParams(newParams);
              }
            }} 
          />
        </section>

        {/* Home Sections (Default view) */}
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
                    media={section.media}
                  />
                ))}

                {/* Browse Genres — grid section */}
                <section>
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="font-display text-[22px] font-bold text-txt-primary border-l-[3px] border-crimson pl-3 leading-tight tracking-wide">
                      Browse Genres
                    </h2>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
                    {GENRE_CARDS.map((genre) => (
                      <Link
                        to={`/?genre=${encodeURIComponent(genre.name)}`}
                        key={genre.name}
                        className="group relative overflow-hidden rounded-xl sm:rounded-2xl aspect-[4/3] flex items-end p-2.5 sm:p-3 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${genre.color}22 0%, ${genre.color}44 100%)`,
                          border: `1px solid ${genre.color}30`,
                        }}
                      >
                        {/* Text watermark background */}
                        <span
                          className="absolute -top-2 -right-1 text-5xl opacity-10 font-display font-bold group-hover:scale-110 transition-transform duration-300"
                          style={{ color: genre.color }}
                        >
                          {genre.name.charAt(0)}
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

        {/* Search results or category results */}
        {/* Browsing / Grid View */}
        {!showSections && (
          <div className="animate-fadeIn mt-4">
            {/* Back button and View Header */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={handleClearFilters}
                className="flex items-center justify-center p-2 rounded-full bg-elevated/80 border border-line hover:border-crimson hover:text-crimson transition-all"
                title="Back to For You"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-txt-primary tracking-wide">
                {isSearching ? `Search: "${searchQuery}"` : 'Discover Catalog'}
              </h1>
            </div>

            {/* Comprehensive Filter Bar */}
            <FilterBar 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              onClear={handleClearFilters} 
              resultsCount={pageInfo?.total}
            />

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
            {!loading && pageInfo?.hasNextPage && media.length > 0 && (
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
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
