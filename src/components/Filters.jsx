const TYPES = [
  { label: 'All', value: null },
  { label: 'Manga', value: 'JP', flag: '🇯🇵' },
  { label: 'Manhwa', value: 'KR', flag: '🇰🇷' },
  { label: 'Manhua', value: 'CN', flag: '🇨🇳' },
];

const GENRES = [
  'Action', 'Romance', 'Fantasy', 'Comedy', 'Horror', 'Drama',
  'Sci-Fi', 'Mystery', 'Thriller', 'Slice of Life', 'Adventure',
  'Supernatural', 'Psychological',
];

const SORTS = [
  { label: 'Trending', value: 'trending' },
  { label: 'Popular', value: 'popular' },
  { label: 'Top Rated', value: 'score' },
  { label: 'Latest', value: 'latest' },
];

export default function Filters({ filters, onFilterChange }) {
  const activeCountry = filters.country;
  const activeGenre = filters.genre;
  const activeSort = filters.sort;

  return (
    <div className="sticky top-14 sm:top-[60px] z-40 -mx-3 sm:-mx-6 lg:-mx-8 px-3 sm:px-6 lg:px-8 py-3 sm:py-4 frosted border-b border-line">
      <div className="max-w-[1400px] mx-auto">
        {/* Top row: Type tabs + Sort */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Type pills — scroll on mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
            {TYPES.map((t) => (
              <button
                key={t.label}
                onClick={() => onFilterChange({ country: t.value })}
                className={`shrink-0 px-3 sm:px-4 py-2 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-250 min-h-[40px] sm:min-h-[44px] ${
                  activeCountry === t.value
                    ? 'bg-crimson text-white shadow-md shadow-crimson/25'
                    : 'bg-elevated/60 text-txt-secondary hover:bg-elevated hover:text-txt-primary'
                }`}
              >
                {t.flag && <span className="mr-1">{t.flag}</span>}
                {t.label}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <select
            value={activeSort}
            onChange={(e) => onFilterChange({ sort: e.target.value })}
            className="shrink-0 bg-elevated border border-line text-xs sm:text-sm text-txt-primary rounded-lg px-2 sm:px-3 py-2 focus:outline-none focus:border-crimson/40 cursor-pointer appearance-none pr-7 sm:pr-8 min-h-[40px] sm:min-h-[44px]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7494' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 6px center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '14px',
            }}
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Genre pills - horizontal scroll */}
        <div className="flex gap-1.5 sm:gap-2 mt-2.5 sm:mt-3 overflow-x-auto hide-scrollbar pb-1 -webkit-overflow-scrolling-touch">
          <button
            onClick={() => onFilterChange({ genre: null })}
            className={`shrink-0 px-3 py-1.5 sm:py-2 rounded-full text-xs font-medium transition-all duration-200 min-h-[36px] sm:min-h-[40px] ${
              !activeGenre
                ? 'bg-white/10 text-txt-primary ring-1 ring-white/15'
                : 'bg-elevated/40 text-txt-muted hover:text-txt-secondary'
            }`}
          >
            All Genres
          </button>
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => onFilterChange({ genre: activeGenre === g ? null : g })}
              className={`shrink-0 px-3 py-1.5 sm:py-2 rounded-full text-xs font-medium transition-all duration-200 min-h-[36px] sm:min-h-[40px] ${
                activeGenre === g
                  ? 'bg-crimson/15 text-crimson ring-1 ring-crimson/30'
                  : 'bg-elevated/40 text-txt-muted hover:text-txt-secondary'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
