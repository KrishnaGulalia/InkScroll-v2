const CATEGORIES = [
  { label: 'Trending Manhwa', icon: '⚡', sort: 'trending', country: 'KR', status: null },
  { label: 'Trending Manga', icon: '🔥', sort: 'trending', country: 'JP', status: null },
  { label: 'Top Rated', icon: '⭐', sort: 'score', country: null, status: null },
  { label: 'New Releases', icon: '🆕', sort: 'latest', country: null, status: null },
  { label: 'Completed', icon: '✅', sort: 'popular', country: null, status: 'FINISHED' },
];

export default function CategoryPills({ activeCategory, onCategoryChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-1 -mx-1 px-1">
      {/* "For You" default */}
      <button
        onClick={() => onCategoryChange(null)}
        className={`shrink-0 snap-start flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 min-h-[44px] font-body ${
          !activeCategory
            ? 'bg-crimson text-white shadow-md shadow-crimson/25'
            : 'bg-elevated/60 text-txt-secondary hover:bg-elevated hover:text-txt-primary'
        }`}
      >
        <span>🏠</span>
        <span className="whitespace-nowrap">For You</span>
      </button>

      {CATEGORIES.map((cat) => (
        <button
          key={cat.label}
          onClick={() => onCategoryChange(cat)}
          className={`shrink-0 snap-start flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 min-h-[44px] font-body ${
            activeCategory?.label === cat.label
              ? 'bg-crimson text-white shadow-md shadow-crimson/25'
              : 'bg-elevated/60 text-txt-secondary hover:bg-elevated hover:text-txt-primary'
          }`}
        >
          <span>{cat.icon}</span>
          <span className="whitespace-nowrap">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
