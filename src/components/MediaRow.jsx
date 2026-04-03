import { useRef, useState, useEffect } from 'react';
import MediaCard from './MediaCard';

export default function MediaRow({ title, emoji, media = [] }) {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => {
      setShowLeft(el.scrollLeft > 20);
      setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 20);
    };
    check();
    el.addEventListener('scroll', check, { passive: true });
    return () => el.removeEventListener('scroll', check);
  }, [media]);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amount = dir === 'left' ? -400 : 400;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  if (!media?.length) return null;

  return (
    <section className="relative">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3 sm:mb-5">
        <h2 className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg md:text-xl font-semibold text-txt-primary">
          {emoji && <span className="text-lg sm:text-xl">{emoji}</span>}
          {title}
        </h2>
        <button className="text-[11px] sm:text-xs text-txt-secondary hover:text-crimson transition-colors font-medium flex items-center gap-1 group min-h-[44px] px-2">
          View All
          <svg className="w-3 sm:w-3.5 h-3 sm:h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Scroll container */}
      <div className="relative group/row">
        {/* Left arrow — desktop only */}
        {showLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-8 z-10 w-10 sm:w-12 bg-gradient-to-r from-primary via-primary/80 to-transparent hidden sm:flex items-center justify-start pl-1 opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-elevated/80 backdrop-blur-sm border border-line-hover flex items-center justify-center hover:bg-crimson/20 hover:border-crimson/30 transition-all">
              <svg className="w-4 h-4 text-txt-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </button>
        )}

        {/* Cards row — smooth touch scroll, show partial next card */}
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-2 -mx-1 px-1"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {media.map((item, i) => (
            <MediaCard key={item.id} media={item} index={i} size="large" />
          ))}
        </div>

        {/* Right arrow — desktop only */}
        {showRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-8 z-10 w-10 sm:w-12 bg-gradient-to-l from-primary via-primary/80 to-transparent hidden sm:flex items-center justify-end pr-1 opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-elevated/80 backdrop-blur-sm border border-line-hover flex items-center justify-center hover:bg-crimson/20 hover:border-crimson/30 transition-all">
              <svg className="w-4 h-4 text-txt-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        )}
      </div>
    </section>
  );
}
