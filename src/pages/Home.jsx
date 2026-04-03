import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
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

export default function Home({ searchQuery }) {
  const { media, loading, error, pageInfo, filters, updateFilters, loadMore } = useMediaList();
  const { sections, heroItems, loading: sectionsLoading } = useHomeSections();
  const [activeCategory, setActiveCategory] = useState(null);
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
      // Reset to default (For You)
      updateFilters({ sort: 'trending', country: null, status: null });
    } else {
      updateFilters({
        sort: category.sort,
        country: category.country,
        status: category.status,
      });
    }
  };

  const isSearching = !!filters.search;
  const isCategoryActive = !!activeCategory;
  const isFiltering = !!filters.genre || isCategoryActive;
  const showSections = !isSearching && !isFiltering;
  const isFirstLoad = loading && media.length === 0;
  const isLoadingMore = loading && media.length > 0;

  return (
    <div className="min-h-screen animate-fadeIn overflow-x-hidden">
      {/* Hero carousel — only when browsing (no search/filter/category) */}
      {showSections && heroItems.length > 0 && <Hero items={heroItems} />}

      {/* Content area */}
      <div className={`max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 ${showSections && heroItems.length > 0 ? 'pt-3 sm:pt-4' : 'pt-16 sm:pt-20'} pb-16 sm:pb-20`}>

        {/* Category pills — always visible between hero and content */}
        <div className="mb-4 sm:mb-6">
          <CategoryPills
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Search results or category results */}
        {(isSearching || isFiltering) && (
          <>
            {/* Section header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
              <div>
                <h1 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-txt-primary">
                  {isSearching
                    ? `Results for "${filters.search}"`
                    : activeCategory
                      ? activeCategory.label
                      : 'Discover'}
                </h1>
                {!isSearching && !activeCategory && (
                  <p className="text-txt-muted text-xs sm:text-sm mt-1">Explore trending manga, manhwa & manhua</p>
                )}
              </div>
            </div>

            {isSearching && (
              <Filters filters={filters} onFilterChange={updateFilters} />
            )}

            {/* Error */}
            {error && (
              <div className="mt-8 sm:mt-10 text-center py-12 sm:py-16">
                <p className="text-crimson text-base sm:text-lg font-medium">Something went wrong</p>
                <p className="text-txt-muted text-xs sm:text-sm mt-2">{error}</p>
                <button
                  onClick={() => updateFilters({})}
                  className="mt-4 px-5 py-2 bg-crimson/10 text-crimson rounded-lg hover:bg-crimson/20 transition-colors min-h-[44px]"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Grid */}
            <div className="mt-5 sm:mt-8">
              {isFirstLoad ? (
                <GridSkeleton />
              ) : media.length === 0 ? (
                <div className="text-center py-16 sm:py-20">
                  <p className="text-txt-muted text-base sm:text-lg">No results found</p>
                  <p className="text-txt-muted/60 text-xs sm:text-sm mt-1">Try adjusting your filters or search</p>
                </div>
              ) : (
                <MediaGrid media={media} />
              )}
            </div>

            {/* Load More */}
            {isLoadingMore && <Spinner />}
            {!loading && pageInfo.hasNextPage && media.length > 0 && (
              <div className="flex justify-center mt-8 sm:mt-10">
                <button
                  onClick={loadMore}
                  id="load-more-btn"
                  className="group relative px-6 sm:px-8 py-3 bg-elevated hover:bg-card text-txt-secondary hover:text-txt-primary rounded-xl font-medium transition-all duration-300 hover:shadow-lg border border-line hover:border-line-hover overflow-hidden min-h-[44px] text-sm sm:text-base"
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
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
