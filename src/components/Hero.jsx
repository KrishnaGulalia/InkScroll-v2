import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AddToListButton from './AddToListButton';

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
    <section className="relative h-[70vh] min-h-[420px] max-h-[600px] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] sm:min-h-[420px] sm:max-h-[700px] -mt-14 sm:-mt-[60px]">
      {/* Background container with overflow hidden to prevent scale-105 leaking */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Background images */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
        >
        {/* Desktop Banner (Horizontal) - Positioned upper-center to preserve faces */}
        {media.bannerImage && (
          <img
            src={media.bannerImage}
            alt=""
            className="hidden sm:block absolute inset-0 w-full h-full object-cover object-[center_15%] md:object-[center_20%] scale-105"
          />
        )}
        
        {/* Mobile Banner (Vertical Cover Art) - Perfect 2:3 ratio for mobile screens */}
        {(media.coverImage?.extraLarge || media.bannerImage) && (
          <img
            src={media.coverImage?.extraLarge || media.bannerImage}
            alt=""
            className={`${media.bannerImage ? 'block sm:hidden' : 'block'} absolute inset-0 w-full h-full object-cover object-top opacity-75`}
          />
        )}

        {!media.bannerImage && !media.coverImage?.extraLarge && (
          <div className="absolute inset-0" style={{ backgroundColor: media.coverImage?.color || '#171b2e' }} />
        )}
        </div>
      </div>

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/40 to-transparent hidden sm:block" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-primary to-transparent" />
      </div>

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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-2 sm:gap-3 mt-5 sm:mt-7">
            <Link
              to={`/manga/${media.id}`}
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 bg-crimson hover:bg-crimson-hover text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-crimson/30 active:scale-[0.98] text-sm sm:text-base min-h-[44px] font-body"
            >
              View Details
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <div className="min-w-[160px]">
              <AddToListButton media={media} />
            </div>
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
