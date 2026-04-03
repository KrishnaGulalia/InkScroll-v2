import { HomeIcon, ArrowTrendingUpIcon, FireIcon, StarIcon, CalendarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const CATEGORIES = [
  { label: 'Trending Manhwa', icon: ArrowTrendingUpIcon, sort: 'trending', country: 'KR', status: null },
  { label: 'Trending Manga', icon: FireIcon, sort: 'trending', country: 'JP', status: null },
  { label: 'Top Rated', icon: StarIcon, sort: 'score', country: null, status: null },
  { label: 'New Releases', icon: CalendarIcon, sort: 'latest', country: null, status: null },
  { label: 'Completed', icon: CheckCircleIcon, sort: 'popular', country: null, status: 'FINISHED' },
];

export default function CategoryPills({ activeCategory, onCategoryChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-1 -mx-1 px-1">
      {/* "For You" default */}
      <button
        onClick={() => onCategoryChange(null)}
        className={`shrink-0 snap-start flex items-center gap-1.5 px-4 h-9 rounded-full text-[13px] font-medium transition-all duration-200 font-body border ${
          !activeCategory
            ? 'bg-crimson border-crimson text-white shadow-md shadow-crimson/20'
            : 'bg-card border-line text-txt-muted hover:bg-elevated hover:text-txt-primary hover:border-line-hover'
        }`}
      >
        <HomeIcon className="w-4 h-4" />
        <span className="whitespace-nowrap">For You</span>
      </button>

      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        return (
          <button
            key={cat.label}
            onClick={() => onCategoryChange(cat)}
            className={`shrink-0 snap-start flex items-center gap-1.5 px-4 h-9 rounded-full text-[13px] font-medium transition-all duration-200 font-body border ${
              activeCategory?.label === cat.label
                ? 'bg-crimson border-crimson text-white shadow-md shadow-crimson/20'
                : 'bg-card border-line text-txt-muted hover:bg-elevated hover:text-txt-primary hover:border-line-hover'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="whitespace-nowrap">{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
