import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

export default function Hero({ items = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index) => {
    if (index === activeIndex || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(index);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  }, [activeIndex, isTransitioning]);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % items.length);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (!items.length) return null;
  const media = items[activeIndex];
  if (!media) return null;

  const title = media.title?.english || media.title?.romaji || '';

  return (
    <section className="relative h-[70vh] min-h-[420px] max-h-[600px] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] sm:min-h-[420px] sm:max-h-[700px] overflow-hidden -mt-14 sm:-mt-[60px]">
      {/* Background banner image */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
      >
        {media.bannerImage ? (
          <img
            src={media.bannerImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-105"
          />
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: media.coverImage?.color || '#171b2e' }} />
        )}
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/70 to-transparent hidden sm:block" />
      <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-24 bg-gradient-to-t from-primary to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-12 sm:pb-16">
        <div
          className={`w-full sm:max-w-2xl transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-x-[-10px]' : 'opacity-100 translate-x-0'}`}
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-crimson/20 border border-crimson/30 text-crimson text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-5 font-body">
            <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse" />
            Trending Now
          </span>

          {/* Title — uses Playfair Display */}
          <h2 className="font-display text-[28px] sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-white leading-[1.1] tracking-wide italic">
            {title}
          </h2>

          {/* Score + Genres */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 sm:mt-5">
            {media.averageScore && (
              <span className="flex items-center gap-1 sm:gap-1.5 bg-gold/15 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-gold font-bold text-xs sm:text-sm border border-gold/20 font-body">
                ★ {(media.averageScore / 10).toFixed(1)}
              </span>
            )}
            {media.genres?.slice(0, 2).map((g) => (
              <span key={g} className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/8 text-white/60 text-[11px] sm:text-xs border border-white/5 font-body">
                {g}
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-5 sm:mt-7">
            <Link
              to={`/manga/${media.id}`}
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 bg-crimson hover:bg-crimson-hover text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-crimson/30 active:scale-[0.98] text-sm sm:text-base min-h-[44px] font-body"
            >
              View Details
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <button className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-transparent border border-white/20 hover:border-white/40 text-white/80 hover:text-white font-medium rounded-xl transition-all duration-300 hover:bg-white/5 text-sm sm:text-base min-h-[44px] font-body">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add to List
            </button>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      {items.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`transition-all duration-300 rounded-full min-h-[20px] min-w-[20px] flex items-center justify-center ${
                i === activeIndex
                  ? 'w-8 h-2 bg-crimson'
                  : 'w-2 h-2 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
